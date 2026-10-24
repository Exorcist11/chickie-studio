package com.chickiestudio.auth.controller;

import com.chickiestudio.auth.dto.LoginRequest;
import com.chickiestudio.auth.dto.LoginResponse;
import com.chickiestudio.auth.dto.TokenResponse;
import com.chickiestudio.auth.service.AuthService;
import com.chickiestudio.common.dto.ApiResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private static final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";
    private static final long REFRESH_COOKIE_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 ngày

    private final AuthService authService;

    @PostMapping("/public/auth/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        LoginResponse result = authService.login(request);
        setRefreshTokenCookie(response, result.refreshToken(), REFRESH_COOKIE_MAX_AGE_SECONDS);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/public/auth/refresh")
    public ResponseEntity<ApiResponse<TokenResponse>> refresh(
            @CookieValue(name = REFRESH_TOKEN_COOKIE_NAME, required = false) String cookieRefreshToken,
            @RequestBody(required = false) Map<String, String> body,
            HttpServletResponse response
    ) {
        String token = cookieRefreshToken;
        if (token == null && body != null) {
            token = body.get(REFRESH_TOKEN_COOKIE_NAME);
        }

        TokenResponse result = authService.refreshToken(token);
        setRefreshTokenCookie(response, result.refreshToken(), REFRESH_COOKIE_MAX_AGE_SECONDS);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/admin/auth/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @CookieValue(name = REFRESH_TOKEN_COOKIE_NAME, required = false) String cookieRefreshToken,
            HttpServletResponse response
    ) {
        authService.logout(cookieRefreshToken);
        clearRefreshTokenCookie(response);
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công", null));
    }

    @GetMapping("/admin/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "username", authentication.getName(),
                "authorities", authentication.getAuthorities()
        )));
    }

    @GetMapping("/admin/system-settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemSettings() {
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "shopName", "Chickie Studio",
                "depositRate", 0.5,
                "laundryBufferDays", 2
        )));
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken, long maxAge) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge((int) maxAge);
        response.addCookie(cookie);
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, "");
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}
