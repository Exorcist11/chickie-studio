package com.chickiestudio.user.service.impl;

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
import com.chickiestudio.user.repository.UserSpecification;
import com.chickiestudio.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private static final String ROOT_ADMIN_USERNAME = "admin";

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<UserResponse> getUsers(String search, Role role, UserStatus status, Pageable pageable) {
        Specification<User> spec = UserSpecification.filterUsers(search, role, status);
        return userRepository.findAll(spec, pageable).map(userMapper::toResponse);
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = findUserByIdOrThrow(id);
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        String username = request.username().trim().toLowerCase();
        String email = request.email().trim().toLowerCase();

        if (userRepository.existsByUsername(username)) {
            throw new ConflictException("Tên đăng nhập '" + username + "' đã được sử dụng");
        }

        if (userRepository.existsByEmail(email)) {
            throw new ConflictException("Email '" + email + "' đã được sử dụng");
        }

        String phone = normalizePhone(request.phone());
        Role role = request.role() != null ? request.role() : Role.ROLE_STAFF;

        User user = User.builder()
                .username(username)
                .email(email)
                .fullName(request.fullName().trim())
                .phone(phone)
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(role)
                .status(UserStatus.ACTIVE)
                .failedAttempts(0)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Created new user successfully. ID: {}, username: {}, role: {}", savedUser.getId(), username, role);
        return userMapper.toResponse(savedUser);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request, String currentUsername) {
        User user = findUserByIdOrThrow(id);
        String newEmail = request.email().trim().toLowerCase();

        if (userRepository.existsByEmailAndIdNot(newEmail, id)) {
            throw new ConflictException("Email '" + newEmail + "' đã được sử dụng bởi tài khoản khác");
        }

        if (request.role() != null && request.role() != user.getRole()) {
            validateRoleChange(user, request.role(), currentUsername);
            user.setRole(request.role());
        }

        user.setFullName(request.fullName().trim());
        user.setEmail(newEmail);
        user.setPhone(normalizePhone(request.phone()));

        User updatedUser = userRepository.save(user);
        log.info("Updated user successfully. ID: {}, username: {}, role: {}", id, user.getUsername(), user.getRole());
        return userMapper.toResponse(updatedUser);
    }

    @Override
    @Transactional
    public UserResponse updateUserStatus(Long id, UpdateUserStatusRequest request, String currentUsername) {
        User user = findUserByIdOrThrow(id);
        UserStatus targetStatus = request.status();

        if (targetStatus == UserStatus.LOCKED) {
            validateLockUser(user, currentUsername);
            refreshTokenRepository.revokeAllByUser(user);
            log.info("Revoked all active refresh tokens for locked user ID: {}", id);
        } else if (targetStatus == UserStatus.ACTIVE) {
            user.resetFailedAttempts();
        }

        user.setStatus(targetStatus);
        User savedUser = userRepository.save(user);
        log.info("Updated status for user ID: {}, username: {} to {}", id, user.getUsername(), targetStatus);
        return userMapper.toResponse(savedUser);
    }

    @Override
    @Transactional
    public void resetPassword(Long id, ResetPasswordRequest request) {
        User user = findUserByIdOrThrow(id);

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.resetFailedAttempts();
        userRepository.save(user);

        refreshTokenRepository.revokeAllByUser(user);
        log.info("Reset password and revoked refresh tokens for user ID: {}", id);
    }

    private User findUserByIdOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy nhân viên với ID: " + id));
    }

    private void validateRoleChange(User user, Role targetRole, String currentUsername) {
        if (ROOT_ADMIN_USERNAME.equalsIgnoreCase(user.getUsername())) {
            throw new BadRequestException("Không thể thay đổi vai trò của tài khoản quản trị viên gốc");
        }

        if (user.getUsername().equalsIgnoreCase(currentUsername)) {
            throw new BadRequestException("Bạn không thể tự thay đổi vai trò của chính mình");
        }

        if (user.getRole() == Role.ROLE_ADMIN && targetRole == Role.ROLE_STAFF && user.getStatus() == UserStatus.ACTIVE) {
            long activeAdminCount = userRepository.countByRoleAndStatus(Role.ROLE_ADMIN, UserStatus.ACTIVE);
            if (activeAdminCount <= 1) {
                throw new BadRequestException("Hệ thống phải duy trì ít nhất 1 tài khoản quản trị viên hoạt động");
            }
        }
    }

    private void validateLockUser(User user, String currentUsername) {
        if (user.getUsername().equalsIgnoreCase(currentUsername)) {
            throw new BadRequestException("Bạn không thể tự khóa tài khoản của chính mình");
        }

        if (ROOT_ADMIN_USERNAME.equalsIgnoreCase(user.getUsername())) {
            throw new BadRequestException("Không thể khóa tài khoản quản trị viên gốc của hệ thống");
        }

        if (user.getRole() == Role.ROLE_ADMIN) {
            long activeAdminCount = userRepository.countByRoleAndStatus(Role.ROLE_ADMIN, UserStatus.ACTIVE);
            if (activeAdminCount <= 1) {
                throw new BadRequestException("Hệ thống phải duy trì ít nhất 1 tài khoản quản trị viên hoạt động");
            }
        }
    }

    private String normalizePhone(String rawPhone) {
        if (rawPhone == null || rawPhone.trim().isEmpty()) {
            return null;
        }
        return rawPhone.trim();
    }
}
