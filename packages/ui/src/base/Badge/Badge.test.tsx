import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Badge } from "./Badge";

describe("Chickie Base Badge Component", () => {
  it("renders text content correctly", () => {
    render(<Badge>Mới ra mắt</Badge>);
    expect(screen.getByText("Mới ra mắt")).toBeInTheDocument();
  });

  it("applies primary variant by default", () => {
    render(<Badge>Primary</Badge>);
    const badge = screen.getByText("Primary");
    expect(badge.className).toContain("bg-primary");
  });

  it("applies semantic color variants", () => {
    const { rerender } = render(<Badge variant="secondary">Đã cọc</Badge>);
    expect(screen.getByText("Đã cọc").className).toContain("bg-secondary");

    rerender(<Badge variant="accent">Đặc biệt</Badge>);
    expect(screen.getByText("Đặc biệt").className).toContain("bg-accent");

    rerender(<Badge variant="success">Hoàn thành</Badge>);
    expect(screen.getByText("Hoàn thành").className).toContain("bg-success");

    rerender(<Badge variant="warning">Chờ xử lý</Badge>);
    expect(screen.getByText("Chờ xử lý").className).toContain("bg-warning");

    rerender(<Badge variant="destructive">Hủy bỏ</Badge>);
    expect(screen.getByText("Hủy bỏ").className).toContain("bg-destructive");

    rerender(<Badge variant="outline">Viền mảnh</Badge>);
    expect(screen.getByText("Viền mảnh").className).toContain("border-border");
  });

  it("applies size classes (sm and md)", () => {
    const { rerender } = render(<Badge size="sm">Nhỏ</Badge>);
    expect(screen.getByText("Nhỏ").className).toContain("text-[11px]");

    rerender(<Badge size="md">Vừa</Badge>);
    expect(screen.getByText("Vừa").className).toContain("text-xs");
  });

  it("allows custom className override", () => {
    render(<Badge className="custom-badge-class">Tùy biến</Badge>);
    expect(screen.getByText("Tùy biến").className).toContain("custom-badge-class");
  });

  it("has no accessibility violations (a11y with vitest-axe)", async () => {
    const { container } = render(
      <div>
        <Badge variant="primary">Mới</Badge>
        <Badge variant="success">Có sẵn</Badge>
        <Badge variant="warning">Hết hàng</Badge>
        <Badge variant="destructive">Hỏng hóc</Badge>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
