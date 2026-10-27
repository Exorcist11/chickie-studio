package com.chickiestudio.user.dto;

import com.chickiestudio.user.entity.Role;
import com.chickiestudio.user.entity.UserStatus;

import java.time.LocalDateTime;

public record UserResponse(
    Long id,
    String username,
    String email,
    String fullName,
    String phone,
    Role role,
    UserStatus status,
    LocalDateTime createdAt
) {
    public UserResponse(Long id, String username, String email, String fullName, String phone, Role role, UserStatus status) {
        this(id, username, email, fullName, phone, role, status, null);
    }
}
