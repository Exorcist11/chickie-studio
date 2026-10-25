package com.chickiestudio.notification.mapper;

import com.chickiestudio.notification.dto.NotificationLogResponse;
import com.chickiestudio.notification.entity.NotificationLog;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface NotificationLogMapper {

    NotificationLogResponse toResponse(NotificationLog notificationLog);

    List<NotificationLogResponse> toResponseList(List<NotificationLog> logs);
}
