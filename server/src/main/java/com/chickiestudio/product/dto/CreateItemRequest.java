package com.chickiestudio.product.dto;

import com.chickiestudio.product.entity.ProductItemStatus;
import jakarta.validation.constraints.Size;

/**
 * Yêu cầu thêm mới một món đồ vật lý vào kho (CAT-003).
 */
public record CreateItemRequest(
    @Size(max = 50, message = "Mã đồ vật lý không được vượt quá 50 ký tự")
    String itemCode,

    ProductItemStatus status,

    @Size(max = 255, message = "Ghi chú không được vượt quá 255 ký tự")
    String note
) {}
