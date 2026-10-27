package com.chickiestudio.user.service;

import com.chickiestudio.user.dto.CreateUserRequest;
import com.chickiestudio.user.dto.ResetPasswordRequest;
import com.chickiestudio.user.dto.UpdateUserRequest;
import com.chickiestudio.user.dto.UpdateUserStatusRequest;
import com.chickiestudio.user.dto.UserResponse;
import com.chickiestudio.user.entity.Role;
import com.chickiestudio.user.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {

    Page<UserResponse> getUsers(String search, Role role, UserStatus status, Pageable pageable);

    UserResponse getUserById(Long id);

    UserResponse createUser(CreateUserRequest request);

    UserResponse updateUser(Long id, UpdateUserRequest request, String currentUsername);

    UserResponse updateUserStatus(Long id, UpdateUserStatusRequest request, String currentUsername);

    void resetPassword(Long id, ResetPasswordRequest request);
}
