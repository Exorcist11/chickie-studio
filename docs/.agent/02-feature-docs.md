# 02 - Mẫu Tài Liệu Đặc Tả Tính Năng (Docs)

## 1. Quy Định Bắt Buộc

- Khi hoàn thành một tính năng, **PHẢI** tạo hoặc cập nhật tài liệu tương ứng tại thư mục `docs/features/`.
- Tài liệu tính năng **BẮT BUỘC** bao gồm đủ 4 phần:
  1. **Tổng quan nghiệp vụ**: Mục tiêu, đối tượng sử dụng, quy tắc kinh doanh (Business rules).
  2. **Luồng xử lý**: Luồng thành công chính (Happy path) và các nhánh lỗi ngoại lệ (Exceptions).
  3. **Đặc tả API**: Endpoint, HTTP method, Header, Request DTO, Response DTO, mã lỗi trả về.
  4. **Cơ sở dữ liệu**: Tên bảng ảnh hưởng, cột thêm mới, index và tên file Flyway migration.

---

## 2. Mẫu Đặc Tả Chuẩn (Template)

```markdown
# [Tên Tính Năng - Ví dụ: Đặt Thuê Combo Máy Ảnh & Váy]

## 1. Nghiệp Vụ
- **Mục tiêu**: Cho phép khách hàng đặt thuê trọn gói gồm váy và máy ảnh trong cùng ngày.
- **Quy tắc**:
  - Tiền cọc bằng 50% tổng giá trị đơn thuê.
  - Mỗi máy ảnh chỉ cho thuê tối đa 3 ngày liên tiếp.

## 2. Đặc Tả API
- **Endpoint**: `POST /api/public/bookings`
- **Request Body**:
```json
{
  "customerId": 10,
  "rentalDate": "2026-11-01",
  "itemIds": [101, 205]
}
```
- **Response Success (201 Created)**:
```json
{
  "code": 201,
  "message": "SUCCESS",
  "data": { "bookingCode": "BK20261101-001", "totalAmount": 1500000.0 }
}
```
- **Error Codes**: `400 BAD_REQUEST`, `404 NOT_FOUND`, `409 BOOKING_CONFLICT`.

## 3. Cập Nhật Cơ Sở Dữ Liệu
- File Migration: `V3__add_combo_items_table.sql`
- Bảng mới: `booking_combo_items`, đánh index tại cột `booking_id`.
```
