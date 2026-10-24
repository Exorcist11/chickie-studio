package com.chickiestudio.auth.service.impl;

import com.chickiestudio.auth.dto.LoginRequest;
import com.chickiestudio.auth.dto.LoginResponse;
import com.chickiestudio.auth.dto.TokenResponse;
import com.chickiestudio.auth.entity.RefreshToken;
import com.chickiestudio.auth.repository.RefreshTokenRepository;
import com.chickiestudio.auth.security.JwtTokenProvider;
import com.chickiestudio.auth.service.AuthService;
import com.chickiestudio.auth.util.TokenHashUtils;
import com.chickiestudio.common.exception.ForbiddenException;
import com.chickiestudio.common.exception.UnauthorizedException;
import com.chickiestudio.user.dto.UserResponse;
import com.chickiestudio.user.entity.User;
import com.chickiestudio.user.entity.UserStatus;
import com.chickiestudio.user.mapper.UserMapper;
import com.chickiestudio.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserMapper userMapper;

    @Override
    public LoginResponse login(LoginRequest request) {
        log.info("Processing login request for user identifier: {}", request.username());

        User user = userRepository.findByUsernameOrEmail(request.username())
                .orElseThrow(() -> new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không chính xác"));

        if (user.getStatus() == UserStatus.INACTIVE) {
            log.warn("Login attempt for inactive user ID: {}", user.getId());
            throw new ForbiddenException("Tài khoản của bạn đã bị tạm khóa, vui lòng liên hệ quản trị viên");
        }

        if (user.isAccountLocked()) {
            log.warn("Login attempt for locked user ID: {}", user.getId());
            throw new ForbiddenException("Tài khoản đã bị khóa tạm thời do nhập sai nhiều lần. Vui lòng thử lại sau 15 phút");
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            user.incrementFailedAttempts();
            userRepository.save(user);
            log.warn("Password mismatch for user ID: {}, failed attempts: {}", user.getId(), user.getFailedAttempts());
            throw new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không chính xác");
        }

        user.resetFailedAttempts();
        userRepository.save(user);

        // Sinh token
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshTokenString = jwtTokenProvider.generateRefreshTokenString();

        // Lưu Refresh Token
        saveRefreshToken(user, refreshTokenString);

        UserResponse userResponse = userMapper.toResponse(user);
        long expiresInSeconds = jwtTokenProvider.getAccessTokenExpirationSeconds();

        return new LoginResponse(accessToken, "Bearer", expiresInSeconds, refreshTokenString, userResponse);
    }

    @Override
    public TokenResponse refreshToken(String refreshTokenString) {
        if (refreshTokenString == null || refreshTokenString.isBlank()) {
            throw new UnauthorizedException("Refresh Token không hợp lệ");
        }

        String tokenHash = TokenHashUtils.hash(refreshTokenString);
        RefreshToken token = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new UnauthorizedException("Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại"));

        if (token.isRevoked()) {
            // Token Reuse Detection: Nghi vấn bị đánh cắp -> Thu hồi toàn bộ token của user
            log.warn("Revoked refresh token reused! Revoking all sessions for user ID: {}", token.getUser().getId());
            refreshTokenRepository.revokeAllByUser(token.getUser());
            throw new UnauthorizedException("Phát hiện bất thường bảo mật phiên. Toàn bộ phiên làm việc đã bị hủy");
        }

        if (token.isExpired()) {
            log.warn("Expired refresh token for user ID: {}", token.getUser().getId());
            token.setRevoked(true);
            refreshTokenRepository.save(token);
            throw new UnauthorizedException("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
        }

        User user = token.getUser();
        if (user.getStatus() == UserStatus.INACTIVE || user.isAccountLocked()) {
            throw new ForbiddenException("Tài khoản không ở trạng thái hoạt động");
        }

        // Đánh dấu thu hồi token cũ (Refresh Token Rotation)
        token.setRevoked(true);
        refreshTokenRepository.save(token);

        // Cấp cặp token mới
        String newAccessToken = jwtTokenProvider.generateAccessToken(user);
        String newRefreshTokenString = jwtTokenProvider.generateRefreshTokenString();
        saveRefreshToken(user, newRefreshTokenString);

        long expiresInSeconds = jwtTokenProvider.getAccessTokenExpirationSeconds();
        return new TokenResponse(newAccessToken, "Bearer", expiresInSeconds, newRefreshTokenString);
    }

    @Override
    public void logout(String refreshTokenString) {
        if (refreshTokenString != null && !refreshTokenString.isBlank()) {
            String tokenHash = TokenHashUtils.hash(refreshTokenString);
            refreshTokenRepository.revokeByTokenHash(tokenHash);
            log.info("Successfully revoked refresh token on logout");
        }
    }

    @Override
    public UserResponse getProfile(String username) {
        User user = userRepository.findByUsernameOrEmail(username)
                .orElseThrow(() -> new UnauthorizedException("Không tìm thấy thông tin tài khoản"));
        return userMapper.toResponse(user);
    }

    private void saveRefreshToken(User user, String tokenString) {
        long expirationMs = jwtTokenProvider.getRefreshTokenExpirationMs();
        LocalDateTime expiresAt = LocalDateTime.now().plusSeconds(expirationMs / 1000);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(TokenHashUtils.hash(tokenString))
                .expiresAt(expiresAt)
                .revoked(false)
                .build();

        refreshTokenRepository.save(refreshToken);
    }
}
