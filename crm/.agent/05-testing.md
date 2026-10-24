# 05 - Kiểm Thử Tự Động & Độ Phủ (Testing) (CRM)

## 1. Quy Định Bắt Buộc

- **PHẢI** sử dụng **Vitest** + **React Testing Library** + **MSW** (Mock Service Worker).
- Mọi module mới **BẮT BUỘC** có test tương ứng:
  - Component chung (`src/components/common`): Test render, tương tác sự kiện, accessibility.
  - Custom Hooks / Services: Test logic xử lý data, xử lý lỗi API.
  - Pages: Test luồng tải dữ liệu, hiển thị danh sách, submit form.
- **PHẢI** đạt tối thiểu **80% coverage** (cả Line và Branch coverage). CI sẽ fail nếu dưới 80%.
- **SỬA BUG**: **PHẢI** viết test tái hiện lỗi trước (red test), sửa mã nguồn cho test pass (green test).

---

## 2. Các Lệnh Thực Thi Bắt Buộc

```bash
npm run test           # Chạy toàn bộ test suite
npm run test:coverage  # Chạy test và tính toán độ phủ (ngưỡng bắt buộc >= 80%)
```

---

## 3. Ví Dụ Cụ Thể

```tsx
// ❌ SAI: Test hời hợt, không kiểm tra luồng fetch dữ liệu hay tương tác người dùng
test("render data table", () => {
  render(<DataTable columns={[]} dataSource={[]} />);
});

// ✅ ĐÚNG: Mock API bằng MSW và kiểm tra hành vi tương tác đầy đủ
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DressListPage } from "./dress-list-page";
import { server } from "@/tests/mocks/server";
import { http, HttpResponse } from "msw";

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
