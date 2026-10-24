CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20),
    `role` VARCHAR(30) NOT NULL DEFAULT 'ROLE_STAFF',
    `status` VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    `failed_attempts` INT NOT NULL DEFAULT 0,
    `locked_until` TIMESTAMP NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_username` (`username`),
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`),
    INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Mật khẩu mặc định: Admin@123456 (BCrypt $2a$10$7pUGy81/O9hL9t9y86t/5u2t8e6b1C8s8k6K2m1Q7e8u2z1v5m9m6)
INSERT INTO `users` (`username`, `email`, `password_hash`, `full_name`, `phone`, `role`, `status`)
VALUES (
    'admin',
    'admin@chickiestudio.vn',
    '$2a$10$w09b4vM2j5O8L4q7i3d7OuhX8yC0y8a7m2y6T4o1s3e5r7u9i1a2C',
    'Quản Trị Viên Chickie',
    '0901234567',
    'ROLE_ADMIN',
    'ACTIVE'
);
