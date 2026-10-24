import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ErrorState } from "./ErrorState";
import "../../../i18n";

describe("ErrorState", () => {
  it("renders default error message", () => {
    render(<ErrorState />);
    expect(screen.getByText("Đã xảy ra lỗi")).toBeInTheDocument();
  });

  it("renders retry button and triggers callback", () => {
    const handleRetry = vi.fn();
    render(<ErrorState onRetry={handleRetry} />);

    const retryBtn = screen.getByRole("button", { name: "Thử lại" });
    expect(retryBtn).toBeInTheDocument();
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });
});

