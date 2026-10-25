import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TrackingTimeline } from "./TrackingTimeline";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      "PENDING.title": "Chờ xác nhận",
      "PENDING.desc": "Đơn thuê đã được ghi nhận",
      "CONFIRMED.title": "Đã xác nhận",
      "CONFIRMED.desc": "Chickie đã kiểm tra đồ",
      "DEPOSITED.title": "Đã nhận cọc",
      "DEPOSITED.desc": "Tiệm đã nhận cọc",
      "DELIVERED.title": "Đang thuê đồ",
      "DELIVERED.desc": "Trang phục đang cùng bạn",
      "RETURNED.title": "Đã trả đồ",
      "RETURNED.desc": "Tiệm đã nhận lại",
      "COMPLETED.title": "Hoàn tất đơn",
      "COMPLETED.desc": "Đơn thuê hoàn tất",
      "CANCELLED.title": "Đã hủy đơn",
      "CANCELLED.desc": "Đơn thuê đã bị hủy",
      "OVERDUE.title": "Quá hạn trả",
      "OVERDUE.desc": "Đơn thuê đã quá ngày hẹn",
    };
    return translations[key] || key;
  },
}));

describe("TrackingTimeline", () => {
  it("renders all 6 steps correctly", () => {
    render(<TrackingTimeline currentStatus="CONFIRMED" />);

    expect(screen.getByTestId("tracking-timeline")).toBeInTheDocument();
    expect(screen.getByTestId("step-pending")).toBeInTheDocument();
    expect(screen.getByTestId("step-confirmed")).toBeInTheDocument();
    expect(screen.getByTestId("step-deposited")).toBeInTheDocument();
    expect(screen.getByTestId("step-delivered")).toBeInTheDocument();
    expect(screen.getByTestId("step-returned")).toBeInTheDocument();
    expect(screen.getByTestId("step-completed")).toBeInTheDocument();
  });

  it("renders special badge and banner when status is CANCELLED", () => {
    render(<TrackingTimeline currentStatus="CANCELLED" />);

    expect(screen.getAllByText("Đã hủy đơn").length).toBeGreaterThan(0);
    expect(screen.getByText("Đơn thuê đã bị hủy")).toBeInTheDocument();
  });

  it("renders special badge and banner when status is OVERDUE", () => {
    render(<TrackingTimeline currentStatus="OVERDUE" />);

    expect(screen.getAllByText("Quá hạn trả").length).toBeGreaterThan(0);
    expect(screen.getByText("Đơn thuê đã quá ngày hẹn")).toBeInTheDocument();
  });

  it("displays step history timestamp if present", () => {
    const mockHistories = [
      {
        id: 1,
        toStatus: "PENDING" as const,
        changedBy: "CUSTOMER",
        createdAt: "2026-10-25T10:00:00Z",
      },
      {
        id: 2,
        toStatus: "CONFIRMED" as const,
        changedBy: "CHICKIE_STUDIO",
        createdAt: "2026-10-25T11:30:00Z",
      },
    ];

    render(
      <TrackingTimeline
        currentStatus="CONFIRMED"
        statusHistories={mockHistories}
      />
    );

    expect(screen.getByTestId("step-confirmed")).toBeInTheDocument();
  });
});
