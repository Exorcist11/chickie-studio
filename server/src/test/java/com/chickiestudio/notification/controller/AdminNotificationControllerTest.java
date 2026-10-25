package com.chickiestudio.notification.controller;

import com.chickiestudio.auth.security.JwtAuthenticationFilter;
import com.chickiestudio.auth.security.JwtTokenProvider;
import com.chickiestudio.auth.security.SecurityConfig;
import com.chickiestudio.common.exception.GlobalExceptionHandler;
import com.chickiestudio.notification.dto.NotificationLogResponse;
import com.chickiestudio.notification.dto.ResendEmailRequest;
import com.chickiestudio.notification.entity.NotificationChannel;
import com.chickiestudio.notification.entity.NotificationStatus;
import com.chickiestudio.notification.entity.NotificationTemplateType;
import com.chickiestudio.notification.service.EmailNotificationService;
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
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminNotificationController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, GlobalExceptionHandler.class})
class AdminNotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmailNotificationService emailNotificationService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @WithMockUser(roles = "ADMIN")
    @DisplayName("GET /api/admin/bookings/{id}/notifications trả về 200 và danh sách lịch sử email")
    void getBookingNotifications_asAdmin_returns200() throws Exception {
        NotificationLogResponse logItem = NotificationLogResponse.builder()
                .id(1L)
                .bookingId(10L)
                .recipientEmail("customer@gmail.com")
                .recipientName("Phương Anh")
                .channel(NotificationChannel.EMAIL)
                .templateType(NotificationTemplateType.BOOKING_CONFIRMATION)
                .subject("Xác nhận đơn")
                .status(NotificationStatus.SENT)
                .sentAt(LocalDateTime.now())
                .build();

        when(emailNotificationService.getLogsByBookingId(10L)).thenReturn(List.of(logItem));

        mockMvc.perform(get("/api/admin/bookings/10/notifications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].recipientEmail").value("customer@gmail.com"))
                .andExpect(jsonPath("$.data[0].templateType").value("BOOKING_CONFIRMATION"))
                .andExpect(jsonPath("$.data[0].status").value("SENT"));
    }

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("POST /api/admin/bookings/{id}/resend-email trả về 200 khi gửi lại thành công")
    void resendEmail_asStaff_returns200() throws Exception {
        ResendEmailRequest request = ResendEmailRequest.builder()
                .templateType(NotificationTemplateType.BOOKING_CONFIRMATION)
                .build();

        NotificationLogResponse response = NotificationLogResponse.builder()
                .id(2L)
                .bookingId(10L)
                .recipientEmail("customer@gmail.com")
                .status(NotificationStatus.SENT)
                .build();

        when(emailNotificationService.resendEmail(eq(10L), eq(NotificationTemplateType.BOOKING_CONFIRMATION)))
                .thenReturn(response);

        mockMvc.perform(post("/api/admin/bookings/10/resend-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.id").value(2))
                .andExpect(jsonPath("$.data.status").value("SENT"));
    }

    @Test
    @WithMockUser(roles = "STAFF")
    @DisplayName("POST /api/admin/bookings/{id}/resend-email trả về 400 khi templateType null")
    void resendEmail_invalidBody_returns400() throws Exception {
        mockMvc.perform(post("/api/admin/bookings/10/resend-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("GET /api/admin/bookings/{id}/notifications trả về 401 khi chưa đăng nhập")
    void getBookingNotifications_unauthorized_returns401() throws Exception {
        mockMvc.perform(get("/api/admin/bookings/10/notifications"))
                .andExpect(status().isUnauthorized());
    }
}
