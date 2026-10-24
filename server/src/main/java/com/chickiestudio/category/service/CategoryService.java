package com.chickiestudio.category.service;

import com.chickiestudio.category.dto.CategoryResponse;
import com.chickiestudio.category.dto.CreateCategoryRequest;
import com.chickiestudio.category.dto.UpdateCategoryRequest;

import java.util.List;

public interface CategoryService {

    List<CategoryResponse> getPublicCategories();

    List<CategoryResponse> getAllCategoriesForAdmin();

    CategoryResponse getCategoryById(Long id);

    CategoryResponse getCategoryBySlug(String slug);

    CategoryResponse createCategory(CreateCategoryRequest request);

    CategoryResponse updateCategory(Long id, UpdateCategoryRequest request);

    void deleteCategory(Long id);
}
