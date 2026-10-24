-- Migration V6: Thêm phân loại mảng kinh doanh (type) cho categories và dữ liệu mẫu máy ảnh & dịch vụ chụp ảnh
-- Hỗ trợ 3 mảng kinh doanh cốt lõi: COSTUME (Thuê trang phục), CAMERA (Thuê máy ảnh), PHOTOGRAPHY (Dịch vụ chụp ảnh)

ALTER TABLE `categories`
ADD COLUMN `type` VARCHAR(30) NOT NULL DEFAULT 'COSTUME' AFTER `slug`;

CREATE INDEX `idx_categories_type` ON `categories` (`type`);

-- Cập nhật type cho các danh mục hiện tại
UPDATE `categories` SET `type` = 'COSTUME' WHERE `slug` IN ('vay-thiet-ke', 'ao-dai', 'dam-da-hoi', 'phu-kien');
UPDATE `categories` SET `type` = 'CAMERA' WHERE `slug` = 'may-anh-du-lich';

-- Thêm các danh mục cho mảng Dịch vụ chụp ảnh (PHOTOGRAPHY)
INSERT INTO `categories` (`name`, `slug`, `type`, `description`, `icon_url`, `display_order`, `is_active`)
VALUES
    ('Gói Chụp Ngoại Cảnh & Kỷ Yếu', 'chup-anh-ngoai-canh', 'PHOTOGRAPHY', 'Gói chụp ảnh ngoại cảnh, kỷ yếu thanh xuân, du lịch với nhiếp ảnh gia chuyên nghiệp', 'Camera', 6, TRUE),
    ('Gói Chụp Concept Studio & Lookbook', 'chup-anh-studio', 'PHOTOGRAPHY', 'Gói chụp studio ánh sáng nghệ thuật, lookbook cá nhân, kỷ niệm sinh nhật', 'Sparkles', 7, TRUE)
ON DUPLICATE KEY UPDATE `type` = VALUES(`type`), `description` = VALUES(`description`);
