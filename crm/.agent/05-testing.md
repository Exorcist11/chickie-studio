# 05 - Kiểm Thử Tự Động & Độ Phủ (Testing) (CRM)

Hệ thống quản trị CRM (React Vite) áp dụng chiến lược kiểm thử đa tầng: **Unit/Component Testing** (Vitest + RTL + MSW) và **Kiểm Thử Giao Diện E2E** (Playwright).

---

## 1. Quy Định Bắt Buộc

### A. Unit & Component Test (Vitest + React Testing Library + MSW)
- **PHẢI** sử dụng **Vitest** + **React Testing Library** + **MSW** (Mock Service Worker).
- Mọi module mới **BẮT BUỘC** có test tương ứng:
  - Component chung (`src/components/common`): Test render, tương tác sự kiện, accessibility.
  - Custom Hooks / Services: Test logic xử lý data, xử lý lỗi API.
  - Pages: Test luồng tải dữ liệu, hiển thị danh sách, submit form.
- **PHẢI** đạt tối thiểu **80% coverage** (cả Line và Branch coverage). CI sẽ fail nếu dưới 80%.
- **SỬA BUG**: **PHẢI** viết test tái hiện lỗi trước (red test), sửa mã nguồn cho test pass (green test).

### B. Kiểm Thử Giao Diện & E2E (Playwright)
- **PHẢI** sử dụng thư viện tiêu chuẩn: **`@playwright/test`**.
- Thư mục kiểm thử giao diện: **`crm/e2e/`** (tách biệt hoàn toàn khỏi thư mục `src/`).
- Định dạng file test: `[tên-module].spec.ts` (ví dụ: `auth.spec.ts`, `categories.spec.ts`, `orders.spec.ts`).
- **BẮT BUỘC** viết test giao diện cho các màn hình và quy trình quản trị cốt lõi:
  1. Luồng xác thực đăng nhập (`/login`), điều hướng bảo vệ Route Guard (chuyển hướng người dùng chưa đăng nhập, phân quyền `ROLE_ADMIN` vs `ROLE_STAFF`).
  2. Quản lý danh mục sản phẩm (`/categories`): Tạo mới, sửa đổi, xóa, lọc danh sách.
  3. Quản lý đơn thuê và cập nhật trạng thái đơn (giữ cọc, giao đồ, trả đồ, hoàn cọc).
- **Quy tắc viết Playwright**:
  - Ưu tiên selector theo vai trò và accessibility: `page.getByRole()`, `page.locator("#id")`, `page.getByText()`.
  - Luôn kiểm tra phản hồi tương tác (Modal xác nhận, alert thông báo thành công/thất bại, validate lỗi form).
  - Sử dụng web-first assertions: `await expect(locator).toBeVisible()`.

---

## 2. Các Lệnh Thực Thi Bắt Buộc

```bash
# Unit & Integration Testing (Vitest)
npm run test           # Chạy toàn bộ test suite
npm run test:coverage  # Chạy test và tính toán độ phủ (ngưỡng bắt buộc >= 80%)

# UI & E2E Testing (Playwright)
npm run test:e2e        # Chạy toàn bộ test giao diện trên trình duyệt Chromium (headless)
npm run test:e2e:ui     # Mở giao diện tương tác trực quan Playwright UI Runner
npm run test:e2e:report # Xem báo cáo chi tiết trực quan (HTML Report kèm trace/screenshot)
```

---

## 3. Ví Dụ Cụ Thể

### Ví dụ 1: Component Test với React Testing Library + MSW
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DressListPage } from "./dress-list-page";

describe("DressListPage", () => {
  it("hiển thị danh sách váy và xóa thành công khi xác nhận modal", async () => {
    const user = userEvent.setup();
    render(<DressListPage />);

    expect(await screen.findByText("Váy Dạ Hội Đỏ")).toBeInTheDocument();

    const deleteBtn = screen.getByRole("button", { name: /xóa/i });
    await user.click(deleteBtn);

    const confirmBtn = screen.getByRole("button", { name: /xác nhận/i });
    await user.click(confirmBtn);

    expect(await screen.findByText(/xóa thành công/i)).toBeInTheDocument();
  });
});
```

### Ví dụ 2: UI & E2E Test với Playwright (`e2e/auth.spec.ts`)
```ts
import { test, expect } from "@playwright/test";

test.describe("CRM Authentication UI Test", () => {
  test("chuyển hướng người dùng chưa đăng nhập về trang /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("hiển thị lỗi validate Zod khi bấm đăng nhập với form rỗng", async ({ page }) => {
    await page.goto("/login");

    const submitBtn = page.getByRole("button", { name: /đăng nhập/i });
    await submitBtn.click();

    await expect(page.getByText(/Vui lòng nhập tên đăng nhập hoặc email/i)).toBeVisible();
  });
});
```
