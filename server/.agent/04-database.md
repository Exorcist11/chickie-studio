# 04 - Quy Ước Cơ Sở Dữ Liệu & Flyway Migration (Server)

## 1. Quy Định Bắt Buộc

- **PHẢI** quản lý 100% thay đổi cấu trúc bảng qua **Flyway Migration** tại thư mục `src/main/resources/db/migration/`.
- Định dạng tên file: `V{version}__{mo_ta_ngan_gon}.sql` (ví dụ: `V1__init_schema.sql`, `V2__add_booking_indexes.sql`).
- **TUYỆT ĐỐI CẤM** sửa đổi nội dung các file migration đã commit và đã chạy; khi cần sửa **PHẢI** tạo version migration mới.
- **TUYỆT ĐỐI CẤM** dùng `spring.jpa.hibernate.ddl-auto=update` hay `create-drop`; chỉ được dùng `validate` hoặc `none`.
- **Charset & Collation**: Mọi bảng **PHẢI** dùng `CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`.
- **Quy ước đặt tên**:
  - Bảng: chữ thường, số nhiều, snake_case (ví dụ: `products`, `booking_items`, `customers`).
  - Cột: chữ thường, snake_case (ví dụ: `rental_price`, `start_date`, `created_at`).
  - Khóa ngoại: có hậu tố `_id` (ví dụ: `customer_id`, `combo_id`).
- **PHẢI** đánh Index cho các khóa ngoại, cột trạng thái, cột ngày tháng hay lọc tìm kiếm.

---

## 2. Ví Dụ Cụ Thể

### File Flyway Migration Chuẩn
```sql
-- ❌ SAI: Không chỉ định charset, tên bảng lung tung, thiếu index khóa ngoại
CREATE TABLE Product (
    ID int,
    Name varchar(255)
);

-- ✅ ĐÚNG: Cú pháp chuẩn V2__create_bookings_table.sql
CREATE TABLE `bookings` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `booking_code` VARCHAR(32) NOT NULL UNIQUE,
    `customer_id` BIGINT NOT NULL,
    `rental_date` DATE NOT NULL,
    `return_date` DATE NOT NULL,
    `total_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `deposit_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `status` VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_bookings_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
    INDEX `idx_bookings_rental_date` (`rental_date`),
    INDEX `idx_bookings_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```
