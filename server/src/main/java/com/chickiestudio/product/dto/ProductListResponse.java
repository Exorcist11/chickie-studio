package com.chickiestudio.product.dto;

import com.chickiestudio.product.entity.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductListResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String productCode;
    private String name;
    private String slug;
    private BigDecimal rentalPrice;
    private BigDecimal depositPrice;
    private ProductStatus status;
    private String thumbnailUrl;
    private Integer variantCount;
    private LocalDateTime createdAt;
}
