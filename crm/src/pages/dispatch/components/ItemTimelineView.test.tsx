import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import dayjs from "dayjs";
import { ItemTimelineView } from "./ItemTimelineView";
import { TimelineResourceDto } from "../../../types/dispatch";
import "../../../i18n";

const mockResources: TimelineResourceDto[] = [
  {
    itemId: 101,
    barcode: "AO-DAI-01",
    productName: "Áo dài truyền thống",
    variantInfo: "Size M / Đỏ",
    categoryType: "COSTUME",
    itemStatus: "RENTED",
    events: [
      {
        bookingId: 1,
        bookingItemId: 1001,
        bookingCode: "BOK-001",
        customerName: "Nguyễn Văn A",
        customerPhone: "0901234567",
        startDate: "2026-10-10",
        endDate: "2026-10-12",
        bufferEndDate: "2026-10-13",
        bufferDays: 1,
        status: "CONFIRMED",
        rentalPrice: 500000,
        depositPrice: 1000000,
      },
    ],
  },
];

describe("ItemTimelineView Component", () => {
  const testMonth = dayjs("2026-10-01");

  it("renders timeline days header and resource row", () => {
    render(
      <ItemTimelineView
        currentDate={testMonth}
        resources={mockResources}
        isLoading={false}
        onSelectEvent={vi.fn()}
      />
    );

    expect(screen.getByTestId("timeline-header-2026-10-01")).toBeInTheDocument();
    expect(screen.getByTestId("timeline-header-2026-10-31")).toBeInTheDocument();
    expect(screen.getByText("AO-DAI-01")).toBeInTheDocument();
    expect(screen.getByText("Áo dài truyền thống")).toBeInTheDocument();
  });

  it("renders event bar and laundry buffer for costume", () => {
    const handleSelectEvent = vi.fn();
    render(
      <ItemTimelineView
        currentDate={testMonth}
        resources={mockResources}
        isLoading={false}
        onSelectEvent={handleSelectEvent}
      />
    );

    // Rental Event
    const eventBtn = screen.getByText("BOK-001").closest("button");
    expect(eventBtn).toBeInTheDocument();
    expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();

    fireEvent.click(eventBtn!);
    expect(handleSelectEvent).toHaveBeenCalledWith(mockResources[0].events[0]);

    // Laundry buffer bar
    expect(screen.getByText("Giặt sấy (1d)")).toBeInTheDocument();
  });

  it("renders empty state when resources array is empty", () => {
    render(
      <ItemTimelineView
        currentDate={testMonth}
        resources={[]}
        isLoading={false}
        onSelectEvent={vi.fn()}
      />
    );

    expect(screen.getByText("Không tìm thấy tài nguyên kho đồ phù hợp")).toBeInTheDocument();
  });

  it("renders spinner when loading", () => {
    render(
      <ItemTimelineView
        currentDate={testMonth}
        resources={[]}
        isLoading={true}
        onSelectEvent={vi.fn()}
      />
    );

    expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();
  });
});
