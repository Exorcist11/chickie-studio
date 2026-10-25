-- Migration V12: Create notification_logs table and add customer_email to bookings (SET-003 & BOK-001)
-- Description: Quản lý lịch sử thông báo email và lưu trữ email khách hàng khi đặt thuê

ALTER TABLE `bookings`
    ADD COLUMN `customer_email` VARCHAR(255) NULL AFTER `customer_phone`;

CREATE TABLE `notification_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `booking_id` BIGINT NULL,
    `recipient_email` VARCHAR(255) NOT NULL,
    `recipient_name` VARCHAR(100) NULL,
    `channel` VARCHAR(20) NOT NULL DEFAULT 'EMAIL',
    `template_type` VARCHAR(50) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'SENT',
    `provider_message_id` VARCHAR(100) NULL,
    `error_message` TEXT NULL,
    `sent_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_notif_booking` (`booking_id`),
    INDEX `idx_notif_email` (`recipient_email`),
    INDEX `idx_notif_type` (`template_type`),
    CONSTRAINT `fk_notification_logs_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
