import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { EmptyState } from "./EmptyState";

describe("EmptyState Component (CRM UI)", () => {
  it("renders with title, description, and custom action", () => {
    render(
      <EmptyState
        title="Không tìm thấy đơn hàng"
        description="Thử tìm kiếm với từ khóa khác"
        action={<button type="button">Tạo đơn mới</button>}
      />
    );

    expect(screen.getByText("Không tìm thấy đơn hàng")).toBeInTheDocument();
    expect(screen.getByText("Thử tìm kiếm với từ khóa khác")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tạo đơn mới" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<EmptyState title="Trống" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
