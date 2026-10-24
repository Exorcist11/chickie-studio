package com.chickiestudio.product.service.impl;

import com.chickiestudio.category.entity.Category;
import com.chickiestudio.category.repository.CategoryRepository;
import com.chickiestudio.common.exception.BadRequestException;
import com.chickiestudio.common.exception.ConflictException;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import com.chickiestudio.common.util.SlugUtils;
import com.chickiestudio.product.dto.CreateProductRequest;
import com.chickiestudio.product.dto.ProductDetailResponse;
import com.chickiestudio.product.dto.ProductImageRequest;
import com.chickiestudio.product.dto.ProductListResponse;
import com.chickiestudio.product.dto.ProductVariantRequest;
import com.chickiestudio.product.dto.UpdateProductRequest;
import com.chickiestudio.product.entity.Product;
import com.chickiestudio.product.entity.ProductImage;
import com.chickiestudio.product.entity.ProductStatus;
import com.chickiestudio.product.entity.ProductVariant;
import com.chickiestudio.product.mapper.ProductMapper;
import com.chickiestudio.product.repository.ProductRepository;
import com.chickiestudio.product.repository.ProductVariantRepository;
import com.chickiestudio.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional
    public ProductDetailResponse createProduct(CreateProductRequest request) {
        log.info("Creating new product with name: {}", request.getName());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + request.getCategoryId()));

        // 1. Resolve & validate Product Code
        String productCode = resolveProductCode(request.getProductCode());
        if (productRepository.existsByProductCode(productCode)) {
            throw new ConflictException("Mã sản phẩm đã tồn tại: " + productCode);
        }

        // 2. Resolve & validate Slug
        String slug = resolveSlug(request.getSlug(), request.getName());
        if (productRepository.existsBySlug(slug)) {
            throw new ConflictException("Đường dẫn sản phẩm (slug) đã tồn tại: " + slug);
        }

        // 3. Build Product Entity
        Product product = Product.builder()
                .category(category)
                .productCode(productCode)
                .name(request.getName().trim())
                .slug(slug)
                .description(request.getDescription())
                .material(request.getMaterial())
                .occasion(request.getOccasion())
                .rentalPrice(request.getRentalPrice())
                .depositPrice(request.getDepositPrice())
                .status(request.getStatus() != null ? request.getStatus() : ProductStatus.ACTIVE)
                .build();

        // 4. Attach Variants
        attachVariants(product, request.getVariants(), null);

        // 5. Attach Images
        attachImages(product, request.getImages());

        Product saved = productRepository.save(product);
        log.info("Successfully created product ID: {}, code: {}", saved.getId(), saved.getProductCode());
        return productMapper.toDetailResponse(saved);
    }

    @Override
    @Transactional
    public ProductDetailResponse updateProduct(Long id, UpdateProductRequest request) {
        log.info("Updating product ID: {}", id);

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + request.getCategoryId()));

        // 1. Resolve & validate Product Code
        String productCode = resolveProductCode(request.getProductCode());
        if (productRepository.existsByProductCodeAndIdNot(productCode, id)) {
            throw new ConflictException("Mã sản phẩm đã tồn tại: " + productCode);
        }

        // 2. Resolve & validate Slug
        String slug = resolveSlug(request.getSlug(), request.getName());
        if (productRepository.existsBySlugAndIdNot(slug, id)) {
            throw new ConflictException("Đường dẫn sản phẩm (slug) đã tồn tại: " + slug);
        }

        // 3. Update main fields
        product.setCategory(category);
        product.setProductCode(productCode);
        product.setName(request.getName().trim());
        product.setSlug(slug);
        product.setDescription(request.getDescription());
        product.setMaterial(request.getMaterial());
        product.setOccasion(request.getOccasion());
        product.setRentalPrice(request.getRentalPrice());
        product.setDepositPrice(request.getDepositPrice());
        product.setStatus(request.getStatus());

        // 4. Update Variants
        product.getVariants().clear();
        attachVariants(product, request.getVariants(), id);

        // 5. Update Images
        product.getImages().clear();
        attachImages(product, request.getImages());

        Product updated = productRepository.save(product);
        log.info("Successfully updated product ID: {}", updated.getId());
        return productMapper.toDetailResponse(updated);
    }

    @Override
    public ProductDetailResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));
        return productMapper.toDetailResponse(product);
    }

    @Override
    public ProductDetailResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với slug: " + slug));
        return productMapper.toDetailResponse(product);
    }

    @Override
    public Page<ProductListResponse> getProductsForAdmin(
            Long categoryId,
            ProductStatus status,
            String search,
            Pageable pageable
    ) {
        String trimmedSearch = (search != null && !search.isBlank()) ? search.trim() : null;
        Page<Product> productPage = productRepository.searchProducts(categoryId, status, trimmedSearch, pageable);
        return productPage.map(productMapper::toListResponse);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + id));
        log.info("Deleting product ID: {}", id);
        productRepository.delete(product);
    }

    // ----------------- Private Helper Methods -----------------

    private String resolveProductCode(String productCode) {
        if (productCode == null || productCode.isBlank()) {
            return "PRD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ENGLISH);
        }
        return productCode.trim().toUpperCase(Locale.ENGLISH);
    }

    private String resolveSlug(String slug, String name) {
        if (slug != null && !slug.isBlank()) {
            return SlugUtils.toSlug(slug);
        }
        return SlugUtils.toSlug(name);
    }

    private void attachVariants(Product product, List<ProductVariantRequest> variantRequests, Long currentProductId) {
        if (variantRequests == null || variantRequests.isEmpty()) {
            throw new BadRequestException("Sản phẩm phải có ít nhất 1 biến thể");
        }

        Set<String> processedSkus = new HashSet<>();

        for (ProductVariantRequest vr : variantRequests) {
            String size = vr.getSize().trim().toUpperCase(Locale.ENGLISH);
            String color = vr.getColor().trim();
            String sku = (vr.getSku() != null && !vr.getSku().isBlank())
                    ? vr.getSku().trim().toUpperCase(Locale.ENGLISH)
                    : generateSku(product.getProductCode(), size, color);

            if (processedSkus.contains(sku)) {
                throw new ConflictException("Mã SKU bị trùng lặp trong danh sách biến thể: " + sku);
            }
            processedSkus.add(sku);

            if (currentProductId == null) {
                if (productVariantRepository.existsBySku(sku)) {
                    throw new ConflictException("Mã SKU đã tồn tại trên hệ thống: " + sku);
                }
            } else {
                if (productVariantRepository.existsBySkuAndIdNot(sku, vr.getId() != null ? vr.getId() : -1L)) {
                    throw new ConflictException("Mã SKU đã tồn tại trên hệ thống: " + sku);
                }
            }

            ProductVariant variant = ProductVariant.builder()
                    .size(size)
                    .color(color)
                    .sku(sku)
                    .build();

            product.addVariant(variant);
        }
    }

    private void attachImages(Product product, List<ProductImageRequest> imageRequests) {
        if (imageRequests == null || imageRequests.isEmpty()) {
            throw new BadRequestException("Sản phẩm phải có ít nhất 1 hình ảnh");
        }

        boolean hasThumbnail = imageRequests.stream()
                .anyMatch(img -> Boolean.TRUE.equals(img.getIsThumbnail()));

        for (int i = 0; i < imageRequests.size(); i++) {
            ProductImageRequest ir = imageRequests.get(i);
            boolean isThumb = Boolean.TRUE.equals(ir.getIsThumbnail()) || (!hasThumbnail && i == 0);

            ProductImage image = ProductImage.builder()
                    .imageUrl(ir.getImageUrl().trim())
                    .isThumbnail(isThumb)
                    .displayOrder(ir.getDisplayOrder() != null ? ir.getDisplayOrder() : i)
                    .build();

            product.addImage(image);
        }
    }

    private String generateSku(String productCode, String size, String color) {
        String cleanColor = SlugUtils.toSlug(color).replace("-", "").toUpperCase(Locale.ENGLISH);
        if (cleanColor.length() > 4) {
            cleanColor = cleanColor.substring(0, 4);
        }
        return productCode + "-" + size + "-" + cleanColor;
    }
}
