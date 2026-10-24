# CRM Rules - Chickie Studio (React + Vite + shadcn/ui)

## ĐỌC TRƯỚC KHI LÀM (5 DÒNG TÓM TẮT)
1. **PHẢI** đọc toàn bộ tài liệu trong thư mục này trước khi phát triển bất kỳ tính năng quản trị nào.
2. **PHẢI** tái sử dụng các component chuẩn tại `src/components/common` (`DataTable`, `ConfirmModal`, `FormField`); cấm copy-paste UI giữa các trang.
3. **PHẢI** quản lý server state bằng **TanStack Query**, query key tập trung, gọi API duy nhất qua `src/services`.
4. **KHÔNG ĐƯỢC** hardcode text, thông báo hay tiêu đề cột; **PHẢI** dùng `react-i18next` đủ cả `vi.json` và `en.json`.
5. **PHẢI** viết test Vitest + RTL + MSW đạt tối thiểu 80% coverage; chạy lint và test pass mới được commit.

---

## Mục Lục Các File Rule

| File | Tóm tắt nội dung |
|---|---|
| [01-clean-code.md](file:///e:/chickie-studio/crm/.agent/01-clean-code.md) | TypeScript strict, cấm `any`, validate form bằng Zod, chuẩn đặt tên và tổ chức state. |
| [02-structure-reuse.md](file:///e:/chickie-studio/crm/.agent/02-structure-reuse.md) | Cấu trúc thư mục, quy tắc tái sử dụng `DataTable`, `ConfirmModal`, `FilterBar`. |
| [03-react-vite.md](file:///e:/chickie-studio/crm/.agent/03-react-vite.md) | Quy chuẩn TanStack Query, tầng `services/` (Axios interceptor), Route Guard phân quyền. |
| [04-i18n.md](file:///e:/chickie-studio/crm/.agent/04-i18n.md) | Quản lý đa ngôn ngữ với `react-i18next`, dịch cột bảng, validate message và alert. |
| [05-testing.md](file:///e:/chickie-studio/crm/.agent/05-testing.md) | Test Vitest + RTL cho page, common component, hooks và mock API với MSW (>=80% coverage). |
| [06-workflow.md](file:///e:/chickie-studio/crm/.agent/06-workflow.md) | Quy trình thêm màn hình quản trị, kiểm tra chất lượng trước commit và DoD. |
| [07-ui-ux-shadcn.md](file:///e:/chickie-studio/crm/.agent/07-ui-ux-shadcn.md) | Định hướng shadcn/ui, TUYỆT ĐỐI CẤM inline CSS, quản lý CSS bằng SCSS. |
| [07-ui-library.md](file:///e:/chickie-studio/crm/.agent/07-ui-library.md) | Phân tầng 3 cấp component (ui/common/features), tích hợp TanStack Table & Zod. |

---

## Definition of Done (DoD) Cho CRM

Mỗi màn hình, component hay service mới chỉ hoàn thành khi:
- [ ] Tuân thủ TypeScript strict, tuyệt đối không có `any`, form dùng Zod schema.
- [ ] TUYỆT ĐỐI CẤM inline CSS (`style={{ ... }}`); mọi style phải nằm trong file SCSS/CSS.
- [ ] Đã tái sử dụng `DataTable`, `ConfirmModal`, `FormField` từ `src/components/common`.
- [ ] Mọi API call qua `src/services`, quản lý cache bằng TanStack Query với hook riêng.
- [ ] Phân quyền bảo vệ bằng Route Guard hoặc component kiểm tra quyền tập trung.
- [ ] Toàn bộ text, tiêu đề cột bảng, thông báo validate nằm trong cả `vi.json` và `en.json`.
- [ ] Đã viết unit/integration test, coverage tối thiểu **80% line và branch**.
- [ ] Vượt qua toàn bộ lệnh: `npm run lint`, `npm run typecheck`, `npm run test`.
