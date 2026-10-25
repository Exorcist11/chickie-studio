-- Migration V7: Create product_items table for CAT-003
-- Description: Quản lý từng món đồ thực tế (Item Instance) và vòng đời trạng thái

CREATE TABLE `product_items` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `variant_id` BIGINT NOT NULL,
    `item_code` VARCHAR(50) NOT NULL UNIQUE,
    `status` VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE',
    `rental_count` INT NOT NULL DEFAULT 0,
    `note` VARCHAR(255),
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_items_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
    INDEX `idx_items_variant` (`variant_id`),
    INDEX `idx_items_code` (`item_code`),
    INDEX `idx_items_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dữ liệu mẫu ban đầu cho các biến thể hiện có
INSERT INTO `product_items` (`variant_id`, `item_code`, `status`, `rental_count`, `note`)
SELECT pv.id, CONCAT(pv.sku, '-01'), 'AVAILABLE', 3, 'Sẵn sàng tại Studio Chickie'
FROM `product_variants` pv
WHERE pv.sku IN ('VAY-DAHOI-01-S-RED', 'CAM-SONY-A6400-KIT-BLACK', 'PHOTO-NGOAICANH-01-COMBO-ALL')
ON DUPLICATE KEY UPDATE `item_code` = VALUES(`item_code`);

INSERT INTO `product_items` (`variant_id`, `item_code`, `status`, `rental_count`, `note`)
SELECT pv.id, CONCAT(pv.sku, '-02'), 'LAUNDRY', 6, 'Gửi giặt hấp tiệt trùng sau khi khách hoàn trả'
FROM `product_variants` pv
WHERE pv.sku = 'VAY-DAHOI-01-S-RED'
ON DUPLICATE KEY UPDATE `item_code` = VALUES(`item_code`);
