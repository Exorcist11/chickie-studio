package com.chickiestudio.user.service;

import com.chickiestudio.auth.repository.RefreshTokenRepository;
import com.chickiestudio.common.exception.BadRequestException;
import com.chickiestudio.common.exception.ConflictException;
import com.chickiestudio.common.exception.ResourceNotFoundException;
import com.chickiestudio.user.dto.CreateUserRequest;
import com.chickiestudio.user.dto.ResetPasswordRequest;
import com.chickiestudio.user.dto.UpdateUserRequest;
import com.chickiestudio.user.dto.UpdateUserStatusRequest;
import com.chickiestudio.user.dto.UserResponse;
import com.chickiestudio.user.entity.Role;
import com.chickiestudio.user.entity.User;
import com.chickiestudio.user.entity.UserStatus;
import com.chickiestudio.user.mapper.UserMapper;
import com.chickiestudio.user.repository.UserRepository;
import com.chickiestudio.user.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User sampleUser;
    private User rootAdmin;
    private UserResponse sampleResponse;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(2L)
                .username("maianh")
                .email("maianh@chickiestudio.vn")
                .fullName("Nguyễn Mai Anh")
                .phone("0987654321")
                .passwordHash("encoded_pwd")
                .role(Role.ROLE_STAFF)
                .status(UserStatus.ACTIVE)
                .failedAttempts(0)
                .build();

        rootAdmin = User.builder()
                .id(1L)
                .username("admin")
                .email("admin@chickiestudio.vn")
                .fullName("Quản Trị Viên")
                .phone("0900000000")
                .passwordHash("encoded_admin_pwd")
                .role(Role.ROLE_ADMIN)
                .status(UserStatus.ACTIVE)
                .failedAttempts(0)
                .build();

        sampleResponse = new UserResponse(
                2L,
                "maianh",
                "maianh@chickiestudio.vn",
                "Nguyễn Mai Anh",
                "0987654321",
                Role.ROLE_STAFF,
                UserStatus.ACTIVE,
                LocalDateTime.now()
        );
    }

    @Nested
    @DisplayName("Tests for getUsers")
    class GetUsersTests {
        @Test
        @DisplayName("getUsers_whenCalled_shouldReturnPageOfUserResponse")
        void getUsers_whenCalled_shouldReturnPageOfUserResponse() {
            Pageable pageable = PageRequest.of(0, 10);
            Page<User> page = new PageImpl<>(List.of(sampleUser), pageable, 1);

            when(userRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);
            when(userMapper.toResponse(sampleUser)).thenReturn(sampleResponse);

            Page<UserResponse> result = userService.getUsers("maianh", Role.ROLE_STAFF, UserStatus.ACTIVE, pageable);

            assertThat(result).isNotNull();
            assertThat(result.getContent()).hasSize(1);
            assertThat(result.getContent().get(0).username()).isEqualTo("maianh");
        }
    }

    @Nested
    @DisplayName("Tests for getUserById")
    class GetUserByIdTests {
        @Test
        @DisplayName("getUserById_whenExists_shouldReturnUserResponse")
        void getUserById_whenExists_shouldReturnUserResponse() {
            when(userRepository.findById(2L)).thenReturn(Optional.of(sampleUser));
            when(userMapper.toResponse(sampleUser)).thenReturn(sampleResponse);

            UserResponse result = userService.getUserById(2L);

            assertThat(result).isNotNull();
            assertThat(result.username()).isEqualTo("maianh");
        }

        @Test
        @DisplayName("getUserById_whenNotFound_shouldThrowResourceNotFoundException")
        void getUserById_whenNotFound_shouldThrowResourceNotFoundException() {
            when(userRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> userService.getUserById(99L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("99");
        }
    }

    @Nested
    @DisplayName("Tests for createUser")
    class CreateUserTests {
        @Test
        @DisplayName("createUser_whenValid_shouldSaveAndReturnResponse")
        void createUser_whenValid_shouldSaveAndReturnResponse() {
            CreateUserRequest request = new CreateUserRequest(
                    "maianh",
                    "Nguyễn Mai Anh",
                    "maianh@chickiestudio.vn",
                    "0987654321",
                    "Password@123",
                    Role.ROLE_STAFF
            );

            when(userRepository.existsByUsername("maianh")).thenReturn(false);
            when(userRepository.existsByEmail("maianh@chickiestudio.vn")).thenReturn(false);
            when(passwordEncoder.encode("Password@123")).thenReturn("encoded_pwd");
            when(userRepository.save(any(User.class))).thenReturn(sampleUser);
            when(userMapper.toResponse(sampleUser)).thenReturn(sampleResponse);

            UserResponse result = userService.createUser(request);

            assertThat(result).isNotNull();
            assertThat(result.username()).isEqualTo("maianh");
            verify(userRepository).save(any(User.class));
        }

        @Test
        @DisplayName("createUser_whenRoleNull_shouldDefaultToRoleStaff")
        void createUser_whenRoleNull_shouldDefaultToRoleStaff() {
            CreateUserRequest request = new CreateUserRequest(
                    "maianh",
                    "Nguyễn Mai Anh",
                    "maianh@chickiestudio.vn",
                    null,
                    "Password@123",
                    null
            );

            when(userRepository.existsByUsername("maianh")).thenReturn(false);
            when(userRepository.existsByEmail("maianh@chickiestudio.vn")).thenReturn(false);
            when(passwordEncoder.encode("Password@123")).thenReturn("encoded_pwd");
            when(userRepository.save(any(User.class))).thenReturn(sampleUser);
            when(userMapper.toResponse(sampleUser)).thenReturn(sampleResponse);

            UserResponse result = userService.createUser(request);

            assertThat(result).isNotNull();
            verify(userRepository).save(argThat(u -> u.getRole() == Role.ROLE_STAFF && u.getPhone() == null));
        }

        @Test
        @DisplayName("createUser_whenUsernameExists_shouldThrowConflictException")
        void createUser_whenUsernameExists_shouldThrowConflictException() {
            CreateUserRequest request = new CreateUserRequest(
                    "maianh",
                    "Nguyễn Mai Anh",
                    "maianh@chickiestudio.vn",
                    "0987654321",
                    "Password@123",
                    Role.ROLE_STAFF
            );

            when(userRepository.existsByUsername("maianh")).thenReturn(true);

            assertThatThrownBy(() -> userService.createUser(request))
                    .isInstanceOf(ConflictException.class)
                    .hasMessageContaining("Tên đăng nhập 'maianh' đã được sử dụng");

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("createUser_whenEmailExists_shouldThrowConflictException")
        void createUser_whenEmailExists_shouldThrowConflictException() {
            CreateUserRequest request = new CreateUserRequest(
                    "maianh",
                    "Nguyễn Mai Anh",
                    "maianh@chickiestudio.vn",
                    "0987654321",
                    "Password@123",
                    Role.ROLE_STAFF
            );

            when(userRepository.existsByUsername("maianh")).thenReturn(false);
            when(userRepository.existsByEmail("maianh@chickiestudio.vn")).thenReturn(true);

            assertThatThrownBy(() -> userService.createUser(request))
                    .isInstanceOf(ConflictException.class)
                    .hasMessageContaining("Email 'maianh@chickiestudio.vn' đã được sử dụng");

            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Tests for updateUser")
    class UpdateUserTests {
        @Test
        @DisplayName("updateUser_whenValid_shouldUpdateAndReturnResponse")
        void updateUser_whenValid_shouldUpdateAndReturnResponse() {
            UpdateUserRequest request = new UpdateUserRequest(
                    "Mai Anh Đã Đổi Tên",
                    "maianh_new@chickiestudio.vn",
                    "0912345678",
                    Role.ROLE_STAFF
            );

            when(userRepository.findById(2L)).thenReturn(Optional.of(sampleUser));
            when(userRepository.existsByEmailAndIdNot("maianh_new@chickiestudio.vn", 2L)).thenReturn(false);
            when(userRepository.save(any(User.class))).thenReturn(sampleUser);
            when(userMapper.toResponse(sampleUser)).thenReturn(sampleResponse);

            UserResponse result = userService.updateUser(2L, request, "admin");

            assertThat(result).isNotNull();
            verify(userRepository).save(sampleUser);
            assertThat(sampleUser.getFullName()).isEqualTo("Mai Anh Đã Đổi Tên");
            assertThat(sampleUser.getEmail()).isEqualTo("maianh_new@chickiestudio.vn");
            assertThat(sampleUser.getPhone()).isEqualTo("0912345678");
        }

        @Test
        @DisplayName("updateUser_whenEmailTakenByAnother_shouldThrowConflictException")
        void updateUser_whenEmailTakenByAnother_shouldThrowConflictException() {
            UpdateUserRequest request = new UpdateUserRequest(
                    "Mai Anh",
                    "taken@chickiestudio.vn",
                    "0912345678",
                    Role.ROLE_STAFF
            );

            when(userRepository.findById(2L)).thenReturn(Optional.of(sampleUser));
            when(userRepository.existsByEmailAndIdNot("taken@chickiestudio.vn", 2L)).thenReturn(true);

            assertThatThrownBy(() -> userService.updateUser(2L, request, "admin"))
                    .isInstanceOf(ConflictException.class)
                    .hasMessageContaining("Email 'taken@chickiestudio.vn' đã được sử dụng");
        }

        @Test
        @DisplayName("updateUser_whenRootAdminChangeRole_shouldThrowBadRequestException")
        void updateUser_whenRootAdminChangeRole_shouldThrowBadRequestException() {
            UpdateUserRequest request = new UpdateUserRequest(
                    "Quản Trị Viên",
                    "admin@chickiestudio.vn",
                    "0900000000",
                    Role.ROLE_STAFF
            );

            when(userRepository.findById(1L)).thenReturn(Optional.of(rootAdmin));
            when(userRepository.existsByEmailAndIdNot("admin@chickiestudio.vn", 1L)).thenReturn(false);

            assertThatThrownBy(() -> userService.updateUser(1L, request, "other_admin"))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Không thể thay đổi vai trò của tài khoản quản trị viên gốc");
        }

        @Test
        @DisplayName("updateUser_whenSelfChangeRole_shouldThrowBadRequestException")
        void updateUser_whenSelfChangeRole_shouldThrowBadRequestException() {
            User admin2 = User.builder()
                    .id(3L)
                    .username("admin2")
                    .role(Role.ROLE_ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();

            UpdateUserRequest request = new UpdateUserRequest(
                    "Admin 2",
                    "admin2@chickiestudio.vn",
                    "0900000002",
                    Role.ROLE_STAFF
            );

            when(userRepository.findById(3L)).thenReturn(Optional.of(admin2));
            when(userRepository.existsByEmailAndIdNot("admin2@chickiestudio.vn", 3L)).thenReturn(false);

            assertThatThrownBy(() -> userService.updateUser(3L, request, "admin2"))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Bạn không thể tự thay đổi vai trò của chính mình");
        }

        @Test
        @DisplayName("updateUser_whenDemoteLastAdmin_shouldThrowBadRequestException")
        void updateUser_whenDemoteLastAdmin_shouldThrowBadRequestException() {
            User adminUser = User.builder()
                    .id(3L)
                    .username("admin_temp")
                    .role(Role.ROLE_ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();

            UpdateUserRequest request = new UpdateUserRequest(
                    "Admin Temp",
                    "admintemp@chickiestudio.vn",
                    "0900000003",
                    Role.ROLE_STAFF
            );

            when(userRepository.findById(3L)).thenReturn(Optional.of(adminUser));
            when(userRepository.existsByEmailAndIdNot("admintemp@chickiestudio.vn", 3L)).thenReturn(false);
            when(userRepository.countByRoleAndStatus(Role.ROLE_ADMIN, UserStatus.ACTIVE)).thenReturn(1L);

            assertThatThrownBy(() -> userService.updateUser(3L, request, "admin_caller"))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Hệ thống phải duy trì ít nhất 1 tài khoản quản trị viên hoạt động");
        }
    }

    @Nested
    @DisplayName("Tests for updateUserStatus")
    class UpdateUserStatusTests {
        @Test
        @DisplayName("updateUserStatus_whenLocked_shouldRevokeTokensAndSetLocked")
        void updateUserStatus_whenLocked_shouldRevokeTokensAndSetLocked() {
            UpdateUserStatusRequest request = new UpdateUserStatusRequest(UserStatus.LOCKED);

            when(userRepository.findById(2L)).thenReturn(Optional.of(sampleUser));
            when(userRepository.save(any(User.class))).thenReturn(sampleUser);
            when(userMapper.toResponse(sampleUser)).thenReturn(sampleResponse);

            UserResponse result = userService.updateUserStatus(2L, request, "admin");

            assertThat(result).isNotNull();
            assertThat(sampleUser.getStatus()).isEqualTo(UserStatus.LOCKED);
            verify(refreshTokenRepository).revokeAllByUser(sampleUser);
            verify(userRepository).save(sampleUser);
        }

        @Test
        @DisplayName("updateUserStatus_whenActive_shouldResetFailedAttempts")
        void updateUserStatus_whenActive_shouldResetFailedAttempts() {
            sampleUser.setStatus(UserStatus.LOCKED);
            sampleUser.setFailedAttempts(5);
            UpdateUserStatusRequest request = new UpdateUserStatusRequest(UserStatus.ACTIVE);

            when(userRepository.findById(2L)).thenReturn(Optional.of(sampleUser));
            when(userRepository.save(any(User.class))).thenReturn(sampleUser);
            when(userMapper.toResponse(sampleUser)).thenReturn(sampleResponse);

            UserResponse result = userService.updateUserStatus(2L, request, "admin");

            assertThat(result).isNotNull();
            assertThat(sampleUser.getStatus()).isEqualTo(UserStatus.ACTIVE);
            assertThat(sampleUser.getFailedAttempts()).isEqualTo(0);
            verify(refreshTokenRepository, never()).revokeAllByUser(any());
        }

        @Test
        @DisplayName("updateUserStatus_whenSelfLock_shouldThrowBadRequestException")
        void updateUserStatus_whenSelfLock_shouldThrowBadRequestException() {
            UpdateUserStatusRequest request = new UpdateUserStatusRequest(UserStatus.LOCKED);
            when(userRepository.findById(2L)).thenReturn(Optional.of(sampleUser));

            assertThatThrownBy(() -> userService.updateUserStatus(2L, request, "maianh"))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Bạn không thể tự khóa tài khoản của chính mình");

            verify(refreshTokenRepository, never()).revokeAllByUser(any());
        }

        @Test
        @DisplayName("updateUserStatus_whenRootAdminLock_shouldThrowBadRequestException")
        void updateUserStatus_whenRootAdminLock_shouldThrowBadRequestException() {
            UpdateUserStatusRequest request = new UpdateUserStatusRequest(UserStatus.LOCKED);
            when(userRepository.findById(1L)).thenReturn(Optional.of(rootAdmin));

            assertThatThrownBy(() -> userService.updateUserStatus(1L, request, "other_admin"))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Không thể khóa tài khoản quản trị viên gốc");

            verify(refreshTokenRepository, never()).revokeAllByUser(any());
        }

        @Test
        @DisplayName("updateUserStatus_whenLastAdminLock_shouldThrowBadRequestException")
        void updateUserStatus_whenLastAdminLock_shouldThrowBadRequestException() {
            User admin2 = User.builder()
                    .id(4L)
                    .username("admin2")
                    .role(Role.ROLE_ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();

            UpdateUserStatusRequest request = new UpdateUserStatusRequest(UserStatus.LOCKED);
            when(userRepository.findById(4L)).thenReturn(Optional.of(admin2));
            when(userRepository.countByRoleAndStatus(Role.ROLE_ADMIN, UserStatus.ACTIVE)).thenReturn(1L);

            assertThatThrownBy(() -> userService.updateUserStatus(4L, request, "admin_master"))
                    .isInstanceOf(BadRequestException.class)
                    .hasMessageContaining("Hệ thống phải duy trì ít nhất 1 tài khoản quản trị viên hoạt động");

            verify(refreshTokenRepository, never()).revokeAllByUser(any());
        }
    }

    @Nested
    @DisplayName("Tests for resetPassword")
    class ResetPasswordTests {
        @Test
        @DisplayName("resetPassword_whenValid_shouldEncodePasswordResetFailedAttemptsAndRevokeTokens")
        void resetPassword_whenValid_shouldEncodePasswordResetFailedAttemptsAndRevokeTokens() {
            ResetPasswordRequest request = new ResetPasswordRequest("NewPass@2026");

            sampleUser.setFailedAttempts(4);
            when(userRepository.findById(2L)).thenReturn(Optional.of(sampleUser));
            when(passwordEncoder.encode("NewPass@2026")).thenReturn("encoded_new_pwd");

            userService.resetPassword(2L, request);

            assertThat(sampleUser.getPasswordHash()).isEqualTo("encoded_new_pwd");
            assertThat(sampleUser.getFailedAttempts()).isEqualTo(0);
            verify(refreshTokenRepository).revokeAllByUser(sampleUser);
            verify(userRepository).save(sampleUser);
        }

        @Test
        @DisplayName("resetPassword_whenNotFound_shouldThrowResourceNotFoundException")
        void resetPassword_whenNotFound_shouldThrowResourceNotFoundException() {
            ResetPasswordRequest request = new ResetPasswordRequest("NewPass@2026");
            when(userRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> userService.resetPassword(99L, request))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("99");

            verify(refreshTokenRepository, never()).revokeAllByUser(any());
        }
    }
}
