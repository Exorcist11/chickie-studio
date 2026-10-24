import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Input } from "./Input";

describe("Input component", () => {
  it("renders with label and placeholder", () => {
    render(<Input label="Họ và tên" placeholder="Nhập họ tên" />);
    expect(screen.getByLabelText(/họ và tên/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/nhập họ tên/i)).toBeInTheDocument();
  });

  it("handles user typing", async () => {
    const user = userEvent.setup();
    render(<Input label="Email" />);
    const input = screen.getByLabelText(/email/i);
    await user.type(input, "chickie@studio.vn");
    expect(input).toHaveValue("chickie@studio.vn");
  });

  it("renders error message and sets aria-invalid", () => {
    render(
      <Input
        label="Số điện thoại"
        error="Số điện thoại không hợp lệ"
      />
    );
    const input = screen.getByLabelText(/số điện thoại/i);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Số điện thoại không hợp lệ")).toBeInTheDocument();
  });

  it("renders helper text when no error", () => {
    render(
      <Input
        label="Mã đơn"
        helperText="Ví dụ: BK20261105-001"
      />
    );
    expect(screen.getByText("Ví dụ: BK20261105-001")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Input label="Tên khách hàng" helperText="Nhập đầy đủ họ tên" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
