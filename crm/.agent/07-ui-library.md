# 07 - Quy Chuẩn Thư Viện UI (shadcn/ui & Phân Tầng Component) - CRM

Tài liệu này quy định kiến trúc thư viện giao diện thống nhất cho ứng dụng **CRM (React 18 + Vite)** của Chickie Studio.

---

## 1. Quyết Định Nền Tảng UI

- **Thư viện UI chuẩn**: Thống nhất chuyển đổi toàn bộ sang **shadcn/ui** (Tailwind CSS v4 + Radix UI Primitives), loại bỏ hoàn toàn Ant Design (`antd`).
- **Lý do loại bỏ Ant Design**:
  - Không đồng bộ token thiết kế với Client Next.js.
  - Khó tùy biến màu sắc Burgundy `#641D2B` và Champagne Gold `#B8914F` triệt để.
  - Bundle size nặng nề và phụ thuộc vào inline style.
  - Với shadcn/ui, cả hai ứng dụng dùng chung **một Design System**, **một bộ token**, **một cú pháp viết component**.
- **CẤM TUYỆT ĐỐI**:
  - Cài đặt lại hoặc import bất kỳ package nào từ `antd` hoặc `@ant-design/icons`.
  - Viết inline style `style={{ ... }}` trong JSX/HTML.

---

## 2. Quy Chuẩn Phân Tầng Component (3 Tầng)

| Phân tầng | Đường dẫn thư mục | Nội dung & Trách nhiệm | Quy định Kiểm thử (Testing & Coverage) |
| :--- | :--- | :--- | :--- |
| **Tầng 1: UI Primitives** | `src/components/ui/` | Các component nguyên tử chuẩn shadcn/ui: `Button`, `Input`, `Card`, `Badge`, `Dialog`, `Select`, `Table`... | **Không tính ngưỡng coverage** (được loại trừ trong `vitest.config.ts`), vì là mã nguồn thư viện tiêu chuẩn đã được kiểm chứng. |
| **Tầng 2: Common Components** | `src/components/common/` | Các component quản trị dùng chung được ghép từ Tầng 1: `DataTable`, `StatusBadge`, `PageHeader`, `FilterBar`, `FormField`, `ConfirmModal`, `ImageUploader`, `AppLayout`, `StatCard`, `RevenueChart`, `EmptyState`, `ErrorState`, `PageLoading`. | **Bắt buộc viết test tự động**. Ngưỡng coverage tối thiểu **$\ge 80\%$** cho cả dòng (lines) và nhánh (branches). Cấu trúc mỗi component: `<Name>/<Name>.tsx`, `<Name>.test.tsx`, `<Name>.scss`, `index.ts`. |
| **Tầng 3: Feature Components** | `src/components/features/` | Các component gắn liền với nghiệp vụ của từng module quản trị: `bookings/BookingDetailDrawer`, `products/DressFormModal`, `customers/CustomerHistoryTable`... | **Bắt buộc viết test tự động**. Ngưỡng coverage tối thiểu **$\ge 80\%$**. |

---

## 3. Tích Hợp TanStack Table Với Table Của shadcn/ui

- Khi xây dựng các màn hình danh sách phức tạp, **PHẢI** kết hợp `@tanstack/react-table` (xử lý logic state, phân trang, lọc, sắp xếp dữ liệu) với primitive `Table` của shadcn/ui hoặc wrapper [`DataTable`](file:///e:/chickie-studio/crm/src/components/common/DataTable/DataTable.tsx).
- **KHÔNG ĐƯỢC** tự viết lại các bảng dữ liệu thủ công rời rạc.

---

## 4. Tích Hợp Form Với react-hook-form & Zod

- Toàn bộ form nhập liệu quản trị (Thêm/Sửa trang phục, Đơn thuê, Khách hàng) **PHẢI** sử dụng:
  - `react-hook-form` để quản lý state và sự kiện submit.
  - `zod` và `@hookform/resolvers/zod` để định nghĩa schema và xác thực dữ liệu.
  - Wrapper [`FormField`](file:///e:/chickie-studio/crm/src/components/common/FormField/FormField.tsx) hoặc primitive `Form` của shadcn để hiển thị nhãn và lỗi ngữ nghĩa WAI-ARIA (`role="alert"`).

---

## 5. Quy Trình Thay Đổi Theme & Token

1. Khi cần điều chỉnh màu sắc, khoảng cách hoặc bo góc: **chỉ chỉnh sửa** tại file `src/styles/shadcn-theme.css`.
2. Chạy lệnh đồng bộ:
   ```bash
   npm run theme:apply
   ```
3. Lệnh này sẽ tự động cập nhật token vào `tokens.css` và hệ thống SCSS phân tầng.
4. Chạy kiểm tra: `npm run typecheck && npm run test:coverage`.
