import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge Component", () => {
  it("renders order status correctly", () => {
    render(<StatusBadge type="order" status="DELIVERED" />);
    expect(screen.getByRole("status")).toHaveTextContent("Đang cho thuê");
  });

  it("renders item status correctly", () => {
    render(<StatusBadge type="item" status="AVAILABLE" />);
    expect(screen.getByRole("status")).toHaveTextContent("Có sẵn");
  });

  it("renders custom label when provided", () => {
    render(
      <StatusBadge
        type="order"
        status="PENDING"
        label="Đang chờ shop duyệt"
      />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Đang chờ shop duyệt");
  });

  it("supports sm and md sizes", () => {
    const { rerender } = render(
      <StatusBadge type="order" status="COMPLETED" size="sm" />
    );
    expect(screen.getByRole("status")).toHaveClass("text-xs");

    rerender(<StatusBadge type="order" status="COMPLETED" size="md" />);
    expect(screen.getByRole("status")).toHaveClass("px-3");
  });

  it("can hide status dot when showDot is false", () => {
    const { container } = render(
      <StatusBadge type="order" status="OVERDUE" showDot={false} />
    );
    expect(container.querySelector(".rounded-full.bg-current")).toBeNull();
  });

  it("renders all order tones without breaking", () => {
    const statuses = [
      "PENDING",
      "CONFIRMED",
      "DEPOSITED",
      "DELIVERED",
      "RETURNED",
      "COMPLETED",
      "CANCELLED",
      "OVERDUE",
    ] as const;

    statuses.forEach((st) => {
      const { unmount } = render(<StatusBadge type="order" status={st} />);
      expect(screen.getByRole("status")).toBeInTheDocument();
      unmount();
    });
  });

  it("renders all item tones without breaking", () => {
    const statuses = [
      "AVAILABLE",
      "RENTED",
      "CLEANING",
      "REPAIRING",
      "INACTIVE",
    ] as const;

    statuses.forEach((st) => {
      const { unmount } = render(<StatusBadge type="item" status={st} />);
      expect(screen.getByRole("status")).toBeInTheDocument();
      unmount();
    });
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <StatusBadge type="order" status="CONFIRMED" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
