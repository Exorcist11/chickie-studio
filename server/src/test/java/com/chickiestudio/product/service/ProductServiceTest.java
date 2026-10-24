package com.chickiestudio.product.service;

import com.chickiestudio.category.entity.Category;
import com.chickiestudio.category.repository.CategoryRepository;
import com.chickiestudio.common.exception.BadRequestException;
import com.chickiestudio.common.exception.ConflictException;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import com.chickiestudio.product.dto.CreateProductRequest;
import com.chickiestudio.product.dto.ProductDetailResponse;
import com.chickiestudio.product.dto.ProductImageRequest;
import com.chickiestudio.product.dto.ProductImageResponse;
import com.chickiestudio.product.dto.ProductListResponse;
import com.chickiestudio.product.dto.ProductVariantRequest;
import com.chickiestudio.product.dto.ProductVariantResponse;
import com.chickiestudio.product.dto.UpdateProductRequest;
import com.chickiestudio.product.entity.Product;
import com.chickiestudio.product.entity.ProductImage;
import com.chickiestudio.product.entity.ProductStatus;
import com.chickiestudio.product.entity.ProductVariant;
import com.chickiestudio.product.mapper.ProductMapper;
import com.chickiestudio.product.repository.ProductRepository;
import com.chickiestudio.product.repository.ProductVariantRepository;
import com.chickiestudio.product.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductVariantRepository productVariantRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductServiceImpl productService;

    private Category sampleCategory;
    private Product sampleProduct;
    private ProductDetailResponse sampleDetailResponse;
    private CreateProductRequest validCreateRequest;

    @BeforeEach
    void setUp() {
        sampleCategory = Category.builder()
                .id(1L)
                .name("Váy Dạ Hội")
                .slug("vay-da-hoi")
                .build();

        sampleProduct = Product.builder()
                .id(10L)
                .category(sampleCategory)
                .productCode("PRD-LUA-TRANG")
                .name("Váy Lụa Trắng Cổ Yếm")
                .slug("vay-lua-trang-co-yem")
                .description("Váy thiết kế cổ yếm lụa tơ tằm")
                .material("Lụa")
                .occasion("Tiệc, Ngoại cảnh")
                .rentalPrice(new BigDecimal("350000.00"))
                .depositPrice(new BigDecimal("500000.00"))
                .status(ProductStatus.ACTIVE)
                .variants(new ArrayList<>())
                .images(new ArrayList<>())
                .build();

        sampleDetailResponse = ProductDetailResponse.builder()
                .id(10L)
                .categoryId(1L)
                .categoryName("Váy Dạ Hội")
                .productCode("PRD-LUA-TRANG")
                .name("Váy Lụa Trắng Cổ Yếm")
                .slug("vay-lua-trang-co-yem")
                .rentalPrice(new BigDecimal("350000.00"))
                .depositPrice(new BigDecimal("500000.00"))
                .status(ProductStatus.ACTIVE)
                .variants(List.of(
                        new ProductVariantResponse(1L, "S", "Trắng", "PRD-LUA-TRANG-S-TRAN", LocalDateTime.now())
                ))
                .images(List.of(
                        new ProductImageResponse(1L, "https://example.com/img1.jpg", true, 0)
                ))
                .build();

        validCreateRequest = CreateProductRequest.builder()
                .categoryId(1L)
                .productCode("PRD-LUA-TRANG")
                .name("Váy Lụa Trắng Cổ Yếm")
                .slug("vay-lua-trang-co-yem")
                .description("Váy thiết kế cổ yếm")
                .material("Lụa")
                .occasion("Dự tiệc")
                .rentalPrice(new BigDecimal("350000.00"))
                .depositPrice(new BigDecimal("500000.00"))
                .status(ProductStatus.ACTIVE)
                .variants(List.of(
                        ProductVariantRequest.builder().size("S").color("Trắng").sku("PRD-LUA-TRANG-S-TRAN").build(),
                        ProductVariantRequest.builder().size("M").color("Trắng").sku("PRD-LUA-TRANG-M-TRAN").build()
                ))
                .images(List.of(
                        ProductImageRequest.builder().imageUrl("https://example.com/img1.jpg").isThumbnail(true).displayOrder(0).build()
                ))
                .build();
    }

    @Test
    @DisplayName("Tạo sản phẩm thành công với đầy đủ thông tin hợp lệ")
    void createProduct_validRequest_shouldCreateAndReturnResponse() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(productRepository.existsByProductCode("PRD-LUA-TRANG")).thenReturn(false);
        when(productRepository.existsBySlug("vay-lua-trang-co-yem")).thenReturn(false);
        when(productVariantRepository.existsBySku(anyString())).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(sampleProduct);
        when(productMapper.toDetailResponse(any(Product.class))).thenReturn(sampleDetailResponse);

        ProductDetailResponse result = productService.createProduct(validCreateRequest);

        assertNotNull(result);
        assertEquals("PRD-LUA-TRANG", result.getProductCode());
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("Tạo sản phẩm tự sinh productCode, slug và SKU khi để trống")
    void createProduct_whenEmptyCodeAndSlug_shouldAutoGenerate() {
        CreateProductRequest request = CreateProductRequest.builder()
                .categoryId(1L)
                .name("Váy Thiết Kế Mới")
                .rentalPrice(new BigDecimal("200000.00"))
                .depositPrice(new BigDecimal("300000.00"))
                .variants(List.of(
                        ProductVariantRequest.builder().size("L").color("Đỏ Nhung").build()
                ))
                .images(List.of(
                        ProductImageRequest.builder().imageUrl("https://example.com/red.jpg").isThumbnail(false).build()
                ))
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(productRepository.existsByProductCode(anyString())).thenReturn(false);
        when(productRepository.existsBySlug(anyString())).thenReturn(false);
        when(productVariantRepository.existsBySku(anyString())).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(sampleProduct);
        when(productMapper.toDetailResponse(any(Product.class))).thenReturn(sampleDetailResponse);

        ProductDetailResponse result = productService.createProduct(request);

        assertNotNull(result);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    @DisplayName("Ném lỗi ResourceNotFoundException khi danh mục không tồn tại")
    void createProduct_whenCategoryNotFound_shouldThrowResourceNotFoundException() {
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());
        validCreateRequest.setCategoryId(999L);

        assertThrows(ResourceNotFoundException.class, () -> productService.createProduct(validCreateRequest));
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném lỗi ConflictException khi trùng productCode")
    void createProduct_whenProductCodeExists_shouldThrowConflictException() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(productRepository.existsByProductCode("PRD-LUA-TRANG")).thenReturn(true);

        assertThrows(ConflictException.class, () -> productService.createProduct(validCreateRequest));
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném lỗi ConflictException khi trùng slug")
    void createProduct_whenSlugExists_shouldThrowConflictException() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(productRepository.existsByProductCode("PRD-LUA-TRANG")).thenReturn(false);
        when(productRepository.existsBySlug("vay-lua-trang-co-yem")).thenReturn(true);

        assertThrows(ConflictException.class, () -> productService.createProduct(validCreateRequest));
        verify(productRepository, never()).save(any());
    }

    @Test
    @DisplayName("Ném lỗi ConflictException khi danh sách biến thể có SKU trùng lặp nội bộ")
    void createProduct_whenDuplicateSkuInRequest_shouldThrowConflictException() {
        validCreateRequest.setVariants(List.of(
                ProductVariantRequest.builder().size("S").color("Trắng").sku("SKU-001").build(),
                ProductVariantRequest.builder().size("M").color("Trắng").sku("SKU-001").build()
        ));

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(productRepository.existsByProductCode(anyString())).thenReturn(false);
        when(productRepository.existsBySlug(anyString())).thenReturn(false);

        assertThrows(ConflictException.class, () -> productService.createProduct(validCreateRequest));
    }

    @Test
    @DisplayName("Ném lỗi ConflictException khi SKU biến thể đã tồn tại trong DB")
    void createProduct_whenSkuExistsInDb_shouldThrowConflictException() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(productRepository.existsByProductCode(anyString())).thenReturn(false);
        when(productRepository.existsBySlug(anyString())).thenReturn(false);
        when(productVariantRepository.existsBySku("PRD-LUA-TRANG-S-TRAN")).thenReturn(true);

        assertThrows(ConflictException.class, () -> productService.createProduct(validCreateRequest));
    }

    @Test
    @DisplayName("Ném lỗi BadRequestException khi danh sách biến thể rỗng")
    void createProduct_whenVariantsEmpty_shouldThrowBadRequestException() {
        validCreateRequest.setVariants(Collections.emptyList());
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));

        assertThrows(BadRequestException.class, () -> productService.createProduct(validCreateRequest));
    }

    @Test
    @DisplayName("Ném lỗi BadRequestException khi danh sách ảnh rỗng")
    void createProduct_whenImagesEmpty_shouldThrowBadRequestException() {
        validCreateRequest.setImages(Collections.emptyList());
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));

        assertThrows(BadRequestException.class, () -> productService.createProduct(validCreateRequest));
    }

    @Test
    @DisplayName("Cập nhật sản phẩm thành công")
    void updateProduct_validRequest_shouldUpdateAndReturnResponse() {
        UpdateProductRequest updateRequest = UpdateProductRequest.builder()
                .categoryId(1L)
                .productCode("PRD-LUA-TRANG")
                .name("Váy Lụa Trắng Cổ Yếm Cao Cấp")
                .slug("vay-lua-trang-co-yem-cao-cap")
                .rentalPrice(new BigDecimal("400000.00"))
                .depositPrice(new BigDecimal("600000.00"))
                .status(ProductStatus.ACTIVE)
                .variants(List.of(
                        ProductVariantRequest.builder().size("S").color("Trắng").sku("PRD-LUA-TRANG-S-TRAN").build()
                ))
                .images(List.of(
                        ProductImageRequest.builder().imageUrl("https://example.com/img2.jpg").isThumbnail(true).build()
                ))
                .build();

        when(productRepository.findById(10L)).thenReturn(Optional.of(sampleProduct));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(productRepository.existsByProductCodeAndIdNot("PRD-LUA-TRANG", 10L)).thenReturn(false);
        when(productRepository.existsBySlugAndIdNot("vay-lua-trang-co-yem-cao-cap", 10L)).thenReturn(false);
        when(productVariantRepository.existsBySkuAndIdNot(anyString(), anyLong())).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(sampleProduct);
        when(productMapper.toDetailResponse(any(Product.class))).thenReturn(sampleDetailResponse);

        ProductDetailResponse result = productService.updateProduct(10L, updateRequest);

        assertNotNull(result);
        verify(productRepository).save(sampleProduct);
    }

    @Test
    @DisplayName("Cập nhật ném ResourceNotFoundException khi không tìm thấy sản phẩm")
    void updateProduct_whenNotFound_shouldThrowResourceNotFoundException() {
        UpdateProductRequest updateRequest = UpdateProductRequest.builder().categoryId(1L).build();
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.updateProduct(999L, updateRequest));
    }

    @Test
    @DisplayName("Cập nhật ném ConflictException khi productCode trùng với sản phẩm khác")
    void updateProduct_whenProductCodeConflict_shouldThrowConflictException() {
        UpdateProductRequest updateRequest = UpdateProductRequest.builder()
                .categoryId(1L)
                .productCode("PRD-OTHER")
                .name("Name")
                .build();

        when(productRepository.findById(10L)).thenReturn(Optional.of(sampleProduct));
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(productRepository.existsByProductCodeAndIdNot("PRD-OTHER", 10L)).thenReturn(true);

        assertThrows(ConflictException.class, () -> productService.updateProduct(10L, updateRequest));
    }

    @Test
    @DisplayName("Lấy chi tiết sản phẩm theo ID thành công")
    void getProductById_whenExists_shouldReturnDetail() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(sampleProduct));
        when(productMapper.toDetailResponse(sampleProduct)).thenReturn(sampleDetailResponse);

        ProductDetailResponse result = productService.getProductById(10L);

        assertNotNull(result);
        assertEquals(10L, result.getId());
    }

    @Test
    @DisplayName("Lấy chi tiết sản phẩm theo ID ném ResourceNotFoundException khi không tồn tại")
    void getProductById_whenNotFound_shouldThrowResourceNotFoundException() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById(999L));
    }

    @Test
    @DisplayName("Lấy chi tiết sản phẩm theo Slug thành công")
    void getProductBySlug_whenExists_shouldReturnDetail() {
        when(productRepository.findBySlug("vay-lua-trang-co-yem")).thenReturn(Optional.of(sampleProduct));
        when(productMapper.toDetailResponse(sampleProduct)).thenReturn(sampleDetailResponse);

        ProductDetailResponse result = productService.getProductBySlug("vay-lua-trang-co-yem");

        assertNotNull(result);
        assertEquals("vay-lua-trang-co-yem", result.getSlug());
    }

    @Test
    @DisplayName("Lấy danh sách sản phẩm phân trang cho Admin thành công")
    void getProductsForAdmin_shouldReturnPagedList() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> page = new PageImpl<>(List.of(sampleProduct));

        ProductListResponse listResponse = ProductListResponse.builder()
                .id(10L)
                .productCode("PRD-LUA-TRANG")
                .name("Váy Lụa Trắng Cổ Yếm")
                .slug("vay-lua-trang-co-yem")
                .rentalPrice(new BigDecimal("350000.00"))
                .depositPrice(new BigDecimal("500000.00"))
                .status(ProductStatus.ACTIVE)
                .variantCount(1)
                .thumbnailUrl("https://example.com/img1.jpg")
                .build();

        when(productRepository.searchProducts(1L, ProductStatus.ACTIVE, "Lụa", pageable)).thenReturn(page);
        when(productMapper.toListResponse(sampleProduct)).thenReturn(listResponse);

        Page<ProductListResponse> result = productService.getProductsForAdmin(1L, ProductStatus.ACTIVE, "  Lụa  ", pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    @DisplayName("Lấy danh sách sản phẩm theo CategoryType (COSTUME/CAMERA/PHOTOGRAPHY)")
    void getProducts_withCategoryType_shouldCallRepository() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> page = new PageImpl<>(List.of(sampleProduct), pageable, 1);
        ProductListResponse listResponse = ProductListResponse.builder()
                .id(10L)
                .name("Váy Lụa Trắng Cổ Yếm")
                .slug("vay-lua-trang-co-yem")
                .rentalPrice(new BigDecimal("350000.00"))
                .depositPrice(new BigDecimal("500000.00"))
                .status(ProductStatus.ACTIVE)
                .build();

        when(productRepository.searchProducts(null, com.chickiestudio.category.entity.CategoryType.CAMERA, ProductStatus.ACTIVE, null, pageable))
                .thenReturn(page);
        when(productMapper.toListResponse(sampleProduct)).thenReturn(listResponse);

        Page<ProductListResponse> result = productService.getProducts(null, com.chickiestudio.category.entity.CategoryType.CAMERA, ProductStatus.ACTIVE, null, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    @DisplayName("Xóa sản phẩm thành công")
    void deleteProduct_whenExists_shouldDelete() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(sampleProduct));

        productService.deleteProduct(10L);

        verify(productRepository).delete(sampleProduct);
    }

    @Test
    @DisplayName("Xóa sản phẩm ném lỗi khi không tìm thấy")
    void deleteProduct_whenNotFound_shouldThrowResourceNotFoundException() {
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.deleteProduct(999L));
        verify(productRepository, never()).delete(any(Product.class));
    }
}
