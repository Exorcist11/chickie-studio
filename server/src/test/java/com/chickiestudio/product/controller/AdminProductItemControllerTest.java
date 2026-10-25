package com.chickiestudio.product.controller;

import com.chickiestudio.auth.security.JwtAuthenticationFilter;
import com.chickiestudio.auth.security.JwtTokenProvider;
import com.chickiestudio.auth.security.SecurityConfig;
import com.chickiestudio.common.exception.GlobalExceptionHandler;
import com.chickiestudio.product.dto.CreateItemRequest;
import com.chickiestudio.product.dto.ProductItemResponse;
import com.chickiestudio.product.dto.UpdateItemStatusRequest;
import com.chickiestudio.product.entity.ProductItemStatus;
import com.chickiestudio.product.service.ProductItemService;
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
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminProductItemController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, GlobalExceptionHandler.class})
class AdminProductItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductItemService productItemService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    private final ProductItemResponse sampleItemResponse = ProductItemResponse.builder()
            .id(100L)
            .variantId(10L)
            .variantSize("S")
            .variantColor("Đỏ Ruby")
            .variantSku("CK-DR-001-S-RED")
            .productId(1L)
            .productName("Váy Dạ Hội Ruby")
            .productCode("CK-DR-001")
            .itemCode("CK-DR-001-S-RED-01")
            .status(ProductItemStatus.AVAILABLE)
            .rentalCount(3)
            .note("Đồ sẵn sàng cho thuê")
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("GET /api/admin/products/{productId}/items trả về 200 OK")
    void getItemsByProduct_Returns200() throws Exception {
        when(productItemService.getItemsByProduct(1L)).thenReturn(List.of(sampleItemResponse));

        mockMvc.perform(get("/api/admin/products/1/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data[0].itemCode").value("CK-DR-001-S-RED-01"))
                .andExpect(jsonPath("$.data[0].status").value("AVAILABLE"))
                .andExpect(jsonPath("$.data[0].rentalCount").value(3));
    }

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("GET /api/admin/product-variants/{variantId}/items trả về 200 OK")
    void getItemsByVariant_Returns200() throws Exception {
        when(productItemService.getItemsByVariant(10L)).thenReturn(List.of(sampleItemResponse));

        mockMvc.perform(get("/api/admin/product-variants/10/items"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data[0].id").value(100));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/admin/product-variants/{variantId}/suggest-code trả về 200 OK")
    void suggestItemCode_Returns200() throws Exception {
        when(productItemService.generateItemCode(10L)).thenReturn("CK-DR-001-S-RED-02");

        mockMvc.perform(get("/api/admin/product-variants/10/suggest-code"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.suggestedCode").value("CK-DR-001-S-RED-02"));
    }

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("GET /api/admin/product-items/{id} trả về 200 OK")
    void getItemById_Returns200() throws Exception {
        when(productItemService.getItemById(100L)).thenReturn(sampleItemResponse);

        mockMvc.perform(get("/api/admin/product-items/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.itemCode").value("CK-DR-001-S-RED-01"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("POST /api/admin/product-variants/{variantId}/items trả về 201 Created")
    void createItem_Returns201() throws Exception {
        CreateItemRequest request = new CreateItemRequest("CK-DR-001-S-RED-02", ProductItemStatus.AVAILABLE, "Hàng mới");
        when(productItemService.createItem(eq(10L), any(CreateItemRequest.class))).thenReturn(sampleItemResponse);

        mockMvc.perform(post("/api/admin/product-variants/10/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.itemCode").value("CK-DR-001-S-RED-01"));
    }

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("PATCH /api/admin/product-items/{id}/status trả về 200 OK")
    void updateItemStatus_Returns200() throws Exception {
        UpdateItemStatusRequest request = new UpdateItemStatusRequest(ProductItemStatus.RENTED, "Giao đồ khách");
        when(productItemService.updateItemStatus(eq(100L), any(UpdateItemStatusRequest.class))).thenReturn(sampleItemResponse);

        mockMvc.perform(patch("/api/admin/product-items/100/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("DELETE /api/admin/product-items/{id} trả về 200 OK")
    void deleteItem_Returns200() throws Exception {
        doNothing().when(productItemService).deleteItem(100L);

        mockMvc.perform(delete("/api/admin/product-items/100"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }

    @Test
    @DisplayName("Chưa đăng nhập trả về 401 Unauthorized")
    void unauthenticatedAccess_Returns401() throws Exception {
        mockMvc.perform(get("/api/admin/products/1/items"))
                .andExpect(status().isUnauthorized());
    }
}
