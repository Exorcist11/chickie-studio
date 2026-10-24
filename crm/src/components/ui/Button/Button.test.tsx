import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./Button";

describe("Button component (CRM UI Primitive)", () => {
  it("renders with default primary variant and handles click", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Lưu thay đổi</Button>);

    const btn = screen.getByRole("button", { name: "Lưu thay đổi" });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("bg-burgundy");

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with different variants and sizes", () => {
    const { rerender } = render(
      <Button variant="secondary" size="sm">
        Hủy
      </Button>
    );
    let btn = screen.getByRole("button", { name: "Hủy" });
    expect(btn).toHaveClass("border-line");

    rerender(
      <Button variant="destructive" size="lg">
        Xóa
      </Button>
    );
    btn = screen.getByRole("button", { name: "Xóa" });
    expect(btn).toHaveClass("bg-destructive");

    rerender(
      <Button variant="outline">
        Chi tiết
      </Button>
    );
    btn = screen.getByRole("button", { name: "Chi tiết" });
    expect(btn).toHaveClass("border-burgundy");
  });

  it("handles loading state and disables button", () => {
    render(<Button isLoading>Đang lưu...</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(screen.getByTestId("button-spinner")).toBeInTheDocument();
  });

  it("renders as anchor tag when href is provided", () => {
    render(<Button href="/dashboard">Xem báo cáo</Button>);
    const link = screen.getByRole("link", { name: "Xem báo cáo" });
    expect(link).toHaveAttribute("href", "/dashboard");
  });
});
