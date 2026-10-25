package com.chickiestudio.notification.controller;

import com.chickiestudio.common.dto.ApiResponse;
import com.chickiestudio.notification.dto.NotificationLogResponse;
import com.chickiestudio.notification.dto.ResendEmailRequest;
import com.chickiestudio.notification.service.EmailNotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
public class AdminNotificationController {

    private final EmailNotificationService emailNotificationService;

    @GetMapping("/{id}/notifications")
    public ResponseEntity<ApiResponse<List<NotificationLogResponse>>> getBookingNotifications(@PathVariable Long id) {
        List<NotificationLogResponse> logs = emailNotificationService.getLogsByBookingId(id);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    @PostMapping("/{id}/resend-email")
    public ResponseEntity<ApiResponse<NotificationLogResponse>> resendEmail(
            @PathVariable Long id,
            @Valid @RequestBody ResendEmailRequest request
    ) {
        NotificationLogResponse response = emailNotificationService.resendEmail(id, request.getTemplateType());
        return ResponseEntity.ok(ApiResponse.success("Yêu cầu gửi lại email đã được tiếp nhận thành công", response));
    }
}
