package com.chickiestudio.product.dto;

import jakarta.validation.constraints.NotBlank;
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
public class ProductVariantRequest {

    private Long id;

    @NotBlank(message = "Kích cỡ (size) không được để trống")
    @Size(max = 20, message = "Kích cỡ tối đa 20 ký tự")
    private String size;

    @NotBlank(message = "Màu sắc không được để trống")
    @Size(max = 50, message = "Màu sắc tối đa 50 ký tự")
    private String color;

    @Size(max = 50, message = "Mã SKU tối đa 50 ký tự")
    private String sku;
}
