package com.chickiestudio.booking.controller;

import com.chickiestudio.auth.security.JwtAuthenticationFilter;
import com.chickiestudio.auth.security.JwtTokenProvider;
import com.chickiestudio.auth.security.SecurityConfig;
import com.chickiestudio.booking.dto.AvailableReplacementDto;
import com.chickiestudio.booking.dto.CalendarBookingDto;
import com.chickiestudio.booking.dto.CalendarDispatchResponse;
import com.chickiestudio.booking.dto.ReassignItemRequest;
import com.chickiestudio.booking.dto.ReassignItemResponse;
import com.chickiestudio.booking.dto.RescheduleBookingRequest;
import com.chickiestudio.booking.dto.RescheduleBookingResponse;
import com.chickiestudio.booking.dto.TimelineDispatchResponse;
import com.chickiestudio.booking.dto.TimelineEventDto;
import com.chickiestudio.booking.dto.TimelineResourceDto;
import com.chickiestudio.booking.entity.BookingStatus;
import com.chickiestudio.booking.service.DispatchService;
import com.chickiestudio.category.entity.CategoryType;
import com.chickiestudio.common.exception.GlobalExceptionHandler;
import com.chickiestudio.product.entity.ProductItemStatus;
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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminDispatchController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, GlobalExceptionHandler.class})
class AdminDispatchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private DispatchService dispatchService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("GET /api/admin/dispatch/calendar: Thành công trả về 200 OK")
    void getCalendarData_Success() throws Exception {
        CalendarDispatchResponse response = CalendarDispatchResponse.builder()
                .startDate(LocalDate.of(2026, 11, 1))
                .endDate(LocalDate.of(2026, 11, 30))
                .totalBookings(1)
                .bookings(List.of(
                        CalendarBookingDto.builder()
                                .id(1L)
                                .bookingCode("BK-001")
                                .customerName("Trần Văn A")
                                .status(BookingStatus.CONFIRMED)
                                .totalAmount(BigDecimal.valueOf(1000000))
                                .build()
                ))
                .build();

        when(dispatchService.getCalendarData(any(), any(), any(), any())).thenReturn(response);

        mockMvc.perform(get("/api/admin/dispatch/calendar")
                        .param("startDate", "2026-11-01")
                        .param("endDate", "2026-11-30"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.totalBookings").value(1))
                .andExpect(jsonPath("$.data.bookings[0].bookingCode").value("BK-001"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/admin/dispatch/timeline: Thành công trả về 200 OK")
    void getTimelineData_Success() throws Exception {
        TimelineDispatchResponse response = TimelineDispatchResponse.builder()
                .startDate(LocalDate.of(2026, 11, 1))
                .endDate(LocalDate.of(2026, 11, 30))
                .resources(List.of(
                        TimelineResourceDto.builder()
                                .itemId(101L)
                                .barcode("CK-DR-001")
                                .productName("Váy Dạ Hội Kim Sa")
                                .categoryType(CategoryType.COSTUME)
                                .itemStatus(ProductItemStatus.AVAILABLE)
                                .events(List.of(
                                        TimelineEventDto.builder()
                                                .bookingCode("BK-001")
                                                .startDate(LocalDate.of(2026, 11, 5))
                                                .endDate(LocalDate.of(2026, 11, 7))
                                                .bufferDays(1)
                                                .build()
                                ))
                                .build()
                ))
                .build();

        when(dispatchService.getTimelineData(any(), any(), any(), any())).thenReturn(response);

        mockMvc.perform(get("/api/admin/dispatch/timeline")
                        .param("startDate", "2026-11-01")
                        .param("endDate", "2026-11-30"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.resources[0].barcode").value("CK-DR-001"))
                .andExpect(jsonPath("$.data.resources[0].events[0].bookingCode").value("BK-001"));
    }

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("GET /api/admin/dispatch/available-replacements: Thành công trả về 200 OK")
    void getAvailableReplacements_Success() throws Exception {
        AvailableReplacementDto dto = AvailableReplacementDto.builder()
                .itemId(102L)
                .barcode("CK-DR-002")
                .isAvailable(true)
                .isCurrent(false)
                .build();

        when(dispatchService.getAvailableReplacements(eq(301L))).thenReturn(List.of(dto));

        mockMvc.perform(get("/api/admin/dispatch/available-replacements")
                        .param("bookingItemId", "301"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data[0].barcode").value("CK-DR-002"));
    }

    @Test
    @WithMockUser(username = "admin_linh", roles = "ADMIN")
    @DisplayName("POST /api/admin/dispatch/reassign-item: Hợp lệ trả về 200 OK")
    void reassignItem_Success() throws Exception {
        ReassignItemRequest request = ReassignItemRequest.builder()
                .bookingItemId(301L)
                .newItemId(102L)
                .reason("Món đồ cũ bị rách gấu váy")
                .build();

        ReassignItemResponse response = ReassignItemResponse.builder()
                .bookingItemId(301L)
                .bookingCode("BK-001")
                .oldBarcode("CK-DR-001")
                .newBarcode("CK-DR-002")
                .changedBy("admin_linh")
                .updatedAt(LocalDateTime.now())
                .message("Điều phối đổi sang món đồ CK-DR-002 thành công")
                .build();

        when(dispatchService.reassignItem(any(), anyString())).thenReturn(response);

        mockMvc.perform(post("/api/admin/dispatch/reassign-item")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.newBarcode").value("CK-DR-002"))
                .andExpect(jsonPath("$.data.oldBarcode").value("CK-DR-001"));
    }

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("POST /api/admin/dispatch/reassign-item: Lý do trống trả về 400 Bad Request")
    void reassignItem_ValidationFailed() throws Exception {
        ReassignItemRequest invalidRequest = ReassignItemRequest.builder()
                .bookingItemId(301L)
                .newItemId(102L)
                .reason("") // blank
                .build();

        mockMvc.perform(post("/api/admin/dispatch/reassign-item")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "staff_hoa", roles = "STAFF")
    @DisplayName("POST /api/admin/dispatch/reschedule: Hợp lệ trả về 200 OK")
    void rescheduleBooking_Success() throws Exception {
        RescheduleBookingRequest request = RescheduleBookingRequest.builder()
                .bookingId(201L)
                .newStartDate(LocalDate.of(2026, 11, 10))
                .newEndDate(LocalDate.of(2026, 11, 13))
                .reason("Khách dời lịch chụp ảnh kỷ yếu")
                .build();

        RescheduleBookingResponse response = RescheduleBookingResponse.builder()
                .bookingId(201L)
                .bookingCode("BK-001")
                .newStartDate(LocalDate.of(2026, 11, 10))
                .newEndDate(LocalDate.of(2026, 11, 13))
                .durationDays(4)
                .totalRentalPrice(BigDecimal.valueOf(2000000))
                .changedBy("staff_hoa")
                .updatedAt(LocalDateTime.now())
                .message("Dời lịch thuê đơn BK-001 thành công")
                .build();

        when(dispatchService.rescheduleBooking(any(), anyString())).thenReturn(response);

        mockMvc.perform(post("/api/admin/dispatch/reschedule")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.bookingCode").value("BK-001"))
                .andExpect(jsonPath("$.data.durationDays").value(4));
    }

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("POST /api/admin/dispatch/reschedule: Thiếu ngày bắt đầu trả về 400 Bad Request")
    void rescheduleBooking_ValidationFailed() throws Exception {
        RescheduleBookingRequest invalidRequest = RescheduleBookingRequest.builder()
                .bookingId(201L)
                .newStartDate(null) // null
                .newEndDate(LocalDate.of(2026, 11, 13))
                .reason("Dời ngày")
                .build();

        mockMvc.perform(post("/api/admin/dispatch/reschedule")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Truy cập Dispatch endpoint không có authentication trả về 401 Unauthorized")
    void accessWithoutAuth_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/dispatch/calendar"))
                .andExpect(status().isUnauthorized());
    }
}
