package com.chickiestudio.product.dto;

import com.chickiestudio.product.entity.ProductItemStatus;
import lombok.Builder;

import java.time.LocalDateTime;

/**
 * DTO phản hồi thông tin chi tiết của một món đồ vật lý (CAT-003).
 */
@Builder
public record ProductItemResponse(
    Long id,
    Long variantId,
    String variantSize,
    String variantColor,
    String variantSku,
    Long productId,
    String productName,
    String productCode,
    String itemCode,
    ProductItemStatus status,
    int rentalCount,
    String note,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
