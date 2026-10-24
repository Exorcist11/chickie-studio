# 05 - Kiểm Thử Tự Động & Độ Phủ (Testing) (Client)

## 1. Quy Định Bắt Buộc

- **PHẢI** sử dụng bộ công cụ: **Vitest** + **React Testing Library** + **MSW** (Mock Service Worker).
- File test **PHẢI** đặt ngay cạnh component theo định dạng: `[tên-component].test.tsx`.
- **BẮT BUỘC** viết test bao phủ đủ 4 trạng thái UI:
  1. **Render thành công** (Success state với dữ liệu mẫu)
  2. **Trạng thái đang tải** (Loading state / Skeleton)
  3. **Trạng thái lỗi** (Error state / Retry)
  4. **Trạng thái rỗng** (Empty state khi không có dữ liệu)
- **PHẢI** đạt ngưỡng coverage tối thiểu **80% line** và **80% branch**. CI/build **SẼ THẤT BẠI** nếu dưới 80%.
- **SỬA BUG**: **PHẢI** viết test tái hiện bug trước (test fail), sau đó sửa code cho test pass.

---

## 2. Các Lệnh Thực Thi Bắt Buộc

```bash
npm run test           # Chạy toàn bộ test suite
npm run test:coverage  # Chạy test và xuất báo cáo độ phủ (kiểm tra ngưỡng >= 80%)
```

---

## 3. Ví Dụ Cụ Thể

```tsx
// ❌ SAI: Chỉ test xem component có crash không, bỏ qua tương tác và lỗi
it("renders", () => {
  render(<BookingForm />);
});

// ✅ ĐÚNG: Test hành vi người dùng, render đầy đủ và xử lý lỗi
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
