# Architecture Decision Records (ADR) - Chickie Studio

Thư mục này ghi nhận toàn bộ các quyết định kiến trúc quan trọng (Architecture Decision Records) của dự án **Chickie Studio**.

---

## 1. Mục Đích Của ADR
- Ghi lại lý do tại sao một quyết định kỹ thuật được đưa ra (bối cảnh, các giải pháp thay thế, ưu/nhược điểm).
- Giúp các thành viên mới hoặc AI Agent sau này hiểu rõ nguyên nhân kiến trúc, tránh việc đảo ngược quyết định mà không nắm rõ hệ quả.

---

## 2. Quy Tắc Đặt Tên & Đánh Số
- Đặt tên theo mẫu: `NNNN-ten-quyet-dinh-ngan-gon.md`
- Đánh số tăng dần từ `0001`, `0002`, `0003`...
- Trạng thái hợp lệ của ADR:
  - `Proposed` (Đang đề xuất)
  - `Accepted` (Đã chấp thuận)
  - `Deprecated` (Không còn dùng)
  - `Superseded` (Bị thay thế bởi ADR số khác)

---

## 3. Cấu Trúc Một File ADR Chuẩn

```markdown
# ADR NNNN: [Tiêu Đề Quyết Định Ngắn Gọn]

- **Trạng thái**: [Proposed | Accepted | Deprecated | Superseded]
- **Ngày**: YYYY-MM-DD
- **Tác giả**: [Tên / Role]
- **Người tham gia duyệt**: [Team / Tech Lead]

## 1. Bối Cảnh (Context)
[Vấn đề kỹ thuật hoặc bài toán nghiệp vụ cần giải quyết là gì? Những ràng buộc hiện tại?]

## 2. Quyết Định (Decision)
[Giải pháp kỹ thuật được lựa chọn là gì? Lý do chọn giải pháp này thay vì các giải pháp khác?]

## 3. Hệ Quả (Consequences)
- **Tích cực**: [Lợi ích mang lại về hiệu năng, bảo mật, thời gian phát triển...]
- **Tiêu cực / Đánh đổi**: [Những phức tạp phát sinh, chi phí vận hành cần lưu ý...]
```

---

## 4. Danh Sách Các ADR Hiện Có
| Số hiệu | Tiêu đề | Trạng thái | Ngày |
|---|---|---|---|
| [ADR-0001](0001-chon-kien-truc-monorepo.md) | Chọn kiến trúc Monorepo cho Client, CRM và Server | `Accepted` | 2026-10-24 |
