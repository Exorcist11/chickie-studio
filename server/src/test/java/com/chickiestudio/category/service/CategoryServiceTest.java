package com.chickiestudio.category.service;

import com.chickiestudio.category.dto.CategoryResponse;
import com.chickiestudio.category.dto.CreateCategoryRequest;
import com.chickiestudio.category.dto.UpdateCategoryRequest;
import com.chickiestudio.category.entity.Category;
import com.chickiestudio.category.mapper.CategoryMapper;
import com.chickiestudio.category.repository.CategoryRepository;
import com.chickiestudio.category.service.impl.CategoryServiceImpl;
import com.chickiestudio.common.exception.ConflictException;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private Category sampleCategory;
    private CategoryResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleCategory = Category.builder()
                .id(1L)
                .name("Váy Thiết Kế")
                .slug("vay-thiet-ke")
                .description("Váy cao cấp chụp ảnh")
                .iconUrl("Sparkles")
                .displayOrder(1)
                .isActive(true)
                .build();

        sampleResponse = new CategoryResponse(
                1L,
                "Váy Thiết Kế",
                "vay-thiet-ke",
                "Váy cao cấp chụp ảnh",
                "Sparkles",
                1,
                true,
                LocalDateTime.now(),
                LocalDateTime.now()
        );
    }

    @Test
    @DisplayName("getPublicCategories_shouldReturnActiveCategories")
    void getPublicCategories_shouldReturnActiveCategories() {
        when(categoryRepository.findAllByIsActiveTrueOrderByDisplayOrderAsc())
                .thenReturn(List.of(sampleCategory));
        when(categoryMapper.toResponseList(List.of(sampleCategory)))
                .thenReturn(List.of(sampleResponse));

        List<CategoryResponse> result = categoryService.getPublicCategories();

        assertEquals(1, result.size());
        assertEquals("vay-thiet-ke", result.get(0).slug());
        verify(categoryRepository).findAllByIsActiveTrueOrderByDisplayOrderAsc();
    }

    @Test
    @DisplayName("getAllCategoriesForAdmin_shouldReturnAllCategories")
    void getAllCategoriesForAdmin_shouldReturnAllCategories() {
        when(categoryRepository.findAllByOrderByDisplayOrderAsc())
                .thenReturn(List.of(sampleCategory));
        when(categoryMapper.toResponseList(List.of(sampleCategory)))
                .thenReturn(List.of(sampleResponse));

        List<CategoryResponse> result = categoryService.getAllCategoriesForAdmin();

        assertEquals(1, result.size());
        verify(categoryRepository).findAllByOrderByDisplayOrderAsc();
    }

    @Test
    @DisplayName("getCategoryById_whenFound_shouldReturnCategoryResponse")
    void getCategoryById_whenFound_shouldReturnCategoryResponse() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(categoryMapper.toResponse(sampleCategory)).thenReturn(sampleResponse);

        CategoryResponse result = categoryService.getCategoryById(1L);

        assertNotNull(result);
        assertEquals("Váy Thiết Kế", result.name());
        verify(categoryRepository).findById(1L);
    }

    @Test
    @DisplayName("getCategoryById_whenNotFound_shouldThrowResourceNotFoundException")
    void getCategoryById_whenNotFound_shouldThrowResourceNotFoundException() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> categoryService.getCategoryById(99L));
        verify(categoryRepository).findById(99L);
    }

    @Test
    @DisplayName("getCategoryBySlug_whenFound_shouldReturnCategoryResponse")
    void getCategoryBySlug_whenFound_shouldReturnCategoryResponse() {
        when(categoryRepository.findBySlug("vay-thiet-ke")).thenReturn(Optional.of(sampleCategory));
        when(categoryMapper.toResponse(sampleCategory)).thenReturn(sampleResponse);

        CategoryResponse result = categoryService.getCategoryBySlug("vay-thiet-ke");

        assertNotNull(result);
        assertEquals("vay-thiet-ke", result.slug());
    }

    @Test
    @DisplayName("getCategoryBySlug_whenNotFound_shouldThrowResourceNotFoundException")
    void getCategoryBySlug_whenNotFound_shouldThrowResourceNotFoundException() {
        when(categoryRepository.findBySlug("khong-ton-tai")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> categoryService.getCategoryBySlug("khong-ton-tai"));
    }

    @Test
    @DisplayName("createCategory_whenValid_shouldSaveAndReturnCategory")
    void createCategory_whenValid_shouldSaveAndReturnCategory() {
        CreateCategoryRequest request = new CreateCategoryRequest(
                "Áo Dài",
                "ao-dai",
                "Mô tả áo dài",
                "Flower2",
                2,
                true
        );

        when(categoryRepository.existsBySlug("ao-dai")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(sampleCategory);
        when(categoryMapper.toResponse(sampleCategory)).thenReturn(sampleResponse);

        CategoryResponse result = categoryService.createCategory(request);

        assertNotNull(result);
        verify(categoryRepository).existsBySlug("ao-dai");
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    @DisplayName("createCategory_whenDisplayOrderAndIsActiveNull_shouldUseDefaults")
    void createCategory_whenDisplayOrderAndIsActiveNull_shouldUseDefaults() {
        CreateCategoryRequest request = new CreateCategoryRequest(
                "Áo Dài",
                "ao-dai",
                "Mô tả",
                null,
                null,
                null
        );

        when(categoryRepository.existsBySlug("ao-dai")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(sampleCategory);
        when(categoryMapper.toResponse(sampleCategory)).thenReturn(sampleResponse);

        CategoryResponse result = categoryService.createCategory(request);

        assertNotNull(result);
        verify(categoryRepository).save(argThat(cat -> cat.getDisplayOrder() == 0 && cat.getIsActive()));
    }

    @Test
    @DisplayName("updateCategory_whenDisplayOrderAndIsActiveNull_shouldNotOverwrite")
    void updateCategory_whenDisplayOrderAndIsActiveNull_shouldNotOverwrite() {
        UpdateCategoryRequest request = new UpdateCategoryRequest(
                "Váy Thiết Kế",
                "vay-thiet-ke",
                null,
                null,
                null,
                null
        );

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(categoryRepository.existsBySlugAndIdNot("vay-thiet-ke", 1L)).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(sampleCategory);
        when(categoryMapper.toResponse(sampleCategory)).thenReturn(sampleResponse);

        CategoryResponse result = categoryService.updateCategory(1L, request);

        assertNotNull(result);
        assertEquals(1, sampleCategory.getDisplayOrder());
        assertTrue(sampleCategory.getIsActive());
    }

    @Test
    @DisplayName("createCategory_whenDuplicateSlug_shouldThrowConflictException")
    void createCategory_whenDuplicateSlug_shouldThrowConflictException() {
        CreateCategoryRequest request = new CreateCategoryRequest(
                "Váy Thiết Kế",
                "vay-thiet-ke",
                null,
                null,
                null,
                null
        );

        when(categoryRepository.existsBySlug("vay-thiet-ke")).thenReturn(true);

        assertThrows(ConflictException.class, () -> categoryService.createCategory(request));
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    @DisplayName("updateCategory_whenValid_shouldUpdateAndReturnCategory")
    void updateCategory_whenValid_shouldUpdateAndReturnCategory() {
        UpdateCategoryRequest request = new UpdateCategoryRequest(
                "Váy Thiết Kế Cao Cấp",
                "vay-thiet-ke-cao-cap",
                "Mô tả mới",
                "Sparkles",
                5,
                false
        );

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(categoryRepository.existsBySlugAndIdNot("vay-thiet-ke-cao-cap", 1L)).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(sampleCategory);
        when(categoryMapper.toResponse(sampleCategory)).thenReturn(sampleResponse);

        CategoryResponse result = categoryService.updateCategory(1L, request);

        assertNotNull(result);
        verify(categoryRepository).save(sampleCategory);
    }

    @Test
    @DisplayName("updateCategory_whenNotFound_shouldThrowResourceNotFoundException")
    void updateCategory_whenNotFound_shouldThrowResourceNotFoundException() {
        UpdateCategoryRequest request = new UpdateCategoryRequest(
                "Váy Thiết Kế", "vay-thiet-ke", null, null, null, null
        );

        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> categoryService.updateCategory(99L, request));
    }

    @Test
    @DisplayName("updateCategory_whenSlugConflict_shouldThrowConflictException")
    void updateCategory_whenSlugConflict_shouldThrowConflictException() {
        UpdateCategoryRequest request = new UpdateCategoryRequest(
                "Trùng Slug", "trung-slug", null, null, null, null
        );

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));
        when(categoryRepository.existsBySlugAndIdNot("trung-slug", 1L)).thenReturn(true);

        assertThrows(ConflictException.class, () -> categoryService.updateCategory(1L, request));
        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    @DisplayName("deleteCategory_whenFound_shouldDelete")
    void deleteCategory_whenFound_shouldDelete() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory));

        categoryService.deleteCategory(1L);

        verify(categoryRepository).delete(sampleCategory);
    }

    @Test
    @DisplayName("deleteCategory_whenNotFound_shouldThrowResourceNotFoundException")
    void deleteCategory_whenNotFound_shouldThrowResourceNotFoundException() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> categoryService.deleteCategory(99L));
        verify(categoryRepository, never()).delete(any(Category.class));
    }
}
