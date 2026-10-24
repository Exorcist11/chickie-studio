package com.chickiestudio.category.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateCategoryRequest(
    @NotBlank(message = "Tên danh mục không được để trống")
    @Size(max = 100, message = "Tên danh mục tối đa 100 ký tự")
    String name,

    @NotBlank(message = "Slug không được để trống")
    @Size(max = 120, message = "Slug tối đa 120 ký tự")
    @Pattern(regexp = "^[a-z0-9-]+$", message = "Slug chỉ chứa chữ thường, số và dấu gạch ngang (-)")
    String slug,

    String description,
    String iconUrl,
    Integer displayOrder,
    Boolean isActive
) {}
