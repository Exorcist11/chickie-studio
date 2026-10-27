package com.chickiestudio.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RescheduleBookingRequest {

    @NotNull(message = "ID đơn thuê không được để trống")
    private Long bookingId;

    @NotNull(message = "Ngày bắt đầu mới không được để trống")
    private LocalDate newStartDate;

    @NotNull(message = "Ngày kết thúc mới không được để trống")
    private LocalDate newEndDate;

    @NotBlank(message = "Vui lòng nhập lý do dời ngày")
    @Size(min = 5, max = 255, message = "Lý do dời ngày phải từ 5 đến 255 ký tự")
    private String reason;
}
