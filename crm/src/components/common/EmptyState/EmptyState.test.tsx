import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EmptyState } from "./EmptyState";
import "../../../i18n";

describe("EmptyState", () => {
  it("renders default description", () => {
    render(<EmptyState />);
    expect(screen.getByText("Không có dữ liệu")).toBeInTheDocument();
  });

  it("renders custom description and action button", () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        description="Chưa có sản phẩm nào"
        actionText="Thêm sản phẩm"
        onAction={handleAction}
      />
    );

    expect(screen.getByText("Chưa có sản phẩm nào")).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: "Thêm sản phẩm" });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});

