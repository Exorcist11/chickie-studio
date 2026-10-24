# 03 - Quy Trình Quản Lý Tiến Độ Tính Năng, CHANGELOG & ADR (Docs)

## 1. Quy Trình Cập Nhật Tiến Độ Tính Năng (`docs/FEATURES.md`)

- **KHI BẮT ĐẦU MỘT TÍNH NĂNG**:
  - **PHẢI** đổi trạng thái từ `⬜ TODO` / `📝 SPEC` sang `🚧 IN_PROGRESS` trong cả `docs/FEATURES.md` và file spec chi tiết `docs/features/...`.
  - **PHẢI** điền trường "Ngày bắt đầu" (YYYY-MM-DD) và tên "Người phụ trách".
  - **PHẢI** bổ sung tính năng vào mục **"2. Tính Năng Đang Thực Hiện & Tắc Nghẽn"** ở đầu file `docs/FEATURES.md`.
- **KHI HOÀN THÀNH TÍNH NĂNG**:
  - **CHỈ ĐƯỢC** chuyển sang `✅ DONE` khi thỏa mãn 100% **Definition of Done**:
    1. Code hoàn thành và tuân thủ Clean Code & architecture rules.
    2. Đã viết test tự động (Unit, Integration, UI).
    3. Độ phủ kiểm thử (Line & Branch Coverage) $\ge 80\%$.
    4. Toàn bộ lệnh kiểm tra chất lượng (lint, typecheck, test) pass không lỗi.
    5. Đa ngôn ngữ (i18n) đầy đủ cả `vi` và `en` (nếu có UI).
    6. Tài liệu đặc tả và API đã cập nhật đúng thực tế code.
  - **PHẢI** điền "Ngày hoàn thành" (YYYY-MM-DD).
  - **PHẢI** cập nhật lại số lượng trong **Bảng thống kê tiến độ tổng thể** của `docs/FEATURES.md`.
  - **PHẢI** ghi nhận nội dung thay đổi vào `CHANGELOG.md` dưới mục `[Unreleased]` (hoặc phiên bản release tương ứng).
  - **PHẢI** ghi lại vào bảng "Lịch sử cập nhật trạng thái" ở cuối file `docs/FEATURES.md`.

---

## 2. Quy Định Quản Lý Hồ Sơ Kiến Trúc (ADR)

- Mọi quyết định kỹ thuật cốt lõi (chọn thư viện, cơ chế xác thực, chiến lược lock concurrency, cổng thanh toán) **BẮT BUỘC** lập file ADR tại `docs/adr/NNNN-ten-quyet-dinh.md`.
- File ADR phải tuân thủ đúng cấu trúc chuẩn: Trạng thái, Ngày, Bối cảnh (Context), Quyết định (Decision) và Hệ quả (Consequences).
- Đăng ký file mới vào bảng danh mục trong `docs/adr/README.md`.
