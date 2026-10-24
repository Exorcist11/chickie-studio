package com.chickiestudio.product.mapper;

import com.chickiestudio.category.entity.Category;
import com.chickiestudio.product.dto.ProductDetailResponse;
import com.chickiestudio.product.dto.ProductListResponse;
import com.chickiestudio.product.entity.Product;
import com.chickiestudio.product.entity.ProductImage;
import com.chickiestudio.product.entity.ProductStatus;
import com.chickiestudio.product.entity.ProductVariant;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class ProductMapperTest {

    private final ProductMapper mapper = Mappers.getMapper(ProductMapper.class);

    @Test
    @DisplayName("Ánh xạ Product sang ProductDetailResponse và ProductListResponse thành công")
    void testMapping() {
        Category category = Category.builder().id(2L).name("Áo Dài").build();

        Product product = Product.builder()
                .id(1L)
                .category(category)
                .productCode("PRD-AD-01")
                .name("Áo Dài Cách Tân")
                .slug("ao-dai-cach-tan")
                .rentalPrice(new BigDecimal("250000"))
                .depositPrice(new BigDecimal("300000"))
                .status(ProductStatus.ACTIVE)
                .variants(new ArrayList<>())
                .images(new ArrayList<>())
                .build();

        ProductVariant variant = ProductVariant.builder()
                .id(10L)
                .size("M")
                .color("Đỏ")
                .sku("PRD-AD-01-M-DO")
                .createdAt(LocalDateTime.now())
                .build();
        product.addVariant(variant);

        ProductImage image1 = ProductImage.builder().id(101L).imageUrl("https://example.com/1.jpg").isThumbnail(false).displayOrder(1).build();
        ProductImage image2 = ProductImage.builder().id(102L).imageUrl("https://example.com/2.jpg").isThumbnail(true).displayOrder(0).build();
        product.addImage(image1);
        product.addImage(image2);

        ProductDetailResponse detail = mapper.toDetailResponse(product);
        assertNotNull(detail);
        assertEquals(2L, detail.getCategoryId());
        assertEquals("Áo Dài", detail.getCategoryName());
        assertEquals(1, detail.getVariants().size());
        assertEquals(2, detail.getImages().size());

        ProductListResponse listRes = mapper.toListResponse(product);
        assertNotNull(listRes);
        assertEquals("https://example.com/2.jpg", listRes.getThumbnailUrl());
        assertEquals(1, listRes.getVariantCount());

        List<ProductListResponse> listResponses = mapper.toListResponseList(List.of(product));
        assertEquals(1, listResponses.size());

        assertEquals(0, mapper.countVariants(null));
        assertNull(mapper.extractThumbnailUrl(null));
        assertNull(mapper.extractThumbnailUrl(Collections.emptyList()));
        assertEquals("https://example.com/1.jpg", mapper.extractThumbnailUrl(List.of(image1)));
    }
}
