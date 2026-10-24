# i18n Checklist - Quy Trình Thêm Key Ngôn Ngữ (Client)

Tài liệu kiểm tra nhanh khi thêm mới, sửa đổi hoặc xóa các chuỗi hiển thị đa ngôn ngữ trong Client.

---

## Các Bước Bắt Buộc Khi Thêm Key Mới

- [ ] **Bước 1 - Xác định Namespace**: Chọn đúng nhóm nghiệp vụ (`common`, `home`, `product`, `booking`, `errors`...). Không nhét toàn bộ vào `common`.
- [ ] **Bước 2 - Đặt tên Key**: Dùng camelCase, ngắn gọn, phản ánh đúng ngữ cảnh (ví dụ: `submitButton`, `emptyStateTitle`).
- [ ] **Bước 3 - Cập nhật Tiếng Việt**: Thêm key và nội dung vào `src/i18n/messages/vi.json`.
- [ ] **Bước 4 - Cập nhật Tiếng Anh**: Thêm key tương ứng với nghĩa chuẩn xác vào `src/i18n/messages/en.json`.
- [ ] **Bước 5 - Thay thế trong Component**: Gọi qua hook `useTranslations('<namespace>')`, **KHÔNG ĐƯỢC** để lại chuỗi hardcode thô.
- [ ] **Bước 6 - Xử lý Biến động (Interpolation)**: Dùng cú pháp `{variable}` nếu chuỗi có tham số động (ví dụ: `"Giá từ: {price} đ"`).
- [ ] **Bước 7 - Chạy Test Đồng Bộ**: Chạy test i18n để đảm bảo cả 2 file `vi.json` và `en.json` khớp nhau 100% về cấu trúc keys.

---

## Bảng Đối Soát Trực Quan

```json
// vi.json
{
  "product": {
    "sizeGuide": "Bảng hướng dẫn chọn size váy",
    "depositNote": "Tiền cọc giữ đồ: {deposit}đ"
  }
}

// en.json
{
  "product": {
    "sizeGuide": "Dress Size Guide",
    "depositNote": "Security deposit: {deposit}đ"
  }
}
```
