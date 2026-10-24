import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { TextField, PasswordField, SearchField } from "./index";

describe("Chickie Base TextField & Variants", () => {
  it("renders with label and placeholder", () => {
    render(<TextField label="Email khách hàng" placeholder="nhap@email.com" />);
    expect(screen.getByLabelText(/email khách hàng/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("nhap@email.com")).toBeInTheDocument();
  });

  it("handles typing text correctly", async () => {
    render(<TextField label="Họ tên" placeholder="Tên" />);
    const input = screen.getByLabelText(/họ tên/i);

    await userEvent.type(input, "Nguyen Van A");
    expect(input).toHaveValue("Nguyen Van A");
  });

  it("displays hint text and links aria-describedby", () => {
    render(
      <TextField
        id="phone"
        label="Số điện thoại"
        hint="Định dạng 10 số di động Việt Nam"
      />
    );
    const input = screen.getByLabelText(/số điện thoại/i);
    expect(input).toHaveAttribute("aria-describedby", "phone-hint");
    expect(screen.getByText("Định dạng 10 số di động Việt Nam")).toBeInTheDocument();
  });

  it("displays semantic error with role alert and aria-invalid", () => {
    render(
      <TextField
        id="email"
        label="Email"
        error="Email không hợp lệ"
      />
    );
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "email-error");
    const errorAlert = screen.getByRole("alert");
    expect(errorAlert).toHaveTextContent("Email không hợp lệ");
  });

  it("renders required marker when required is true", () => {
    render(<TextField label="Tên đăng nhập" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders disabled state and prevents user input", async () => {
    render(<TextField label="Mã đơn" disabled value="ORD-123" readOnly />);
    const input = screen.getByLabelText(/mã đơn/i);
    expect(input).toBeDisabled();
  });

  it("renders startIcon and endIcon", () => {
    render(
      <TextField
        label="Giá tiền"
        startIcon={<span data-testid="start-icon">₫</span>}
        endIcon={<span data-testid="end-icon">VND</span>}
      />
    );
    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
    expect(screen.getByTestId("end-icon")).toBeInTheDocument();
  });

  it("PasswordField toggles between password and text type", async () => {
    render(<PasswordField label="Mật khẩu" placeholder="••••••••" />);
    const input = screen.getByPlaceholderText("••••••••");
    expect(input).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByRole("button", { name: /hiện mật khẩu/i });
    await userEvent.click(toggleBtn);
    expect(input).toHaveAttribute("type", "text");

    const hideBtn = screen.getByRole("button", { name: /ẩn mật khẩu/i });
    await userEvent.click(hideBtn);
    expect(input).toHaveAttribute("type", "password");
  });

  it("SearchField renders search icon and handles onClear", async () => {
    const handleClear = vi.fn();
    const { rerender } = render(
      <SearchField
        label="Tìm kiếm trang phục"
        value=""
        onClear={handleClear}
      />
    );

    expect(screen.queryByRole("button", { name: /xóa nội dung tìm kiếm/i })).not.toBeInTheDocument();

    rerender(
      <SearchField
        label="Tìm kiếm trang phục"
        value="Váy dạ hội"
        onClear={handleClear}
      />
    );

    const clearBtn = screen.getByRole("button", { name: /xóa nội dung tìm kiếm/i });
    expect(clearBtn).toBeInTheDocument();
    await userEvent.click(clearBtn);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it("has no accessibility violations (a11y with vitest-axe)", async () => {
    const { container } = render(
      <TextField
        label="Địa chỉ giao đồ"
        hint="Số nhà, tên đường, phường xã"
        required
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
