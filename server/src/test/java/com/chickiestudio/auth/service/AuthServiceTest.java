package com.chickiestudio.auth.service;

import com.chickiestudio.auth.dto.LoginRequest;
import com.chickiestudio.auth.dto.LoginResponse;
import com.chickiestudio.auth.dto.TokenResponse;
import com.chickiestudio.auth.entity.RefreshToken;
import com.chickiestudio.auth.repository.RefreshTokenRepository;
import com.chickiestudio.auth.security.JwtTokenProvider;
import com.chickiestudio.auth.service.impl.AuthServiceImpl;
import com.chickiestudio.auth.util.TokenHashUtils;
import com.chickiestudio.common.exception.ForbiddenException;
import com.chickiestudio.common.exception.UnauthorizedException;
import com.chickiestudio.user.dto.UserResponse;
import com.chickiestudio.user.entity.Role;
import com.chickiestudio.user.entity.User;
import com.chickiestudio.user.entity.UserStatus;
import com.chickiestudio.user.mapper.UserMapper;
import com.chickiestudio.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .username("admin")
                .email("admin@chickie.vn")
                .passwordHash("$2a$10$hashedpassword")
                .fullName("Quản Trị Viên")
                .role(Role.ROLE_ADMIN)
                .status(UserStatus.ACTIVE)
                .failedAttempts(0)
                .build();
    }

    @Test
    @DisplayName("login_whenValidCredentials_shouldReturnLoginResponse")
    void login_whenValidCredentials_shouldReturnLoginResponse() {
        LoginRequest request = new LoginRequest("admin", "Admin@123456");
        UserResponse userResponse = new UserResponse(1L, "admin", "admin@chickie.vn", "Quản Trị Viên", null, Role.ROLE_ADMIN, UserStatus.ACTIVE);

        when(userRepository.findByUsernameOrEmail("admin")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("Admin@123456", sampleUser.getPasswordHash())).thenReturn(true);
        when(jwtTokenProvider.generateAccessToken(sampleUser)).thenReturn("mock.access.token");
        when(jwtTokenProvider.generateRefreshTokenString()).thenReturn("mock-refresh-token-string");
        when(jwtTokenProvider.getRefreshTokenExpirationMs()).thenReturn(604800000L);
        when(jwtTokenProvider.getAccessTokenExpirationSeconds()).thenReturn(900L);
        when(userMapper.toResponse(sampleUser)).thenReturn(userResponse);

        LoginResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock.access.token", response.accessToken());
        assertEquals("Bearer", response.tokenType());
        assertEquals(900L, response.expiresIn());
        assertEquals("mock-refresh-token-string", response.refreshToken());
        assertEquals("admin", response.user().username());

        verify(refreshTokenRepository).save(any(RefreshToken.class));
        verify(userRepository, atLeastOnce()).save(sampleUser);
    }

    @Test
    @DisplayName("login_whenUserNotFound_shouldThrowUnauthorizedException")
    void login_whenUserNotFound_shouldThrowUnauthorizedException() {
        LoginRequest request = new LoginRequest("unknown", "password");
        when(userRepository.findByUsernameOrEmail("unknown")).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
        verify(refreshTokenRepository, never()).save(any());
    }

    @Test
    @DisplayName("login_whenUserInactive_shouldThrowForbiddenException")
    void login_whenUserInactive_shouldThrowForbiddenException() {
        sampleUser.setStatus(UserStatus.INACTIVE);
        LoginRequest request = new LoginRequest("admin", "password");
        when(userRepository.findByUsernameOrEmail("admin")).thenReturn(Optional.of(sampleUser));

        assertThrows(ForbiddenException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("login_whenUserLocked_shouldThrowForbiddenException")
    void login_whenUserLocked_shouldThrowForbiddenException() {
        sampleUser.setLockedUntil(LocalDateTime.now().plusMinutes(10));
        LoginRequest request = new LoginRequest("admin", "password");
        when(userRepository.findByUsernameOrEmail("admin")).thenReturn(Optional.of(sampleUser));

        assertThrows(ForbiddenException.class, () -> authService.login(request));
    }

    @Test
    @DisplayName("login_whenWrongPassword_shouldIncrementFailedAttemptsAndThrowUnauthorized")
    void login_whenWrongPassword_shouldIncrementFailedAttemptsAndThrowUnauthorized() {
        LoginRequest request = new LoginRequest("admin", "WrongPassword");
        when(userRepository.findByUsernameOrEmail("admin")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("WrongPassword", sampleUser.getPasswordHash())).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
        assertEquals(1, sampleUser.getFailedAttempts());
        verify(userRepository).save(sampleUser);
    }

    @Test
    @DisplayName("login_whenWrongPassword5Times_shouldLockAccount")
    void login_whenWrongPassword5Times_shouldLockAccount() {
        sampleUser.setFailedAttempts(4);
        LoginRequest request = new LoginRequest("admin", "WrongPassword");
        when(userRepository.findByUsernameOrEmail("admin")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("WrongPassword", sampleUser.getPasswordHash())).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
        assertEquals(5, sampleUser.getFailedAttempts());
        assertTrue(sampleUser.isAccountLocked());
        verify(userRepository).save(sampleUser);
    }

    @Test
    @DisplayName("refreshToken_whenValidToken_shouldRotateAndReturnNewToken")
    void refreshToken_whenValidToken_shouldRotateAndReturnNewToken() {
        String refreshTokenString = "valid-refresh-token";
        String tokenHash = TokenHashUtils.hash(refreshTokenString);
        RefreshToken token = RefreshToken.builder()
                .id(10L)
                .user(sampleUser)
                .tokenHash(tokenHash)
                .expiresAt(LocalDateTime.now().plusDays(5))
                .revoked(false)
                .build();

        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(token));
        when(jwtTokenProvider.generateAccessToken(sampleUser)).thenReturn("new.access.token");
        when(jwtTokenProvider.generateRefreshTokenString()).thenReturn("new-refresh-token");
        when(jwtTokenProvider.getRefreshTokenExpirationMs()).thenReturn(604800000L);
        when(jwtTokenProvider.getAccessTokenExpirationSeconds()).thenReturn(900L);

        TokenResponse response = authService.refreshToken(refreshTokenString);

        assertNotNull(response);
        assertEquals("new.access.token", response.accessToken());
        assertEquals("new-refresh-token", response.refreshToken());
        assertTrue(token.isRevoked()); // Token cũ đã bị xoay vòng thu hồi
        verify(refreshTokenRepository, times(2)).save(any());
    }

    @Test
    @DisplayName("refreshToken_whenTokenNullOrBlank_shouldThrowUnauthorizedException")
    void refreshToken_whenTokenNullOrBlank_shouldThrowUnauthorizedException() {
        assertThrows(UnauthorizedException.class, () -> authService.refreshToken(null));
        assertThrows(UnauthorizedException.class, () -> authService.refreshToken("   "));
    }

    @Test
    @DisplayName("refreshToken_whenTokenNotFound_shouldThrowUnauthorizedException")
    void refreshToken_whenTokenNotFound_shouldThrowUnauthorizedException() {
        when(refreshTokenRepository.findByTokenHash(anyString())).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> authService.refreshToken("non-existent-token"));
    }

    @Test
    @DisplayName("refreshToken_whenTokenRevoked_shouldDetectReuseAndRevokeAll")
    void refreshToken_whenTokenRevoked_shouldDetectReuseAndRevokeAll() {
        String tokenString = "revoked-token";
        String tokenHash = TokenHashUtils.hash(tokenString);
        RefreshToken token = RefreshToken.builder()
                .user(sampleUser)
                .tokenHash(tokenHash)
                .expiresAt(LocalDateTime.now().plusDays(2))
                .revoked(true)
                .build();

        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(token));

        assertThrows(UnauthorizedException.class, () -> authService.refreshToken(tokenString));
        verify(refreshTokenRepository).revokeAllByUser(sampleUser);
    }

    @Test
    @DisplayName("refreshToken_whenTokenExpired_shouldRevokeAndThrowUnauthorized")
    void refreshToken_whenTokenExpired_shouldRevokeAndThrowUnauthorized() {
        String tokenString = "expired-token";
        String tokenHash = TokenHashUtils.hash(tokenString);
        RefreshToken token = RefreshToken.builder()
                .user(sampleUser)
                .tokenHash(tokenHash)
                .expiresAt(LocalDateTime.now().minusDays(1))
                .revoked(false)
                .build();

        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(token));

        assertThrows(UnauthorizedException.class, () -> authService.refreshToken(tokenString));
        assertTrue(token.isRevoked());
        verify(refreshTokenRepository).save(token);
    }

    @Test
    @DisplayName("refreshToken_whenUserInactiveOrLocked_shouldThrowForbiddenException")
    void refreshToken_whenUserInactiveOrLocked_shouldThrowForbiddenException() {
        sampleUser.setStatus(UserStatus.INACTIVE);
        String tokenString = "valid-token-inactive-user";
        String tokenHash = TokenHashUtils.hash(tokenString);
        RefreshToken token = RefreshToken.builder()
                .user(sampleUser)
                .tokenHash(tokenHash)
                .expiresAt(LocalDateTime.now().plusDays(2))
                .revoked(false)
                .build();

        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(token));

        assertThrows(ForbiddenException.class, () -> authService.refreshToken(tokenString));
    }

    @Test
    @DisplayName("logout_whenValidToken_shouldRevokeToken")
    void logout_whenValidToken_shouldRevokeToken() {
        String tokenString = "logout-token";
        String tokenHash = TokenHashUtils.hash(tokenString);

        authService.logout(tokenString);

        verify(refreshTokenRepository).revokeByTokenHash(tokenHash);
    }

    @Test
    @DisplayName("logout_whenNullToken_shouldDoNothing")
    void logout_whenNullToken_shouldDoNothing() {
        authService.logout(null);
        authService.logout("");

        verify(refreshTokenRepository, never()).revokeByTokenHash(anyString());
    }
}
