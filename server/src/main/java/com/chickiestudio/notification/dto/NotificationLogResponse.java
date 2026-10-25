package com.chickiestudio.notification.dto;

import com.chickiestudio.notification.entity.NotificationChannel;
import com.chickiestudio.notification.entity.NotificationStatus;
import com.chickiestudio.notification.entity.NotificationTemplateType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationLogResponse {

    private Long id;
    private Long bookingId;
    private String recipientEmail;
    private String recipientName;
    private NotificationChannel channel;
    private NotificationTemplateType templateType;
    private String subject;
    private NotificationStatus status;
    private String errorMessage;
    private LocalDateTime sentAt;
    private LocalDateTime createdAt;
}
