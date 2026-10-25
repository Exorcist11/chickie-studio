package com.chickiestudio.booking.controller;

import com.chickiestudio.auth.security.JwtAuthenticationFilter;
import com.chickiestudio.auth.security.JwtTokenProvider;
import com.chickiestudio.auth.security.SecurityConfig;
import com.chickiestudio.booking.dto.BookingItemResponse;
import com.chickiestudio.booking.dto.BookingResponse;
import com.chickiestudio.booking.dto.UpdateBookingStatusRequest;
import com.chickiestudio.booking.entity.BookingStatus;
import com.chickiestudio.booking.service.BookingService;
import com.chickiestudio.common.exception.BadRequestException;
import com.chickiestudio.common.exception.GlobalExceptionHandler;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminBookingController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, GlobalExceptionHandler.class})
class AdminBookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BookingService bookingService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    private final BookingResponse sampleBookingResponse = BookingResponse.builder()
            .id(1L)
            .bookingCode("BK20261025-ABCD")
            .customerName("Trần Thu Hà")
            .customerPhone("0987654321")
            .deliveryMethod("PICKUP_STORE")
            .rentalStartDate(LocalDate.now().plusDays(2))
            .rentalEndDate(LocalDate.now().plusDays(3))
            .durationDays(2)
            .status(BookingStatus.PENDING)
            .totalRentalPrice(new BigDecimal("300000"))
            .totalDepositPrice(new BigDecimal("500000"))
            .totalAmount(new BigDecimal("800000"))
            .createdAt(LocalDateTime.now())
            .items(List.of(
                    BookingItemResponse.builder()
                            .id(10L)
                            .productItemId(100L)
                            .productItemCode("CK-DR-001-S-RED-01")
                            .variantId(10L)
                            .productName("Váy Dạ Hội Ruby")
                            .variantSize("S")
                            .variantColor("Đỏ Ruby")
                            .rentalStartDate(LocalDate.now().plusDays(2))
                            .rentalEndDate(LocalDate.now().plusDays(3))
                            .rentalPrice(new BigDecimal("300000"))
                            .depositPrice(new BigDecimal("500000"))
                            .build()
            ))
            .build();

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("GET /api/admin/bookings trả về 200 OK với danh sách phân trang")
    void getBookings_Returns200() throws Exception {
        when(bookingService.getBookingsForAdmin(any(), any(), any(), any(), any(), any(), any(), any()))
                .thenReturn(new PageImpl<>(List.of(sampleBookingResponse), PageRequest.of(0, 20), 1));

        mockMvc.perform(get("/api/admin/bookings")
                        .param("status", "PENDING")
                        .param("search", "Trần"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.content[0].bookingCode").value("BK20261025-ABCD"))
                .andExpect(jsonPath("$.data.content[0].customerName").value("Trần Thu Hà"));
    }

    @Test
    @DisplayName("GET /api/admin/bookings khi chưa đăng nhập trả về 401 Unauthorized")
    void getBookings_Unauthenticated_Returns401() throws Exception {
        mockMvc.perform(get("/api/admin/bookings"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    @DisplayName("GET /api/admin/bookings với vai trò USER không có quyền trả về 403 Forbidden")
    void getBookings_ForbiddenForUserRole_Returns403() throws Exception {
        mockMvc.perform(get("/api/admin/bookings"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/admin/bookings/{id} trả về 200 OK")
    void getBookingById_Returns200() throws Exception {
        when(bookingService.getBookingById(1L)).thenReturn(sampleBookingResponse);

        mockMvc.perform(get("/api/admin/bookings/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.bookingCode").value("BK20261025-ABCD"))
                .andExpect(jsonPath("$.data.customerName").value("Trần Thu Hà"));
    }

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("GET /api/admin/bookings/{id} khi không tìm thấy trả về 404 Not Found")
    void getBookingById_NotFound_Returns404() throws Exception {
        when(bookingService.getBookingById(999L)).thenThrow(new ResourceNotFoundException("Không tìm thấy đơn đặt thuê với ID: 999"));

        mockMvc.perform(get("/api/admin/bookings/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(404));
    }

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("PATCH /api/admin/bookings/{id}/status trả về 200 OK khi chuyển trạng thái hợp lệ")
    void updateBookingStatus_Returns200() throws Exception {
        UpdateBookingStatusRequest req = UpdateBookingStatusRequest.builder()
                .status(BookingStatus.CONFIRMED)
                .note("Đã liên hệ xác nhận")
                .build();

        BookingResponse updatedResponse = BookingResponse.builder()
                .id(1L)
                .bookingCode("BK20261025-ABCD")
                .status(BookingStatus.CONFIRMED)
                .build();

        when(bookingService.updateBookingStatus(eq(1L), any(UpdateBookingStatusRequest.class), any()))
                .thenReturn(updatedResponse);

        mockMvc.perform(patch("/api/admin/bookings/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.status").value("CONFIRMED"));
    }

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("PATCH /api/admin/bookings/{id}/status trả về 400 Bad Request khi thiếu status")
    void updateBookingStatus_MissingStatus_Returns400() throws Exception {
        String invalidJson = "{\"note\": \"Thiếu status\"}";

        mockMvc.perform(patch("/api/admin/bookings/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("PATCH /api/admin/bookings/{id}/status trả về 400 khi vi phạm State Machine")
    void updateBookingStatus_IllegalTransition_Returns400() throws Exception {
        UpdateBookingStatusRequest req = UpdateBookingStatusRequest.builder()
                .status(BookingStatus.COMPLETED)
                .note("Nhảy cóc trạng thái")
                .build();

        when(bookingService.updateBookingStatus(eq(1L), any(UpdateBookingStatusRequest.class), any()))
                .thenThrow(new BadRequestException("Không thể chuyển đổi trạng thái đơn thuê từ PENDING sang COMPLETED"));

        mockMvc.perform(patch("/api/admin/bookings/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Không thể chuyển đổi trạng thái đơn thuê từ PENDING sang COMPLETED"));
    }
}
