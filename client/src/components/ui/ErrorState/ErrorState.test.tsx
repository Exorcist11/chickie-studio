import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ErrorState } from "./ErrorState";

describe("ErrorState Component (Client)", () => {
  it("renders with default title, description and triggers retry", () => {
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} />);

    expect(screen.getByText("Đã xảy ra lỗi kết nối")).toBeInTheDocument();
    const retryBtn = screen.getByRole("button", { name: "Thử lại" });
    fireEvent.click(retryBtn);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("renders custom title, description, and custom action", () => {
    render(
      <ErrorState
        title="Lỗi tải danh mục"
        description="Không tìm thấy dữ liệu danh mục"
        action={<button type="button">Về trang chủ</button>}
      />
    );

    expect(screen.getByText("Lỗi tải danh mục")).toBeInTheDocument();
    expect(screen.getByText("Không tìm thấy dữ liệu danh mục")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Về trang chủ" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ErrorState onRetry={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
