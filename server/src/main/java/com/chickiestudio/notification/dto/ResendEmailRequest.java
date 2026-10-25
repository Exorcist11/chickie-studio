package com.chickiestudio.notification.dto;

import com.chickiestudio.notification.entity.NotificationTemplateType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResendEmailRequest {

    @NotNull(message = "Loại template email không được để trống")
    private NotificationTemplateType templateType;
}
