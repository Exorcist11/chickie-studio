package com.chickiestudio.product.dto;

import com.chickiestudio.product.entity.ProductStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateProductRequest {

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;

    @Size(max = 32, message = "Mã sản phẩm tối đa 32 ký tự")
    private String productCode;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 150, message = "Tên sản phẩm tối đa 150 ký tự")
    private String name;

    @Size(max = 180, message = "Slug sản phẩm tối đa 180 ký tự")
    private String slug;

    private String description;

    @Size(max = 100, message = "Chất liệu tối đa 100 ký tự")
    private String material;

    @Size(max = 100, message = "Dịp phù hợp tối đa 100 ký tự")
    private String occasion;

    @NotNull(message = "Giá thuê không được để trống")
    @Positive(message = "Giá thuê phải lớn hơn 0")
    private BigDecimal rentalPrice;

    @NotNull(message = "Tiền cọc không được để trống")
    @PositiveOrZero(message = "Tiền cọc không được âm")
    private BigDecimal depositPrice;

    @Builder.Default
    private ProductStatus status = ProductStatus.ACTIVE;

    @NotEmpty(message = "Sản phẩm phải có ít nhất 1 biến thể")
    @Valid
    private List<ProductVariantRequest> variants;

    @NotEmpty(message = "Sản phẩm phải có ít nhất 1 hình ảnh")
    @Valid
    private List<ProductImageRequest> images;
}
