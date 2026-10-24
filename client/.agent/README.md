# Client Rules - Chickie Studio (Next.js)

## ĐỌC TRƯỚC KHI LÀM (5 DÒNG TÓM TẮT)
1. **PHẢI** đọc toàn bộ tài liệu trong thư mục này trước khi viết bất kỳ dòng code nào.
2. **PHẢI** ưu tiên Server Component, chỉ dùng `"use client"` ở component lá cần tương tác/state.
3. **KHÔNG ĐƯỢC** hardcode bất kỳ chuỗi văn bản nào trong JSX; **PHẢI** dùng `next-intl` (đủ cả `vi.json` và `en.json`).
4. **PHẢI** kiểm tra thư viện `src/components/ui` để tái sử dụng component trước khi tạo mới.
5. **PHẢI** viết test Vitest + RTL đạt tối thiểu 80% coverage; viết UI test Playwright cho luồng chính; chạy lint và test pass mới được commit.

---

## Mục Lục Các File Rule

| File | Tóm tắt nội dung |
|---|---|
| [01-clean-code.md](file:///e:/chickie-studio/client/.agent/01-clean-code.md) | TypeScript strict, cấm `any`, chuẩn đặt tên, tách hook, một file một component. |
| [02-structure-reuse.md](file:///e:/chickie-studio/client/.agent/02-structure-reuse.md) | Cấu trúc thư mục `src/`, phân biệt `ui` vs `features`, design token Tailwind. |
| [03-nextjs.md](file:///e:/chickie-studio/client/.agent/03-nextjs.md) | Quy tắc App Router, Server/Client Component, tầng `lib/api`, tối ưu SEO & Image. |
| [04-i18n.md](file:///e:/chickie-studio/client/.agent/04-i18n.md) | Chuẩn đa ngôn ngữ `next-intl`, cấu trúc namespace, đồng bộ key `vi.json`/`en.json`. |
| [05-testing.md](file:///e:/chickie-studio/client/.agent/05-testing.md) | Quy chuẩn Vitest + RTL (>=80% coverage) và UI/E2E test với Playwright trong `e2e/`. |
| [06-workflow.md](file:///e:/chickie-studio/client/.agent/06-workflow.md) | Quy trình triển khai tính năng, lệnh kiểm tra (lint/typecheck/test/test:e2e), commit chuẩn. |
| [07-ui-ux-shadcn.md](file:///e:/chickie-studio/client/.agent/07-ui-ux-shadcn.md) | Quy chuẩn shadcn/ui, CẤM inline CSS, quản lý CSS bằng SCSS/Tailwind tokens. |
| [07-ui-library.md](file:///e:/chickie-studio/client/.agent/07-ui-library.md) | Phân tầng 3 cấp component (ui/common/features), quy định coverage, đổi theme. |
| [i18n-checklist.md](file:///e:/chickie-studio/client/.agent/i18n-checklist.md) | Checklist từng bước khi thêm mới hoặc sửa đổi nội dung đa ngôn ngữ. |

---

## Definition of Done (DoD) Cho Client

Mỗi tính năng hoặc bugfix chỉ được coi là hoàn thành khi:
- [ ] Code clean, tuân thủ TypeScript strict, không chứa kiểu `any`, không warning lint.
- [ ] Tuân thủ thư viện chuẩn `shadcn/ui`; CẤM tuyệt đối viết inline CSS (`style={{ ... }}`).
- [ ] Đã tái sử dụng component từ `src/components/ui`; không trùng lặp logic.
- [ ] Toàn bộ text hiển thị đã khai báo qua `next-intl` trong cả `vi.json` và `en.json`.
- [ ] Đã viết unit/integration test bên cạnh component (`*.test.tsx`).
- [ ] Đã viết hoặc cập nhật test giao diện E2E trong `e2e/` (Playwright) cho các trang / luồng tương tác người dùng chính.
- [ ] Line coverage và branch coverage đạt tối thiểu **80%** (`npm run test:coverage`).
- [ ] Đã chạy và pass: `npm run lint`, `npm run typecheck`, `npm run test`, `npm run test:e2e`.
- [ ] Tài liệu liên quan trong `docs/` đã được cập nhật (nếu có thay đổi luồng/UI).
