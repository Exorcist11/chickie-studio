package com.chickiestudio.user.controller;

import com.chickiestudio.auth.security.JwtAuthenticationFilter;
import com.chickiestudio.auth.security.JwtTokenProvider;
import com.chickiestudio.auth.security.SecurityConfig;
import com.chickiestudio.common.exception.GlobalExceptionHandler;
import com.chickiestudio.user.dto.CreateUserRequest;
import com.chickiestudio.user.dto.ResetPasswordRequest;
import com.chickiestudio.user.dto.UpdateUserRequest;
import com.chickiestudio.user.dto.UpdateUserStatusRequest;
import com.chickiestudio.user.dto.UserResponse;
import com.chickiestudio.user.entity.Role;
import com.chickiestudio.user.entity.UserStatus;
import com.chickiestudio.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminUserController.class)
@Import({SecurityConfig.class, JwtAuthenticationFilter.class, GlobalExceptionHandler.class})
class AdminUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    private final UserResponse sampleResponse = new UserResponse(
            5L,
            "maianh",
            "maianh@chickiestudio.vn",
            "Nguyễn Mai Anh",
            "0987654321",
            Role.ROLE_STAFF,
            UserStatus.ACTIVE,
            LocalDateTime.now()
    );

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("GET /api/admin/users - when admin should return 200 OK")
    void getUsers_whenAdmin_shouldReturn200() throws Exception {
        Page<UserResponse> page = new PageImpl<>(List.of(sampleResponse));
        when(userService.getUsers(any(), any(), any(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/admin/users")
                        .param("search", "maianh")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.content[0].username").value("maianh"));
    }

    @Test
    @WithMockUser(username = "staffuser", roles = {"STAFF"})
    @DisplayName("GET /api/admin/users - when staff should return 403 Forbidden")
    void getUsers_whenStaff_shouldReturn403() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(403));
    }

    @Test
    @DisplayName("GET /api/admin/users - when unauthenticated should return 401 Unauthorized")
    void getUsers_whenUnauthenticated_shouldReturn401() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value(401));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("GET /api/admin/users/{id} - when admin should return 200 OK")
    void getUserById_whenAdmin_shouldReturn200() throws Exception {
        when(userService.getUserById(5L)).thenReturn(sampleResponse);

        mockMvc.perform(get("/api/admin/users/5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.id").value(5));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("POST /api/admin/users - when valid should return 201 Created")
    void createUser_whenValid_shouldReturn201() throws Exception {
        CreateUserRequest request = new CreateUserRequest(
                "maianh",
                "Nguyễn Mai Anh",
                "maianh@chickiestudio.vn",
                "0987654321",
                "StaffPass@123",
                Role.ROLE_STAFF
        );

        when(userService.createUser(any(CreateUserRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(post("/api/admin/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Tạo tài khoản nhân viên thành công"))
                .andExpect(jsonPath("$.data.username").value("maianh"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("POST /api/admin/users - when invalid password should return 400 Bad Request")
    void createUser_whenInvalidPassword_shouldReturn400() throws Exception {
        CreateUserRequest request = new CreateUserRequest(
                "maianh",
                "Nguyễn Mai Anh",
                "maianh@chickiestudio.vn",
                "0987654321",
                "simple",
                Role.ROLE_STAFF
        );

        mockMvc.perform(post("/api/admin/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));

        verify(userService, never()).createUser(any());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("PUT /api/admin/users/{id} - when valid should return 200 OK")
    void updateUser_whenValid_shouldReturn200() throws Exception {
        UpdateUserRequest request = new UpdateUserRequest(
                "Nguyễn Mai Anh",
                "maianh_new@chickiestudio.vn",
                "0987654321",
                Role.ROLE_STAFF
        );

        when(userService.updateUser(eq(5L), any(UpdateUserRequest.class), eq("admin"))).thenReturn(sampleResponse);

        mockMvc.perform(put("/api/admin/users/5")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Cập nhật thông tin nhân viên thành công"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("PATCH /api/admin/users/{id}/status - when status is LOCKED should return 200 OK")
    void updateUserStatus_whenLocked_shouldReturn200() throws Exception {
        UpdateUserStatusRequest request = new UpdateUserStatusRequest(UserStatus.LOCKED);
        UserResponse lockedResponse = new UserResponse(
                5L, "maianh", "maianh@chickiestudio.vn", "Nguyễn Mai Anh",
                "0987654321", Role.ROLE_STAFF, UserStatus.LOCKED, LocalDateTime.now()
        );

        when(userService.updateUserStatus(eq(5L), any(UpdateUserStatusRequest.class), eq("admin")))
                .thenReturn(lockedResponse);

        mockMvc.perform(patch("/api/admin/users/5/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Khóa tài khoản thành công"))
                .andExpect(jsonPath("$.data.status").value("LOCKED"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("PATCH /api/admin/users/{id}/status - when status is ACTIVE should return 200 OK")
    void updateUserStatus_whenActive_shouldReturn200() throws Exception {
        UpdateUserStatusRequest request = new UpdateUserStatusRequest(UserStatus.ACTIVE);

        when(userService.updateUserStatus(eq(5L), any(UpdateUserStatusRequest.class), eq("admin")))
                .thenReturn(sampleResponse);

        mockMvc.perform(patch("/api/admin/users/5/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Mở khóa tài khoản thành công"))
                .andExpect(jsonPath("$.data.status").value("ACTIVE"));
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    @DisplayName("POST /api/admin/users/{id}/reset-password - when valid should return 200 OK")
    void resetPassword_whenValid_shouldReturn200() throws Exception {
        ResetPasswordRequest request = new ResetPasswordRequest("NewStrongPass@2026");

        doNothing().when(userService).resetPassword(eq(5L), any(ResetPasswordRequest.class));

        mockMvc.perform(post("/api/admin/users/5/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.message").value("Đặt lại mật khẩu thành công"));
    }
}
