package com.chickiestudio.category.mapper;

import com.chickiestudio.category.dto.CategoryResponse;
import com.chickiestudio.category.entity.Category;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryResponse toResponse(Category category);

    List<CategoryResponse> toResponseList(List<Category> categories);
}
