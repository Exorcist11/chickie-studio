package com.chickiestudio.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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
public class CreateBookingRequest {

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(max = 100, message = "Họ và tên tối đa 100 ký tự")
    private String customerName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
            regexp = "^(0|\\+84)[0-9]{9,10}$",
            message = "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 hoặc +84 và gồm 10 chữ số)"
    )
    private String customerPhone;

    @NotBlank(message = "Hình thức nhận đồ không được để trống")
    @Builder.Default
    private String deliveryMethod = "PICKUP_STORE";

    @Size(max = 255, message = "Địa chỉ nhận đồ tối đa 255 ký tự")
    private String deliveryAddress;

    @NotNull(message = "Ngày bắt đầu thuê không được để trống")
    private LocalDate rentalStartDate;

    @NotNull(message = "Ngày kết thúc thuê không được để trống")
    private LocalDate rentalEndDate;

    @NotNull(message = "Biến thể sản phẩm không được để trống")
    private Long variantId;

    @Size(max = 500, message = "Ghi chú tối đa 500 ký tự")
    private String note;
}
