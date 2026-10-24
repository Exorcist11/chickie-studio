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
public class ProductImageRequest {

    private Long id;

    @NotBlank(message = "Đường dẫn hình ảnh không được để trống")
    @Size(max = 255, message = "Đường dẫn hình ảnh tối đa 255 ký tự")
    private String imageUrl;

    @Builder.Default
    private Boolean isThumbnail = false;

    @Builder.Default
    private Integer displayOrder = 0;
}
