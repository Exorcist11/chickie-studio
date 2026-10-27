package com.chickiestudio.user.dto;

import com.chickiestudio.user.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateUserRequest(
    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Pattern(regexp = "^[a-zA-Z0-9_]{3,50}$", message = "Tên đăng nhập phải từ 3 đến 50 ký tự, chỉ chứa chữ cái, số và dấu gạch dưới")
    String username,

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(max = 100, message = "Họ và tên tối đa 100 ký tự")
    String fullName,

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    @Size(max = 100, message = "Email tối đa 100 ký tự")
    String email,

    @Pattern(regexp = "^$|^(\\+?84|0)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$", message = "Số điện thoại không đúng định dạng di động Việt Nam")
    String phone,

    @NotBlank(message = "Mật khẩu không được để trống")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$", message = "Mật khẩu phải tối thiểu 8 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 chữ số")
    String password,

    Role role
) {}
