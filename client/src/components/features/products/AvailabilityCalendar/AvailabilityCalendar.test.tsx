import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import * as productApi from "@/lib/api/product";

describe("AvailabilityCalendar", () => {
  const mockAvailability = {
    productId: 1,
    slug: "vay-da-hoi-kim-sa-do",
    productName: "Váy Dạ Hội Kim Sa Đỏ",
    variantId: 101,
    variantName: "S - Đỏ",
    month: "2026-11",
    totalItems: 3,
    availableItems: 2,
    bufferDays: 1,
    days: [
      { date: "2026-11-01", available: true, remainingCount: 2, reason: "AVAILABLE" },
      { date: "2026-11-02", available: true, remainingCount: 2, reason: "AVAILABLE" },
      { date: "2026-11-03", available: false, remainingCount: 0, reason: "FULLY_BOOKED" },
      { date: "2026-11-04", available: true, remainingCount: 1, reason: "AVAILABLE" },
    ],
  };

  beforeEach(() => {
    vi.spyOn(productApi, "getPublicProductAvailability").mockResolvedValue(mockAvailability as any);
  });

  it("renders calendar grid and header", async () => {
    render(
      <AvailabilityCalendar
        slug="vay-da-hoi-kim-sa-do"
        variantId={101}
        initialMonth="2026-11"
      />
    );

    expect(screen.getByText("T2")).toBeInTheDocument();
    expect(screen.getByText("CN")).toBeInTheDocument();
    expect(screen.getByText("Còn đồ sẵn sàng")).toBeInTheDocument();
  });

  it("allows selecting start date and end date", async () => {
    const user = userEvent.setup();
    const handleRangeChange = vi.fn();

    render(
      <AvailabilityCalendar
        slug="vay-da-hoi-kim-sa-do"
        variantId={101}
        initialMonth="2026-11"
        onDateRangeChange={handleRangeChange}
      />
    );

    // Wait for availability data
    await waitFor(() => {
      expect(screen.getByTestId("calendar-day-2026-11-01")).toBeInTheDocument();
    });

    const day1 = screen.getByTestId("calendar-day-2026-11-01");
    const day2 = screen.getByTestId("calendar-day-2026-11-02");

    await user.click(day1);
    await user.click(day2);

    expect(handleRangeChange).toHaveBeenCalledWith("2026-11-01", "2026-11-02");
  });

  it("cannot click on fully booked dates", async () => {
    const user = userEvent.setup();
    const handleRangeChange = vi.fn();

    render(
      <AvailabilityCalendar
        slug="vay-da-hoi-kim-sa-do"
        variantId={101}
        initialMonth="2026-11"
        onDateRangeChange={handleRangeChange}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("calendar-day-2026-11-03")).toBeInTheDocument();
    });

    const day3 = screen.getByTestId("calendar-day-2026-11-03");
    expect(day3).toBeDisabled();

    await user.click(day3);
    expect(handleRangeChange).not.toHaveBeenCalled();
  });

  it("resets selection when clicking 'Chọn lại'", async () => {
    const user = userEvent.setup();

    render(
      <AvailabilityCalendar
        slug="vay-da-hoi-kim-sa-do"
        variantId={101}
        initialMonth="2026-11"
        startDate="2026-11-01"
        endDate="2026-11-02"
      />
    );

    expect(screen.getByText("Chọn lại")).toBeInTheDocument();
    await user.click(screen.getByText("Chọn lại"));

    expect(screen.queryByText("Khoảng thuê:")).not.toBeInTheDocument();
  });

  it("navigates next month and previous month", async () => {
    const user = userEvent.setup();

    render(
      <AvailabilityCalendar
        slug="vay-da-hoi-kim-sa-do"
        variantId={101}
        initialMonth="2026-11"
      />
    );

    const nextBtn = screen.getByRole("button", { name: "Tháng sau" });
    await user.click(nextBtn);

    expect(screen.getByText(/Tháng 12 \/ 2026/)).toBeInTheDocument();

    const prevBtn = screen.getByRole("button", { name: "Tháng trước" });
    await user.click(prevBtn);

    expect(screen.getByText(/Tháng 11 \/ 2026/)).toBeInTheDocument();
  });

  it("handles hover states on available days", async () => {
    const user = userEvent.setup();

    render(
      <AvailabilityCalendar
        slug="vay-da-hoi-kim-sa-do"
        variantId={101}
        initialMonth="2026-11"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("calendar-day-2026-11-01")).toBeInTheDocument();
    });

    const day1 = screen.getByTestId("calendar-day-2026-11-01");
    await user.hover(day1);
    await user.unhover(day1);
  });

  it("renders appropriate pillar badge and avoids showing 'Đệm giặt' for CAMERA and PHOTOGRAPHY", async () => {
    // 1. Costume renders laundering buffer
    const { rerender } = render(
      <AvailabilityCalendar
        slug="vay-da-hoi-kim-sa-do"
        pillar="COSTUME"
        initialMonth="2026-11"
      />
    );
    await waitFor(() => {
      expect(screen.getByText(/Đệm giặt 1 ngày/)).toBeInTheDocument();
    });

    // 2. Camera renders inspection badge, not laundering
    rerender(
      <AvailabilityCalendar
        slug="canon-eos-r50"
        pillar="CAMERA"
        initialMonth="2026-11"
      />
    );
    expect(screen.getByText("Kiểm tra máy sẵn sàng")).toBeInTheDocument();
    expect(screen.queryByText(/Đệm giặt/)).not.toBeInTheDocument();

    // 3. Photography renders dedicated session badge, not laundering
    rerender(
      <AvailabilityCalendar
        slug="goi-chup-anh-sen"
        pillar="PHOTOGRAPHY"
        initialMonth="2026-11"
      />
    );
    expect(screen.getByText("Ca chụp độc quyền")).toBeInTheDocument();
    expect(screen.queryByText(/Đệm giặt/)).not.toBeInTheDocument();
  });

  it("highlights in-between dates when a date range is selected", async () => {
    render(
      <AvailabilityCalendar
        slug="vay-da-hoi-kim-sa-do"
        initialMonth="2026-11"
        startDate="2026-11-01"
        endDate="2026-11-04"
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId("calendar-day-2026-11-01")).toBeInTheDocument();
    });

    const day1 = screen.getByTestId("calendar-day-2026-11-01");
    const day2 = screen.getByTestId("calendar-day-2026-11-02");
    const day4 = screen.getByTestId("calendar-day-2026-11-04");

    // Start day has 'Nhận'
    expect(day1).toHaveTextContent("Nhận");
    // End day has 'Trả'
    expect(day4).toHaveTextContent("Trả");
    // In-between day has ribbon highlight class
    expect(day2.className).toContain("bg-[#F8ECEE]");
  });

  it("passes accessibility checks", async () => {
    const { container } = render(
      <AvailabilityCalendar
        slug="vay-da-hoi-kim-sa-do"
        variantId={101}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("T2")).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
