CREATE TABLE `categories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(120) NOT NULL UNIQUE,
    `description` TEXT,
    `icon_url` VARCHAR(255),
    `display_order` INT NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_categories_slug` (`slug`),
    INDEX `idx_categories_order` (`display_order`),
    INDEX `idx_categories_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dữ liệu mẫu danh mục khởi tạo
INSERT INTO `categories` (`name`, `slug`, `description`, `icon_url`, `display_order`, `is_active`)
VALUES
    ('Váy Thiết Kế', 'vay-thiet-ke', 'Bộ sưu tập váy thiết kế cao cấp cho chụp ảnh ngoại cảnh, kỷ yếu', 'Sparkles', 1, TRUE),
    ('Áo Dài Truyền Thống & Cách Tân', 'ao-dai', 'Áo dài thêu tay, áo dài cách tân lễ tết và sự kiện', 'Flower2', 2, TRUE),
    ('Đầm Dạ Hội & Tiệc', 'dam-da-hoi', 'Đầm dạ hội lộng lẫy, sang trọng cho sự kiện và tiệc tối', 'Crown', 3, TRUE),
    ('Máy Ảnh Du Lịch & Phụ Kiện', 'may-anh-du-lich', 'Máy ảnh Sony, Fujifilm, Canon kèm lens chụp ảnh sắc nét', 'Camera', 4, TRUE),
    ('Phụ Kiện Chụp Ảnh', 'phu-kien', 'Túi xách, nón cói, hoa lụa, phụ kiện phối đồ ấn tượng', 'ShoppingBag', 5, TRUE);
