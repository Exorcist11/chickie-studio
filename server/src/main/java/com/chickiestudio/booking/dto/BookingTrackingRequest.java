package com.chickiestudio.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingTrackingRequest {

    @NotBlank(message = "Mã đơn đặt thuê không được để trống")
    private String bookingCode;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(0|\\+84)[0-9]{9,10}$", message = "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 hoặc +84 và gồm 10 chữ số)")
    private String phone;
}
