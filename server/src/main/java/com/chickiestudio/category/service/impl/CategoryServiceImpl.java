package com.chickiestudio.category.service.impl;

import com.chickiestudio.category.dto.CategoryResponse;
import com.chickiestudio.category.dto.CreateCategoryRequest;
import com.chickiestudio.category.dto.UpdateCategoryRequest;
import com.chickiestudio.category.entity.Category;
import com.chickiestudio.category.mapper.CategoryMapper;
import com.chickiestudio.category.repository.CategoryRepository;
import com.chickiestudio.category.service.CategoryService;
import com.chickiestudio.common.exception.ConflictException;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryResponse> getPublicCategories() {
        List<Category> categories = categoryRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc();
        return categoryMapper.toResponseList(categories);
    }

    @Override
    public List<CategoryResponse> getAllCategoriesForAdmin() {
        List<Category> categories = categoryRepository.findAllByOrderByDisplayOrderAsc();
        return categoryMapper.toResponseList(categories);
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));
        return categoryMapper.toResponse(category);
    }

    @Override
    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với slug: " + slug));
        return categoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        String cleanSlug = request.slug().trim().toLowerCase();
        if (categoryRepository.existsBySlug(cleanSlug)) {
            throw new ConflictException("Đường dẫn URL (slug) đã tồn tại: " + cleanSlug);
        }

        Category category = Category.builder()
                .name(request.name().trim())
                .slug(cleanSlug)
                .type(request.type() != null ? request.type() : com.chickiestudio.category.entity.CategoryType.COSTUME)
                .description(request.description())
                .iconUrl(request.iconUrl())
                .displayOrder(request.displayOrder() != null ? request.displayOrder() : 0)
                .isActive(request.isActive() != null ? request.isActive() : true)
                .build();

        Category saved = categoryRepository.save(category);
        log.info("Đã tạo mới danh mục: {} (id: {}, slug: {})", saved.getName(), saved.getId(), saved.getSlug());
        return categoryMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

        String cleanSlug = request.slug().trim().toLowerCase();
        if (categoryRepository.existsBySlugAndIdNot(cleanSlug, id)) {
            throw new ConflictException("Đường dẫn URL (slug) đã tồn tại: " + cleanSlug);
        }

        category.setName(request.name().trim());
        category.setSlug(cleanSlug);
        if (request.type() != null) {
            category.setType(request.type());
        }
        category.setDescription(request.description());
        category.setIconUrl(request.iconUrl());
        if (request.displayOrder() != null) {
            category.setDisplayOrder(request.displayOrder());
        }
        if (request.isActive() != null) {
            category.setIsActive(request.isActive());
        }

        Category updated = categoryRepository.save(category);
        log.info("Đã cập nhật danh mục: {} (id: {}, slug: {})", updated.getName(), updated.getId(), updated.getSlug());
        return categoryMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục với ID: " + id));

        categoryRepository.delete(category);
        log.info("Đã xóa danh mục: {} (id: {})", category.getName(), id);
    }
}
