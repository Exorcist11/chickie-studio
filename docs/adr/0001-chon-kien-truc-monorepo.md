# ADR 0001: Lựa Chọn Kiến Trúc Monorepo Cho Chickie Studio

- **Trạng thái**: Đã chấp thuận (`Accepted`)
- **Ngày**: 2026-10-24
- **Tác giả**: Tech Lead

---

## 1. Bối Cảnh (Context)
Dự án **Chickie Studio** bao gồm 3 ứng dụng phục vụ các đối tượng khác nhau:
1. `client`: Website khách hàng (Next.js, SSR, tối ưu SEO, mobile-first).
2. `crm`: Hệ thống quản trị nội bộ cửa hàng (React, Vite, Ant Design, nghiệp vụ nặng, SPA).
3. `server`: Backend REST API (Java 21, Spring Boot 3, MySQL 8).

Cần lựa chọn mô hình tổ chức mã nguồn: Tách thành 3 git repositories độc lập (Multi-repo) hay gom chung vào 1 git repository duy nhất (Monorepo).

---

## 2. Quyết Định (Decision)
Quyết định áp dụng mô hình **Monorepo** trong cùng một git repository:
```text
chickie-studio/
├── client/   # Ứng dụng Next.js
├── crm/      # Ứng dụng React Vite
├── server/   # Ứng dụng Java Spring Boot
└── docs/     # Tài liệu và thông số kỹ thuật dùng chung
```

**Lý do lựa chọn**:
1. **Đồng bộ hóa phiên bản & tính năng**: Mỗi tính năng nghiệp vụ (ví dụ: `BOK-001` đặt thuê) đều liên quan đến cả 3 phần (Client gửi đơn, Server xử lý, CRM duyệt đơn). Monorepo cho phép quản lý tiến độ, PR, commit và tài liệu hóa tính năng tập trung tại một nơi (`docs/FEATURES.md`).
2. **Quy chuẩn chất lượng thống nhất**: AI Agent và lập trình viên dễ dàng đối chiếu tài liệu và hợp đồng API (DTO/JSON) giữa Frontend và Backend mà không phải chuyển đổi repository.
3. **Đơn giản hóa CI/CD & Triển khai**: Dễ dàng cấu hình Docker Compose khởi chạy toàn bộ hệ thống cục bộ chỉ với một câu lệnh.

---

## 3. Hệ Quả (Consequences)

### Tích cực
- Không bị lệch pha tài liệu giữa Frontend và Backend.
- Tiện lợi cho đội ngũ nhỏ (1-3 devs hoặc làm việc cùng AI Agent).
- Quản lý issue, commit và changelog tập trung, minh bạch.

### Tiêu cực & Biện pháp giảm thiểu
- Kích thước repository có thể tăng theo thời gian $\rightarrow$ **Biện pháp**: Sử dụng `.gitignore` triệt để, cấm lưu trữ ảnh/video/nhị phân vào git; tài liệu dùng sơ đồ Mermaid thay vì ảnh chụp màn hình.
- CI/CD build có thể bị kích hoạt thừa $\rightarrow$ **Biện pháp**: Cấu hình path-filter trong GitHub Actions / GitLab CI (chỉ build thư mục có thay đổi mã nguồn).
