package com.chickiestudio.product.dto;

import com.chickiestudio.product.entity.ProductItemStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Yêu cầu chuyển đổi trạng thái vòng đời của món đồ vật lý (CAT-003).
 */
public record UpdateItemStatusRequest(
    @NotNull(message = "Trạng thái mới không được để trống")
    ProductItemStatus status,

    @Size(max = 255, message = "Ghi chú không được vượt quá 255 ký tự")
    String note
) {}
