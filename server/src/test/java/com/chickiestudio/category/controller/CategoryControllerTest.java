package com.chickiestudio.category.controller;

import com.chickiestudio.auth.security.JwtAuthenticationFilter;
import com.chickiestudio.auth.security.JwtTokenProvider;
import com.chickiestudio.auth.security.SecurityConfig;
import com.chickiestudio.category.dto.CategoryResponse;
import com.chickiestudio.category.dto.CreateCategoryRequest;
import com.chickiestudio.category.dto.UpdateCategoryRequest;
import com.chickiestudio.category.service.CategoryService;
import com.chickiestudio.common.exception.ConflictException;
import com.chickiestudio.common.exception.GlobalExceptionHandler;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest({PublicCategoryController.class, AdminCategoryController.class})
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, GlobalExceptionHandler.class})
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private CategoryService categoryService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    private final CategoryResponse sampleResponse = new CategoryResponse(
            1L,
            "Váy Thiết Kế",
            "vay-thiet-ke",
            "Mô tả",
            "Sparkles",
            1,
            true,
            LocalDateTime.now(),
            LocalDateTime.now()
    );

    @Test
    @DisplayName("getActiveCategories_whenPublic_shouldReturn200AndList")
    void getActiveCategories_whenPublic_shouldReturn200AndList() throws Exception {
        when(categoryService.getPublicCategories()).thenReturn(List.of(sampleResponse));

        mockMvc.perform(get("/api/public/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data[0].slug").value("vay-thiet-ke"));

        verify(categoryService).getPublicCategories();
    }

    @Test
    @DisplayName("getCategoryBySlug_whenFound_shouldReturn200")
    void getCategoryBySlug_whenFound_shouldReturn200() throws Exception {
        when(categoryService.getCategoryBySlug("vay-thiet-ke")).thenReturn(sampleResponse);

        mockMvc.perform(get("/api/public/categories/vay-thiet-ke"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Váy Thiết Kế"));
    }

    @Test
    @DisplayName("getCategoryBySlug_whenNotFound_shouldReturn404")
    void getCategoryBySlug_whenNotFound_shouldReturn404() throws Exception {
        when(categoryService.getCategoryBySlug("not-found"))
                .thenThrow(new ResourceNotFoundException("Không tìm thấy danh mục"));

        mockMvc.perform(get("/api/public/categories/not-found"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(404));
    }

    @Test
    @DisplayName("getAllCategories_whenUnauthenticated_shouldReturn401")
    void getAllCategories_whenUnauthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(get("/api/admin/categories"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("getAllCategories_whenStaffRole_shouldReturn403")
    void getAllCategories_whenStaffRole_shouldReturn403() throws Exception {
        mockMvc.perform(get("/api/admin/categories"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("getAllCategories_whenAdminRole_shouldReturn200")
    void getAllCategories_whenAdminRole_shouldReturn200() throws Exception {
        when(categoryService.getAllCategoriesForAdmin()).thenReturn(List.of(sampleResponse));

        mockMvc.perform(get("/api/admin/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].id").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("getCategoryById_whenAdmin_shouldReturn200")
    void getCategoryById_whenAdmin_shouldReturn200() throws Exception {
        when(categoryService.getCategoryById(1L)).thenReturn(sampleResponse);

        mockMvc.perform(get("/api/admin/categories/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slug").value("vay-thiet-ke"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("createCategory_whenValid_shouldReturn201")
    void createCategory_whenValid_shouldReturn201() throws Exception {
        CreateCategoryRequest request = new CreateCategoryRequest(
                "Áo Dài", "ao-dai", "Mô tả", "Flower2", 2, true
        );

        when(categoryService.createCategory(any(CreateCategoryRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(post("/api/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("createCategory_whenInvalidSlug_shouldReturn400")
    void createCategory_whenInvalidSlug_shouldReturn400() throws Exception {
        // Slug containing spaces or uppercase should fail validation
        CreateCategoryRequest request = new CreateCategoryRequest(
                "Áo Dài", "Ao Dai Trùng", "Mô tả", null, null, null
        );

        mockMvc.perform(post("/api/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("createCategory_whenDuplicateSlug_shouldReturn409")
    void createCategory_whenDuplicateSlug_shouldReturn409() throws Exception {
        CreateCategoryRequest request = new CreateCategoryRequest(
                "Váy Thiết Kế", "vay-thiet-ke", null, null, null, null
        );

        when(categoryService.createCategory(any(CreateCategoryRequest.class)))
                .thenThrow(new ConflictException("Slug đã tồn tại"));

        mockMvc.perform(post("/api/admin/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value(409));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("updateCategory_whenValid_shouldReturn200")
    void updateCategory_whenValid_shouldReturn200() throws Exception {
        UpdateCategoryRequest request = new UpdateCategoryRequest(
                "Váy Mới", "vay-moi", "Mô tả mới", "Sparkles", 1, true
        );

        when(categoryService.updateCategory(eq(1L), any(UpdateCategoryRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(put("/api/admin/categories/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("deleteCategory_whenAdmin_shouldReturn200")
    void deleteCategory_whenAdmin_shouldReturn200() throws Exception {
        doNothing().when(categoryService).deleteCategory(1L);

        mockMvc.perform(delete("/api/admin/categories/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));

        verify(categoryService).deleteCategory(1L);
    }
}
