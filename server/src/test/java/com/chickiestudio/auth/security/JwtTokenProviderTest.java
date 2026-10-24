package com.chickiestudio.auth.security;

import com.chickiestudio.user.entity.Role;
import com.chickiestudio.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", "4c6869636b696553747564696f5365637265744b657932303236466f724a575441757468656e7469636174696f6e546f6b656e");
        ReflectionTestUtils.setField(tokenProvider, "accessTokenExpirationMs", 900000L);
        ReflectionTestUtils.setField(tokenProvider, "refreshTokenExpirationMs", 604800000L);
        tokenProvider.init();
    }

    @Test
    @DisplayName("generateAccessToken_whenValidUser_shouldGenerateValidJwt")
    void generateAccessToken_whenValidUser_shouldGenerateValidJwt() {
        User user = User.builder()
                .id(1L)
                .username("testadmin")
                .fullName("Test Admin")
                .role(Role.ROLE_ADMIN)
                .build();

        String token = tokenProvider.generateAccessToken(user);

        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals("testadmin", tokenProvider.getUsernameFromToken(token));
        assertEquals("ROLE_ADMIN", tokenProvider.getRoleFromToken(token));
    }

    @Test
    @DisplayName("validateToken_whenInvalidOrCorrupted_shouldReturnFalse")
    void validateToken_whenInvalidOrCorrupted_shouldReturnFalse() {
        assertFalse(tokenProvider.validateToken("invalid.jwt.token"));
        assertNull(tokenProvider.getUsernameFromToken("invalid.jwt.token"));
        assertNull(tokenProvider.getRoleFromToken("invalid.jwt.token"));
    }

    @Test
    @DisplayName("generateRefreshTokenString_shouldGenerate64CharRandomString")
    void generateRefreshTokenString_shouldGenerate64CharRandomString() {
        String token1 = tokenProvider.generateRefreshTokenString();
        String token2 = tokenProvider.generateRefreshTokenString();

        assertNotNull(token1);
        assertNotEquals(token1, token2);
        assertEquals(64, token1.length());
    }

    @Test
    @DisplayName("getExpirationSeconds_shouldCalculateCorrectly")
    void getExpirationSeconds_shouldCalculateCorrectly() {
        assertEquals(900L, tokenProvider.getAccessTokenExpirationSeconds());
        assertEquals(604800000L, tokenProvider.getRefreshTokenExpirationMs());
    }
}
