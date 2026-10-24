import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "./Input";

describe("Input component (CRM UI Primitive)", () => {
  it("renders input with label and helper text", () => {
    render(
      <Input
        label="Họ và tên"
        helperText="Nhập đầy đủ họ tên như trên CCCD"
        placeholder="Nguyễn Văn A"
      />
    );

    expect(screen.getByLabelText("Họ và tên")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nguyễn Văn A")).toBeInTheDocument();
    expect(
      screen.getByText("Nhập đầy đủ họ tên như trên CCCD")
    ).toBeInTheDocument();
  });

  it("renders error message and applies invalid state", () => {
    render(
      <Input
        label="Email"
        error="Email không hợp lệ"
        defaultValue="invalid-email"
      />
    );

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Email không hợp lệ")).toBeInTheDocument();
  });

  it("handles onChange events", () => {
    const handleChange = vi.fn();
    render(<Input label="Số điện thoại" onChange={handleChange} />);

    const input = screen.getByLabelText("Số điện thoại");
    fireEvent.change(input, { target: { value: "0901234567" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("renders with icons", () => {
    render(
      <Input
        label="Tìm kiếm"
        leftIcon={<span data-testid="search-icon">🔍</span>}
        rightIcon={<span data-testid="clear-icon">✖</span>}
      />
    );

    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
    expect(screen.getByTestId("clear-icon")).toBeInTheDocument();
  });
});
