import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ErrorState } from "./ErrorState";

describe("ErrorState Component (CRM UI)", () => {
  it("renders with title, description and handles retry", () => {
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} />);

    expect(screen.getByText("Đã xảy ra lỗi kết nối")).toBeInTheDocument();
    const retryBtn = screen.getByRole("button", { name: "Thử lại" });
    fireEvent.click(retryBtn);

    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ErrorState onRetry={() => {}} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
