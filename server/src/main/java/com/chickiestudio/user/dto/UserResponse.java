package com.chickiestudio.user.dto;

import com.chickiestudio.user.entity.Role;
import com.chickiestudio.user.entity.UserStatus;

public record UserResponse(
    Long id,
    String username,
    String email,
    String fullName,
    String phone,
    Role role,
    UserStatus status
) {}
