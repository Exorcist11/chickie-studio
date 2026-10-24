# Quy Định Bắt Buộc Dành Cho AI Agents & Developers

Tài liệu này áp dụng cho toàn bộ dự án **Chickie Studio**. Mọi AI Agent hoặc lập trình viên khi nhận nhiệm vụ trong dự án **BẮT BUỘC** tuân thủ các chỉ dẫn dưới đây.

---

## 1. Quy Tắc Bắt Buộc Trước Khi Code (Mandatory Entrypoint)

> **PHẢI** xác định phân vùng làm việc và đọc toàn bộ tài liệu trong thư mục `.agent/` tương ứng trước khi đọc/viết code:

- Làm việc với Client (Next.js): đọc [client/.agent/README.md](file:///e:/chickie-studio/client/.agent/README.md)
- Làm việc với CRM (React Vite): đọc [crm/.agent/README.md](file:///e:/chickie-studio/crm/.agent/README.md)
- Làm việc với Server (Spring Boot): đọc [server/.agent/README.md](file:///e:/chickie-studio/server/.agent/README.md)
- Làm việc với Tài liệu (Docs/Specs): đọc [docs/.agent/README.md](file:///e:/chickie-studio/docs/.agent/README.md)

---

## 2. Chín Nguyên Tắc Cốt Lõi Toàn Dự Án

1. **Code Clean & Rõ Nghĩa**: Đặt tên chuẩn, hàm ngắn một trách nhiệm, không magic number/string, không dead code. Comment tiếng Việt chỉ dành cho nghiệp vụ phức tạp.
2. **Tái Sử Dụng Trước Khi Tạo Mới**: PHẢI tìm kiếm component, service, hàm tiện ích đã có trước khi viết mới. Nếu viết mới, PHẢI đặt đúng vị trí dùng chung quy định.
3. **Thư Viện UI Chuẩn shadcn/ui**: Toàn bộ dự án thống nhất dùng **shadcn/ui** làm thư viện UI tiêu chuẩn. Không tự viết lại component có sẵn; chỉ tạo wrapper component khi thực sự cần chuẩn hóa logic dùng chung. Chi tiết tại [docs/UI_UX_ENGINEERING_RULES.md](file:///e:/chickie-studio/docs/UI_UX_ENGINEERING_RULES.md).
4. **CẤM Tuyệt Đối Inline CSS & Quản Lý Qua File SCSS/CSS**: TUYỆT ĐỐI KHÔNG dùng `style={{ ... }}` trong JSX/HTML. Toàn bộ CSS tùy chỉnh phải viết trong file SCSS/CSS có phạm vi và cấu trúc rõ ràng hoặc class tiện ích Tailwind.
5. **Quy Trình Từng Tính Năng**: Phân tích → Code → Viết test tự động → Chạy test & kiểm tra coverage → Cập nhật docs → Commit. Chưa có test = CHƯA HOÀN THÀNH.
6. **Coverage Ngưỡng Tối Thiểu 80%**: Cả line và branch coverage cho code mới/sửa đổi và toàn project PHẢI đạt tối thiểu 80%. Build/CI sẽ fail nếu dưới 80%.
7. **Conventional Commits**: Commit rõ ràng theo định dạng `<type>(<scope>): <mô tả>`, mỗi commit là một đơn vị thay đổi logic độc lập. KHÔNG ĐƯỢC commit khi lint/test chưa pass.
8. **Bảo Mật & Cấu Hình**: KHÔNG ĐƯỢC hardcode secret, API key, token, URL, credential vào mã nguồn; PHẢI dùng biến môi trường.
9. **Sửa Bug Luôn Đi Kèm Test**: Bắt buộc viết test tự động tái hiện bug trước (test fail), sau đó sửa code để test pass (regression test).
