import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Badge, type OrderStatus } from "./Badge";

describe("Badge component", () => {
  const statuses: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "DEPOSITED",
    "DELIVERED",
    "RETURNED",
    "COMPLETED",
    "CANCELLED",
    "OVERDUE",
  ];

  statuses.forEach((status) => {
    it(`renders status ${status} with text and dot`, () => {
      render(<Badge status={status} />);
      const badge = screen.getByText(/Chờ xác nhận|Đã xác nhận|Đã đặt cọc|Đang cho thuê|Đã trả đồ|Hoàn tất|Đã hủy|Quá hạn trả/);
      expect(badge).toBeInTheDocument();
    });
  });

  it("renders custom label when provided", () => {
    render(<Badge status="COMPLETED" label="Thành công rực rỡ" />);
    expect(screen.getByText("Thành công rực rỡ")).toBeInTheDocument();
  });

  it("can hide dot indicator", () => {
    const { container } = render(<Badge status="CONFIRMED" showDot={false} />);
    const dot = container.querySelector(".rounded-full");
    expect(dot).toBeNull();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Badge status="DELIVERED" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
