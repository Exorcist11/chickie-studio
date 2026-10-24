import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Button } from "./Button";

describe("Chickie Base Button Component", () => {
  it("renders with children text", () => {
    render(<Button>Xác nhận đơn</Button>);
    expect(screen.getByRole("button", { name: /xác nhận đơn/i })).toBeInTheDocument();
  });

  it("applies primary, secondary, and tertiary variants correctly", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-primary");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(button.className).toContain("border");

    rerender(<Button variant="tertiary">Tertiary</Button>);
    expect(button.className).toContain("hover:bg-accent");
  });

  it("applies md and sm sizes correctly", () => {
    const { rerender } = render(<Button size="md">Kích thước chuẩn</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("h-11");

    rerender(<Button size="sm">Kích thước nhỏ</Button>);
    expect(button.className).toContain("h-9");
  });

  it("handles loading state properly with spinner, disabled and aria-busy", () => {
    render(<Button loading>Đang xử lý</Button>);
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("button-spinner")).toBeInTheDocument();
  });

  it("handles isLoading alias state properly", () => {
    render(<Button isLoading>Đang lưu</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(screen.getByTestId("button-spinner")).toBeInTheDocument();
  });

  it("renders left and right icons when provided", () => {
    render(
      <Button
        leftIcon={<span data-testid="left-icon">←</span>}
        rightIcon={<span data-testid="right-icon">→</span>}
      >
        Tiếp tục
      </Button>
    );
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("fires onClick handler when clicked", async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Bấm vào đây</Button>);

    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const handleClick = vi.fn();
    render(
      <Button disabled onClick={handleClick}>
        Vô hiệu hoá
      </Button>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("has no accessibility violations (a11y with vitest-axe)", async () => {
    const { container } = render(<Button variant="primary">Đặt trang phục</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
