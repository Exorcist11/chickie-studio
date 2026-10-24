package com.chickiestudio.auth.controller;

import com.chickiestudio.auth.dto.LoginRequest;
import com.chickiestudio.auth.dto.LoginResponse;
import com.chickiestudio.auth.dto.TokenResponse;
import com.chickiestudio.auth.security.JwtAuthenticationFilter;
import com.chickiestudio.auth.security.JwtTokenProvider;
import com.chickiestudio.auth.security.SecurityConfig;
import com.chickiestudio.auth.service.AuthService;
import com.chickiestudio.common.exception.GlobalExceptionHandler;
import com.chickiestudio.user.dto.UserResponse;
import com.chickiestudio.user.entity.Role;
import com.chickiestudio.user.entity.UserStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, GlobalExceptionHandler.class})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @DisplayName("login_whenValidRequest_shouldReturn200AndSetCookie")
    void login_whenValidRequest_shouldReturn200AndSetCookie() throws Exception {
        LoginRequest request = new LoginRequest("admin", "Admin@123456");
        UserResponse user = new UserResponse(1L, "admin", "admin@chickie.vn", "Admin", null, Role.ROLE_ADMIN, UserStatus.ACTIVE);
        LoginResponse response = new LoginResponse("mock.access.token", "Bearer", 900L, "mock-refresh-token", user);

        when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/public/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("refreshToken"))
                .andExpect(cookie().value("refreshToken", "mock-refresh-token"))
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.accessToken").value("mock.access.token"))
                .andExpect(jsonPath("$.data.user.username").value("admin"));
    }

    @Test
    @DisplayName("login_whenInvalidRequestBody_shouldReturn400BadRequest")
    void login_whenInvalidRequestBody_shouldReturn400BadRequest() throws Exception {
        LoginRequest request = new LoginRequest("", "");

        mockMvc.perform(post("/api/public/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
    }

    @Test
    @DisplayName("refresh_whenValidCookieProvided_shouldReturn200AndNewToken")
    void refresh_whenValidCookieProvided_shouldReturn200AndNewToken() throws Exception {
        TokenResponse response = new TokenResponse("new.access.token", "Bearer", 900L, "new-refresh-token");
        when(authService.refreshToken("cookie-refresh-token")).thenReturn(response);

        mockMvc.perform(post("/api/public/auth/refresh")
                        .cookie(new Cookie("refreshToken", "cookie-refresh-token")))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("refreshToken"))
                .andExpect(cookie().value("refreshToken", "new-refresh-token"))
                .andExpect(jsonPath("$.data.accessToken").value("new.access.token"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("logout_whenCalled_shouldReturn200AndClearCookie")
    void logout_whenCalled_shouldReturn200AndClearCookie() throws Exception {
        mockMvc.perform(post("/api/admin/auth/logout")
                        .cookie(new Cookie("refreshToken", "old-refresh-token")))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("refreshToken"))
                .andExpect(cookie().maxAge("refreshToken", 0))
                .andExpect(jsonPath("$.code").value(200));

        verify(authService).logout("old-refresh-token");
    }

    @Test
    @WithMockUser(username = "staffuser", roles = {"STAFF"})
    @DisplayName("getProfile_whenAuthenticatedAsStaff_shouldReturn200")
    void getProfile_whenAuthenticatedAsStaff_shouldReturn200() throws Exception {
        UserResponse user = new UserResponse(2L, "staffuser", "staff@chickie.vn", "Staff", null, Role.ROLE_STAFF, UserStatus.ACTIVE);
        when(authService.getProfile("staffuser")).thenReturn(user);

        mockMvc.perform(get("/api/admin/profile"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.username").value("staffuser"))
                .andExpect(jsonPath("$.data.user.username").value("staffuser"));
    }

    @Test
    @DisplayName("getProfile_whenUnauthenticated_shouldReturn401")
    void getProfile_whenUnauthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(get("/api/admin/profile"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value(401));
    }

    @Test
    @WithMockUser(username = "adminuser", roles = {"ADMIN"})
    @DisplayName("getSystemSettings_whenAdmin_shouldReturn200")
    void getSystemSettings_whenAdmin_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/admin/system-settings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.shopName").value("Chickie Studio"));
    }

    @Test
    @WithMockUser(username = "staffuser", roles = {"STAFF"})
    @DisplayName("getSystemSettings_whenStaff_shouldReturn403Forbidden")
    void getSystemSettings_whenStaff_shouldReturn403Forbidden() throws Exception {
        mockMvc.perform(get("/api/admin/system-settings"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(403));
    }
}
