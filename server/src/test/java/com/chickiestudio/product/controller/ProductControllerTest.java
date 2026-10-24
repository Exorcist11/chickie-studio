package com.chickiestudio.product.controller;

import com.chickiestudio.auth.security.JwtAuthenticationFilter;
import com.chickiestudio.auth.security.JwtTokenProvider;
import com.chickiestudio.auth.security.SecurityConfig;
import com.chickiestudio.common.exception.GlobalExceptionHandler;
import com.chickiestudio.product.dto.CreateProductRequest;
import com.chickiestudio.product.dto.ProductDetailResponse;
import com.chickiestudio.product.dto.ProductImageRequest;
import com.chickiestudio.product.dto.ProductImageResponse;
import com.chickiestudio.product.dto.ProductListResponse;
import com.chickiestudio.product.dto.ProductVariantRequest;
import com.chickiestudio.product.dto.ProductVariantResponse;
import com.chickiestudio.product.dto.UpdateProductRequest;
import com.chickiestudio.product.entity.ProductStatus;
import com.chickiestudio.product.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest({AdminProductController.class, PublicProductController.class})
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, GlobalExceptionHandler.class})
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    private final ProductDetailResponse sampleDetailResponse = ProductDetailResponse.builder()
            .id(1L)
            .categoryId(1L)
            .categoryName("Váy Dạ Hội")
            .productCode("PRD-LUA-TRANG")
            .name("Váy Lụa Trắng Cổ Yếm")
            .slug("vay-lua-trang-co-yem")
            .rentalPrice(new BigDecimal("350000.00"))
            .depositPrice(new BigDecimal("500000.00"))
            .status(ProductStatus.ACTIVE)
            .variants(List.of(
                    new ProductVariantResponse(1L, "S", "Trắng", "PRD-LUA-TRANG-S-TRAN", LocalDateTime.now())
            ))
            .images(List.of(
                    new ProductImageResponse(1L, "https://example.com/img1.jpg", true, 0)
            ))
            .build();

    @Test
    @DisplayName("Admin lấy danh sách sản phẩm phân trang trả về 200")
    @WithMockUser(roles = "ADMIN")
    void getProducts_asAdmin_shouldReturn200() throws Exception {
        ProductListResponse listItem = ProductListResponse.builder()
                .id(1L)
                .productCode("PRD-LUA-TRANG")
                .name("Váy Lụa Trắng Cổ Yếm")
                .slug("vay-lua-trang-co-yem")
                .rentalPrice(new BigDecimal("350000.00"))
                .depositPrice(new BigDecimal("500000.00"))
                .status(ProductStatus.ACTIVE)
                .variantCount(1)
                .thumbnailUrl("https://example.com/img1.jpg")
                .build();

        when(productService.getProductsForAdmin(any(), any(), any(), any()))
                .thenReturn(new PageImpl<>(List.of(listItem)));

        mockMvc.perform(get("/api/admin/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.content[0].productCode").value("PRD-LUA-TRANG"));
    }

    @Test
    @DisplayName("Nhân viên lấy chi tiết sản phẩm theo ID trả về 200")
    @WithMockUser(roles = "STAFF")
    void getProductById_asStaff_shouldReturn200() throws Exception {
        when(productService.getProductById(1L)).thenReturn(sampleDetailResponse);

        mockMvc.perform(get("/api/admin/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.name").value("Váy Lụa Trắng Cổ Yếm"));
    }

    @Test
    @DisplayName("Tạo mới sản phẩm với body hợp lệ trả về 201")
    @WithMockUser(roles = "ADMIN")
    void createProduct_validRequest_shouldReturn201() throws Exception {
        CreateProductRequest request = CreateProductRequest.builder()
                .categoryId(1L)
                .productCode("PRD-LUA-TRANG")
                .name("Váy Lụa Trắng Cổ Yếm")
                .rentalPrice(new BigDecimal("350000.00"))
                .depositPrice(new BigDecimal("500000.00"))
                .variants(List.of(
                        ProductVariantRequest.builder().size("S").color("Trắng").build()
                ))
                .images(List.of(
                        ProductImageRequest.builder().imageUrl("https://example.com/img.jpg").build()
                ))
                .build();

        when(productService.createProduct(any(CreateProductRequest.class))).thenReturn(sampleDetailResponse);

        mockMvc.perform(post("/api/admin/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.productCode").value("PRD-LUA-TRANG"));
    }

    @Test
    @DisplayName("Tạo sản phẩm với body thiếu tên và giá âm trả về 400")
    @WithMockUser(roles = "ADMIN")
    void createProduct_invalidRequest_shouldReturn400() throws Exception {
        CreateProductRequest request = CreateProductRequest.builder()
                .categoryId(1L)
                .name("") // blank
                .rentalPrice(new BigDecimal("-1000")) // negative
                .depositPrice(new BigDecimal("-500"))
                .variants(List.of()) // empty
                .images(List.of()) // empty
                .build();

        mockMvc.perform(post("/api/admin/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
    }

    @Test
    @DisplayName("Cập nhật sản phẩm trả về 200")
    @WithMockUser(roles = "STAFF")
    void updateProduct_validRequest_shouldReturn200() throws Exception {
        UpdateProductRequest request = UpdateProductRequest.builder()
                .categoryId(1L)
                .productCode("PRD-LUA-TRANG")
                .name("Váy Lụa Trắng Cổ Yếm")
                .rentalPrice(new BigDecimal("350000.00"))
                .depositPrice(new BigDecimal("500000.00"))
                .status(ProductStatus.ACTIVE)
                .variants(List.of(
                        ProductVariantRequest.builder().size("S").color("Trắng").build()
                ))
                .images(List.of(
                        ProductImageRequest.builder().imageUrl("https://example.com/img.jpg").build()
                ))
                .build();

        when(productService.updateProduct(eq(1L), any(UpdateProductRequest.class))).thenReturn(sampleDetailResponse);

        mockMvc.perform(put("/api/admin/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }

    @Test
    @DisplayName("Xóa sản phẩm trả về 200")
    @WithMockUser(roles = "ADMIN")
    void deleteProduct_asAdmin_shouldReturn200() throws Exception {
        doNothing().when(productService).deleteProduct(1L);

        mockMvc.perform(delete("/api/admin/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }

    @Test
    @DisplayName("Public API lấy danh sách sản phẩm không cần đăng nhập trả về 200")
    void getPublicProducts_unauthenticated_shouldReturn200() throws Exception {
        when(productService.getProducts(any(), any(), any(), any(), any()))
                .thenReturn(new PageImpl<>(List.of()));

        mockMvc.perform(get("/api/public/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));

        mockMvc.perform(get("/api/public/products?type=CAMERA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }

    @Test
    @DisplayName("Public API lấy chi tiết sản phẩm theo ID hoặc Slug trả về 200")
    void getPublicProductDetails_unauthenticated_shouldReturn200() throws Exception {
        when(productService.getProductById(1L)).thenReturn(sampleDetailResponse);
        when(productService.getProductBySlug("vay-lua-trang-co-yem")).thenReturn(sampleDetailResponse);

        mockMvc.perform(get("/api/public/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1));

        mockMvc.perform(get("/api/public/products/vay-lua-trang-co-yem"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.slug").value("vay-lua-trang-co-yem"));
    }
}
