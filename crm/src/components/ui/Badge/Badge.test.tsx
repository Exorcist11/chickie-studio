import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "./Badge";

describe("Badge component (CRM UI Primitive)", () => {
  it("renders with default variant", () => {
    render(<Badge>Mặc định</Badge>);
    const badge = screen.getByText("Mặc định");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-burgundy");
  });

  it("renders with secondary, destructive, and success variants", () => {
    const { rerender } = render(<Badge variant="secondary">Thứ cấp</Badge>);
    let badge = screen.getByText("Thứ cấp");
    expect(badge).toHaveClass("bg-ivory");

    rerender(<Badge variant="destructive">Lỗi</Badge>);
    badge = screen.getByText("Lỗi");
    expect(badge).toHaveClass("bg-destructive");

    rerender(<Badge variant="success">Hoàn thành</Badge>);
    badge = screen.getByText("Hoàn thành");
    expect(badge).toHaveClass("text-emerald-800");
  });
});
