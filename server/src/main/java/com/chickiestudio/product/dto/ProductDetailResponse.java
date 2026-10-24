package com.chickiestudio.product.dto;

import com.chickiestudio.product.entity.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String productCode;
    private String name;
    private String slug;
    private String description;
    private String material;
    private String occasion;
    private BigDecimal rentalPrice;
    private BigDecimal depositPrice;
    private ProductStatus status;
    private List<ProductVariantResponse> variants;
    private List<ProductImageResponse> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
