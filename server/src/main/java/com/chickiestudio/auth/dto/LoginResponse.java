package com.chickiestudio.auth.dto;

import com.chickiestudio.user.dto.UserResponse;

public record LoginResponse(
    String accessToken,
    String tokenType,
    long expiresIn,
    String refreshToken,
    UserResponse user
) {}
