package com.chickiestudio.booking.controller;

import com.chickiestudio.auth.security.JwtAuthenticationFilter;
import com.chickiestudio.auth.security.JwtTokenProvider;
import com.chickiestudio.auth.security.SecurityConfig;
import com.chickiestudio.booking.dto.BookingItemResponse;
import com.chickiestudio.booking.dto.BookingResponse;
import com.chickiestudio.booking.dto.BookingTrackingRequest;
import com.chickiestudio.booking.dto.CreateBookingRequest;
import com.chickiestudio.booking.entity.BookingStatus;
import com.chickiestudio.booking.service.BookingService;
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
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PublicBookingController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, GlobalExceptionHandler.class})
class PublicBookingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private BookingService bookingService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @DisplayName("POST /api/public/bookings - Khách gửi đơn đặt thuê thành công (201 Created)")
    void createBooking_Success() throws Exception {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalDate dayAfter = LocalDate.now().plusDays(2);

        CreateBookingRequest request = CreateBookingRequest.builder()
                .customerName("Lê Hải Yến")
                .customerPhone("0901234567")
                .deliveryMethod("PICKUP_STORE")
                .rentalStartDate(tomorrow)
                .rentalEndDate(dayAfter)
                .variantId(12L)
                .note("Giao trước 10h")
                .build();

        BookingResponse response = BookingResponse.builder()
                .id(1L)
                .bookingCode("BK20261025-9988")
                .customerName("Lê Hải Yến")
                .customerPhone("0901234567")
                .deliveryMethod("PICKUP_STORE")
                .rentalStartDate(tomorrow)
                .rentalEndDate(dayAfter)
                .durationDays(2)
                .status(BookingStatus.PENDING)
                .totalRentalPrice(new BigDecimal("360000"))
                .totalDepositPrice(new BigDecimal("500000"))
                .totalAmount(new BigDecimal("860000"))
                .createdAt(LocalDateTime.now())
                .items(List.of(
                        BookingItemResponse.builder()
                                .id(1L)
                                .productItemId(101L)
                                .productItemCode("CK-VTK-001")
                                .variantId(12L)
                                .productName("Đầm maxi voan xòe")
                                .variantSize("S")
                                .rentalPrice(new BigDecimal("360000"))
                                .depositPrice(new BigDecimal("500000"))
                                .build()
                ))
                .build();

        when(bookingService.createBooking(any(CreateBookingRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/public/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.bookingCode").value("BK20261025-9988"))
                .andExpect(jsonPath("$.data.customerName").value("Lê Hải Yến"))
                .andExpect(jsonPath("$.data.totalAmount").value(860000));
    }

    @Test
    @DisplayName("POST /api/public/bookings - Báo lỗi 400 Bad Request khi thiếu trường bắt buộc hoặc SĐT sai")
    void createBooking_ValidationFailure() throws Exception {
        CreateBookingRequest invalidRequest = CreateBookingRequest.builder()
                .customerName("") // Trống
                .customerPhone("123") // Sai định dạng
                .variantId(null)
                .build();

        mockMvc.perform(post("/api/public/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
    }

    @Test
    @DisplayName("POST /api/public/bookings - Báo lỗi 409 Conflict khi sản phẩm kín lịch")
    void createBooking_Conflict_Returns409() throws Exception {
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        LocalDate dayAfter = LocalDate.now().plusDays(2);

        CreateBookingRequest request = CreateBookingRequest.builder()
                .customerName("Lê Hải Yến")
                .customerPhone("0901234567")
                .deliveryMethod("PICKUP_STORE")
                .rentalStartDate(tomorrow)
                .rentalEndDate(dayAfter)
                .variantId(12L)
                .build();

        when(bookingService.createBooking(any(CreateBookingRequest.class)))
                .thenThrow(new ConflictException("Sản phẩm đã kín lịch"));

        mockMvc.perform(post("/api/public/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value(409))
                .andExpect(jsonPath("$.message").value("Sản phẩm đã kín lịch"));
    }

    @Test
    @DisplayName("GET /api/public/bookings/{bookingCode} - Tra cứu đơn đặt thuê thành công (200 OK)")
    void getBookingByCode_Success() throws Exception {
        BookingResponse response = BookingResponse.builder()
                .id(1L)
                .bookingCode("BK20261025-9988")
                .customerName("Lê Hải Yến")
                .customerPhone("0901234567")
                .deliveryMethod("PICKUP_STORE")
                .rentalStartDate(LocalDate.now().plusDays(1))
                .rentalEndDate(LocalDate.now().plusDays(2))
                .status(BookingStatus.PENDING)
                .totalAmount(new BigDecimal("860000"))
                .build();

        when(bookingService.getBookingByCode("BK20261025-9988")).thenReturn(response);

        mockMvc.perform(get("/api/public/bookings/BK20261025-9988"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.bookingCode").value("BK20261025-9988"));
    }

    @Test
    @DisplayName("GET /api/public/bookings/{bookingCode} - Báo lỗi 404 khi không tìm thấy đơn")
    void getBookingByCode_NotFound() throws Exception {
        when(bookingService.getBookingByCode("NOT-FOUND"))
                .thenThrow(new ResourceNotFoundException("Không tìm thấy đơn đặt thuê"));

        mockMvc.perform(get("/api/public/bookings/NOT-FOUND"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(404));
    }

    @Test
    @DisplayName("POST /api/public/bookings/tracking - Tra cứu đơn bằng mã và số điện thoại thành công (200 OK)")
    void trackBooking_Success() throws Exception {
        BookingTrackingRequest request = BookingTrackingRequest.builder()
                .bookingCode("BK20261025-9988")
                .phone("0901234567")
                .build();

        BookingResponse response = BookingResponse.builder()
                .id(1L)
                .bookingCode("BK20261025-9988")
                .customerName("Lê Hải Yến")
                .customerPhone("0901234567")
                .deliveryMethod("PICKUP_STORE")
                .rentalStartDate(LocalDate.now().plusDays(1))
                .rentalEndDate(LocalDate.now().plusDays(2))
                .status(BookingStatus.CONFIRMED)
                .totalAmount(new BigDecimal("860000"))
                .build();

        when(bookingService.trackBooking(any(BookingTrackingRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/public/bookings/tracking")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Tra cứu đơn thuê thành công"))
                .andExpect(jsonPath("$.data.bookingCode").value("BK20261025-9988"))
                .andExpect(jsonPath("$.data.status").value("CONFIRMED"));
    }

    @Test
    @DisplayName("POST /api/public/bookings/tracking - Báo lỗi 400 Bad Request khi thiếu mã đơn hoặc SĐT sai format")
    void trackBooking_ValidationFailure() throws Exception {
        BookingTrackingRequest request = BookingTrackingRequest.builder()
                .bookingCode("")
                .phone("123")
                .build();

        mockMvc.perform(post("/api/public/bookings/tracking")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
    }

    @Test
    @DisplayName("POST /api/public/bookings/tracking - Báo lỗi 404 khi không tìm thấy đơn hoặc SĐT không khớp")
    void trackBooking_NotFound() throws Exception {
        BookingTrackingRequest request = BookingTrackingRequest.builder()
                .bookingCode("BK20261025-0000")
                .phone("0901234567")
                .build();

        when(bookingService.trackBooking(any(BookingTrackingRequest.class)))
                .thenThrow(new ResourceNotFoundException("Không tìm thấy đơn đặt thuê phù hợp. Vui lòng kiểm tra lại mã đơn và số điện thoại"));

        mockMvc.perform(post("/api/public/bookings/tracking")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(404));
    }
}
