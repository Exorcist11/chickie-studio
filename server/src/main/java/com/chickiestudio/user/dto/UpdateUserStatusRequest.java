package com.chickiestudio.user.dto;

import com.chickiestudio.user.entity.UserStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusRequest(
    @NotNull(message = "Trạng thái người dùng không được để trống")
    UserStatus status
) {}
