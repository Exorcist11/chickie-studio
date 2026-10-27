package com.chickiestudio.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReassignItemRequest {

    @NotNull(message = "ID món đồ đơn thuê không được để trống")
    private Long bookingItemId;

    @NotNull(message = "ID món đồ thay thế không được để trống")
    private Long newItemId;

    @NotBlank(message = "Vui lòng nhập lý do điều phối món đồ")
    @Size(min = 5, max = 255, message = "Lý do điều phối phải từ 5 đến 255 ký tự")
    private String reason;
}
