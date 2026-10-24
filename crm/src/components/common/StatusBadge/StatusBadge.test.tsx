import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";
import "../../../i18n";

describe("StatusBadge component (CRM)", () => {
  it("renders order status correctly", () => {
    render(<StatusBadge type="order" status="PENDING" />);
    expect(screen.getByText("Chờ xác nhận")).toBeInTheDocument();
  });

  it("renders item status correctly", () => {
    render(<StatusBadge type="item" status="AVAILABLE" />);
    expect(screen.getByText("Sẵn sàng")).toBeInTheDocument();
  });

  it("applies tones correctly for overdue and canceled", () => {
    const { container: overdueEl } = render(<StatusBadge type="order" status="OVERDUE" />);
    expect(overdueEl.firstChild).toHaveClass("text-red-800");

    const { container: cancelEl } = render(<StatusBadge type="order" status="CANCELLED" />);
    expect(cancelEl.firstChild).toHaveClass("text-stone-700");
  });
});

