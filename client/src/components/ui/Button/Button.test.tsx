import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Button } from "./Button";

describe("Button component", () => {
  it("renders with default props (primary md)", () => {
    render(<Button>Bấm vào đây</Button>);
    const btn = screen.getByRole("button", { name: /bấm vào đây/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("bg-burgundy");
    expect(btn).toHaveClass("min-h-[44px]");
  });

  it("renders secondary, outline, ghost, destructive, and tertiary variants", () => {
    const { rerender } = render(<Button variant="secondary">Nút phụ</Button>);
    expect(screen.getByRole("button", { name: /nút phụ/i })).toHaveClass("border-burgundy");

    rerender(<Button variant="outline">Đường viền</Button>);
    expect(screen.getByRole("button", { name: /đường viền/i })).toHaveClass("border-burgundy");

    rerender(<Button variant="ghost">Nút mờ</Button>);
    expect(screen.getByRole("button", { name: /nút mờ/i })).toHaveClass("text-ink");

    rerender(<Button variant="destructive">Xóa bỏ</Button>);
    expect(screen.getByRole("button", { name: /xóa bỏ/i })).toHaveClass("bg-destructive");

    rerender(<Button variant="tertiary">Liên kết chữ</Button>);
    expect(screen.getByRole("button", { name: /liên kết chữ/i })).toHaveClass("text-burgundy");
  });

  it("renders sizes default, sm, lg, and icon correctly", () => {
    const { rerender } = render(<Button size="sm">Nút nhỏ</Button>);
    expect(screen.getByRole("button", { name: /nút nhỏ/i })).toHaveClass("min-h-[36px]");

    rerender(<Button size="lg">Nút lớn</Button>);
    expect(screen.getByRole("button", { name: /nút lớn/i })).toHaveClass("min-h-[48px]");

    rerender(<Button size="icon" aria-label="Icon button">🔍</Button>);
    expect(screen.getByRole("button", { name: /icon button/i })).toHaveClass("h-10", "w-10");

    rerender(<Button size="default">Mặc định</Button>);
    expect(screen.getByRole("button", { name: /mặc định/i })).toHaveClass("min-h-[44px]");
  });

  it("handles click events", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Nhấp chuột</Button>);

    await user.click(screen.getByRole("button", { name: /nhấp chuột/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders disabled state and ignores clicks", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Vô hiệu hóa</Button>);

    const btn = screen.getByRole("button", { name: /vô hiệu hóa/i });
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("renders loading state with spinner and aria-busy", () => {
    render(<Button isLoading>Đang tải</Button>);
    const btn = screen.getByRole("button", { name: /đang tải/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("button-spinner")).toBeInTheDocument();
  });

  it("renders as link when href is provided", () => {
    render(<Button href="/san-pham">Xem sản phẩm</Button>);
    const link = screen.getByRole("link", { name: /xem sản phẩm/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/san-pham");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Button>Nút kiểm tra accessibility</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
