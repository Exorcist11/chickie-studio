# Nhật Ký Thay Đổi Primitives (CHANGES.md)

Tài liệu ghi lại toàn bộ các chỉnh sửa trực tiếp vào mã nguồn trong `packages/ui/src/primitives/` (nếu có).

> **Nguyên tắc**: Hạn chế tối đa việc chỉnh sửa trực tiếp file trong primitives. Mọi tuỳ biến phải thực hiện tại Design Tokens (`shadcn-theme.css`) hoặc tại lớp `base`.
> Nếu bắt buộc sửa, PHẢI ghi rõ:
> - Tên file
> - Ngày thay đổi
> - Lý do kỹ thuật
> - Nội dung thay đổi (diff tóm tắt)
> Điều này đảm bảo khi chạy lại `npx shadcn@latest add <component> --overwrite`, chúng ta có thể áp dụng lại các chỉnh sửa đặc thù một cách an toàn.

---

## Danh Sách Thay Đổi

*Hiện tại: Chưa có chỉnh sửa nào trên primitives (Primitives giữ nguyên gốc chuẩn shadcn/Radix).*
