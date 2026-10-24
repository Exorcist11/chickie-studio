package com.chickiestudio.auth.service;

import com.chickiestudio.auth.dto.LoginRequest;
import com.chickiestudio.auth.dto.LoginResponse;
import com.chickiestudio.auth.dto.TokenResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    TokenResponse refreshToken(String refreshToken);

    void logout(String refreshToken);
}
