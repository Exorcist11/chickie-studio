# 07 - Quy Chuẩn Thư Viện UI (shadcn/ui & Phân Tầng Component) - Client

Tài liệu này quy định kiến trúc thư viện giao diện thống nhất cho ứng dụng **Client (Next.js 14 App Router)** của Chickie Studio.

---

## 1. Quyết Định Nền Tảng UI

- **Thư viện UI chuẩn**: Thống nhất sử dụng **shadcn/ui** (Radix UI + Tailwind CSS v4) làm thư viện UI tiêu chuẩn duy nhất.
- **Bản quyền mã nguồn**: Toàn bộ mã nguồn component nằm trực tiếp trong dự án (`components/ui` và `components/common`), cho phép tùy chỉnh tự do theo Design System mà không bị phụ thuộc vào package bên ngoài.
- **TUYỆT ĐỐI CẤM inline CSS**: Không dùng `style={{ ... }}` trong JSX/HTML. Toàn bộ CSS tùy chỉnh phải viết qua class Tailwind hoặc file SCSS có phạm vi rõ ràng.
- **Ngoại lệ duy nhất**: Giá trị động tại runtime (mã hex màu sản phẩm) phải dùng **CSS Custom Properties**:
  ```tsx
  style={{ "--swatch-color": color } as React.CSSProperties}
  ```

---

## 2. Quy Chuẩn Phân Tầng Component (3 Tầng)

| Phân tầng | Đường dẫn thư mục | Nội dung & Trách nhiệm | Quy định Kiểm thử (Testing & Coverage) |
| :--- | :--- | :--- | :--- |
| **Tầng 1: UI Primitives** | `src/components/ui/` | Các component nguyên tử do shadcn/ui sinh ra hoặc bao bọc Radix UI: `button`, `input`, `label`, `dialog`, `select`, `badge`, `card`... | **Không tính ngưỡng coverage** (được loại trừ trong `vitest.config.ts`), vì là mã nguồn thư viện tiêu chuẩn đã được kiểm chứng. |
| **Tầng 2: Common Components** | `src/components/common/` | Các component tái sử dụng trong toàn bộ Client ghép từ tầng UI Primitives: `ProductCard`, `ServiceCard`, `TestimonialCard`, `Header`, `Footer`, `SectionHeading`, `Container`, `Section`, `DateRangeField`... | **Bắt buộc viết test tự động**. Ngưỡng coverage tối thiểu **$\ge 80\%$** cho cả dòng (lines) và nhánh (branches). |
| **Tầng 3: Feature Components** | `src/components/features/` | Các component gắn liền với nghiệp vụ của từng module cụ thể: `booking/BookingCalendar`, `catalog/DressFilterSheet`, `auth/LoginForm`... | **Bắt buộc viết test tự động**. Ngưỡng coverage tối thiểu **$\ge 80\%$**. |

---

## 3. Quy Tắc Tinh Chỉnh Component shadcn Cho Client

Tuân thủ nghiêm ngặt mục 6 của [docs/DESIGN_SYSTEM.md](file:///e:/chickie-studio/docs/DESIGN_SYSTEM.md):
1. **Button**:
   - `variant="primary"`: Nền Burgundy `#641D2B`, chữ trắng ngà `#FFFCF8`, hover Burgundy Light `#762538`.
   - `variant="secondary"` (hoặc outline): Viền Burgundy, nền trong suốt, hover nền Ivory `#F8F1E8`.
   - `variant="tertiary"`: Text link Burgundy gạch chân khi hover.
   - Chiều cao tối thiểu cho nút bấm chính: `44px` (touch target mobile).
2. **Badge**:
   - Luôn kèm chữ mô tả, không hiển thị màu đơn độc.
   - Hỗ trợ đầy đủ 8 trạng thái đơn thuê: `PENDING`, `CONFIRMED`, `DEPOSITED`, `DELIVERED`, `RETURNED`, `COMPLETED`, `CANCELLED`, `OVERDUE`.
3. **Card & ProductCard**:
   - Bo góc `16px` (`rounded-card`), đổ bóng `--shadow-card`.
   - Ảnh sản phẩm tỷ lệ `3:4` sử dụng `next/image` với `sizes` tối ưu.
4. **Input & Form Elements**:
   - Ring focus màu Burgundy: `focus-visible:ring-burgundy`.
   - Trạng thái lỗi: Viền đỏ `#D9383A`, hiển thị `role="alert"` và `aria-invalid="true"`.

---

## 4. Quy Trình Thay Đổi Theme & Token

1. Khi cần đổi màu sắc, khoảng cách hoặc bo góc: **chỉ chỉnh sửa** tại file `src/styles/shadcn-theme.css`.
2. Chạy lệnh đồng bộ:
   ```bash
   npm run theme:apply
   ```
3. Lệnh này sẽ tự động cập nhật token vào `tokens.css` và hệ thống SCSS phân tầng.
4. Chạy kiểm tra: `npm run typecheck && npm run test:coverage`.
