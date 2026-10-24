# 05 - Kiểm Thử Tự Động & Độ Phủ (Testing) (Client)

Hệ thống Client (Next.js) áp dụng chiến lược kiểm thử đa tầng: **Unit/Component Testing** (Vitest + RTL) và **Kiểm Thử Giao Diện E2E** (Playwright).

---

## 1. Quy Định Bắt Buộc

### A. Unit & Component Test (Vitest + React Testing Library)
- **PHẢI** sử dụng bộ công cụ: **Vitest** + **React Testing Library** + **MSW** (Mock Service Worker).
- File test **PHẢI** đặt ngay cạnh component theo định dạng: `[tên-component].test.tsx`.
- **BẮT BUỘC** viết test bao phủ đủ 4 trạng thái UI:
  1. **Render thành công** (Success state với dữ liệu mẫu)
  2. **Trạng thái đang tải** (Loading state / Skeleton)
  3. **Trạng thái lỗi** (Error state / Retry)
  4. **Trạng thái rỗng** (Empty state khi không có dữ liệu)
- **PHẢI** đạt ngưỡng coverage tối thiểu **80% line** và **80% branch**. CI/build **SẼ THẤT BẠI** nếu dưới 80%.
- **SỬA BUG**: **PHẢI** viết test tái hiện bug trước (test fail), sau đó sửa code cho test pass.

### B. Kiểm Thử Giao Diện & E2E (Playwright)
- **PHẢI** sử dụng thư viện tiêu chuẩn: **`@playwright/test`**.
- Thư mục kiểm thử giao diện: **`client/e2e/`** (tách biệt hoàn toàn khỏi thư mục `src/`).
- Định dạng file test: `[tên-luong].spec.ts` (ví dụ: `home.spec.ts`, `booking-flow.spec.ts`).
- **BẮT BUỘC** viết test giao diện cho các màn hình và luồng người dùng cốt lõi (Critical User Journeys):
  1. Màn hình trang chủ (`/`), điều hướng danh mục sản phẩm, banner dịch vụ.
  2. Luồng xem chi tiết sản phẩm, chọn size, màu sắc, kiểm tra lịch trống.
  3. Luồng gửi form đặt thuê trang phục / combo máy ảnh.
  4. Luồng tra cứu đơn hàng bằng SĐT/mã đơn.
- **Quy tắc viết Playwright**:
  - Ưu tiên selector theo tiêu chuẩn trợ năng (Accessibility): `page.getByRole()`, `page.getByLabel()`, `page.getByText()`.
  - Hạn chế dùng CSS selector tĩnh dễ vỡ như `page.locator(".class-name")`.
  - Luôn sử dụng assertions tự động chờ (web-first assertions): `await expect(locator).toBeVisible()`.

---

## 2. Các Lệnh Thực Thi Bắt Buộc

```bash
# Unit & Integration Testing (Vitest)
npm run test           # Chạy toàn bộ unit test suite
npm run test:coverage  # Chạy test và xuất báo cáo độ phủ (kiểm tra ngưỡng >= 80%)

# UI & E2E Testing (Playwright)
npm run test:e2e        # Chạy toàn bộ test giao diện trên trình duyệt Chromium (headless)
npm run test:e2e:ui     # Mở giao diện tương tác trực quan Playwright UI Runner
npm run test:e2e:report # Xem báo cáo chi tiết trực quan (HTML Report kèm trace/screenshot)
```

---

## 3. Ví Dụ Cụ Thể

### Ví dụ 1: Component Test với React Testing Library
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookingForm } from "./booking-form";

describe("BookingForm", () => {
  it("hiển thị lỗi khi người dùng gửi form mà chưa chọn ngày thuê", async () => {
    const user = userEvent.setup();
    render(<BookingForm onSubmit={vi.fn()} />);

    const submitBtn = screen.getByRole("button", { name: /đặt thuê ngay/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/vui lòng chọn ngày/i)).toBeInTheDocument();
  });
});
```

### Ví dụ 2: UI & E2E Test với Playwright (`e2e/home.spec.ts`)
```ts
import { test, expect } from "@playwright/test";

test.describe("Client Home Page UI Flow", () => {
  test("hiển thị Hero section, danh mục sản phẩm và điều hướng đúng", async ({ page }) => {
    await page.goto("/");

    // 1. Kiểm tra phần tử giao diện chính
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Chickie Studio • More than just a dress")).toBeVisible();

    // 2. Kiểm tra danh mục sản phẩm
    await expect(page.getByRole("heading", { name: "Danh Mục Sản Phẩm" })).toBeVisible();

    // 3. Tương tác click điều hướng
    const ctaBtn = page.getByRole("link", { name: "Xem Design System UI" });
    await expect(ctaBtn).toBeVisible();
    await ctaBtn.click();

    // 4. Xác nhận chuyển hướng URL thành công
    await expect(page).toHaveURL(/\/dev\/components/);
  });
});
```
