-- Migration V8: Create bookings and booking_items tables (CAT-006 & BOK-001/002)
-- Description: Quản lý đơn đặt thuê đồ và tính toán kiểm tra lịch trống an toàn

CREATE TABLE `bookings` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `booking_code` VARCHAR(50) NOT NULL UNIQUE,
    `customer_name` VARCHAR(100) NOT NULL,
    `customer_phone` VARCHAR(20) NOT NULL,
    `delivery_method` VARCHAR(30) NOT NULL DEFAULT 'PICKUP_STORE',
    `delivery_address` VARCHAR(255),
    `rental_start_date` DATE NOT NULL,
    `rental_end_date` DATE NOT NULL,
    `status` VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    `total_rental_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `total_deposit_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `note` VARCHAR(500),
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_bookings_code` (`booking_code`),
    INDEX `idx_bookings_phone` (`customer_phone`),
    INDEX `idx_bookings_status` (`status`),
    INDEX `idx_bookings_dates` (`rental_start_date`, `rental_end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `booking_items` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `booking_id` BIGINT NOT NULL,
    `product_item_id` BIGINT NOT NULL,
    `variant_id` BIGINT NOT NULL,
    `rental_start_date` DATE NOT NULL,
    `rental_end_date` DATE NOT NULL,
    `rental_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `deposit_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_booking_items_booking` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_booking_items_item` FOREIGN KEY (`product_item_id`) REFERENCES `product_items` (`id`),
    CONSTRAINT `fk_booking_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`),
    INDEX `idx_booking_items_dates` (`product_item_id`, `rental_start_date`, `rental_end_date`),
    INDEX `idx_booking_items_variant` (`variant_id`, `rental_start_date`, `rental_end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
