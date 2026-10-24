package com.chickiestudio.product.mapper;

import com.chickiestudio.product.dto.ProductDetailResponse;
import com.chickiestudio.product.dto.ProductImageResponse;
import com.chickiestudio.product.dto.ProductListResponse;
import com.chickiestudio.product.dto.ProductVariantResponse;
import com.chickiestudio.product.entity.Product;
import com.chickiestudio.product.entity.ProductImage;
import com.chickiestudio.product.entity.ProductVariant;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    ProductDetailResponse toDetailResponse(Product product);

    @Mapping(target = "categoryId", source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "thumbnailUrl", source = "images", qualifiedByName = "extractThumbnailUrl")
    @Mapping(target = "variantCount", source = "variants", qualifiedByName = "countVariants")
    ProductListResponse toListResponse(Product product);

    List<ProductListResponse> toListResponseList(List<Product> products);

    ProductVariantResponse toVariantResponse(ProductVariant variant);

    List<ProductVariantResponse> toVariantResponseList(List<ProductVariant> variants);

    ProductImageResponse toImageResponse(ProductImage image);

    List<ProductImageResponse> toImageResponseList(List<ProductImage> images);

    @Named("extractThumbnailUrl")
    default String extractThumbnailUrl(List<ProductImage> images) {
        if (images == null || images.isEmpty()) {
            return null;
        }
        return images.stream()
                .filter(img -> Boolean.TRUE.equals(img.getIsThumbnail()))
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(images.get(0).getImageUrl());
    }

    @Named("countVariants")
    default Integer countVariants(List<ProductVariant> variants) {
        return variants != null ? variants.size() : 0;
    }
}
