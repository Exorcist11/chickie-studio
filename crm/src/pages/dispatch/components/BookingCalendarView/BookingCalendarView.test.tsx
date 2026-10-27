import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import dayjs from "dayjs";
import { BookingCalendarView } from "./BookingCalendarView";
import { CalendarBookingDto } from "../../../../types/dispatch";
import "../../../../i18n";

const mockBookings: CalendarBookingDto[] = [
  {
    id: 1,
    bookingCode: "BOK-001",
    customerName: "Nguyễn Văn A",
    customerPhone: "0901234567",
    status: "CONFIRMED",
    rentalStartDate: "2026-10-15",
    rentalEndDate: "2026-10-17",
    totalRentalPrice: 500000,
    totalDepositPrice: 1000000,
    totalAmount: 1500000,
    itemCount: 1,
    items: [
      {
        bookingItemId: 101,
        barcode: "AO-DAI-01",
        productName: "Áo dài truyền thống",
        variantInfo: "Size M / Đỏ",
        rentalPrice: 500000,
      },
    ],
  },
  {
    id: 2,
    bookingCode: "BOK-002",
    customerName: "Trần Thị B",
    customerPhone: "0907654321",
    status: "PENDING",
    rentalStartDate: "2026-10-15",
    rentalEndDate: "2026-10-15",
    totalRentalPrice: 300000,
    totalDepositPrice: 500000,
    totalAmount: 800000,
    itemCount: 1,
    items: [],
  },
  {
    id: 3,
    bookingCode: "BOK-003",
    customerName: "Lê Văn C",
    customerPhone: "0901112222",
    status: "DEPOSITED",
    rentalStartDate: "2026-10-15",
    rentalEndDate: "2026-10-15",
    totalRentalPrice: 400000,
    totalDepositPrice: 600000,
    totalAmount: 1000000,
    itemCount: 1,
    items: [],
  },
  {
    id: 4,
    bookingCode: "BOK-004",
    customerName: "Phạm Thị D",
    customerPhone: "0903334444",
    status: "DELIVERED",
    rentalStartDate: "2026-10-15",
    rentalEndDate: "2026-10-15",
    totalRentalPrice: 700000,
    totalDepositPrice: 1000000,
    totalAmount: 1700000,
    itemCount: 1,
    items: [],
  },
];

describe("BookingCalendarView Component", () => {
  const testMonth = dayjs("2026-10-01");

  it("renders calendar days and weekday headers", () => {
    render(
      <BookingCalendarView
        currentDate={testMonth}
        bookings={[]}
        isLoading={false}
        onSelectBooking={vi.fn()}
      />
    );

    // Should render cell for 2026-10-15
    expect(screen.getByTestId("calendar-cell-2026-10-15")).toBeInTheDocument();
  });

  it("displays booking chips and handles onSelectBooking click", () => {
    const handleSelect = vi.fn();
    render(
      <BookingCalendarView
        currentDate={testMonth}
        bookings={mockBookings}
        isLoading={false}
        onSelectBooking={handleSelect}
      />
    );

    // Bookings on 2026-10-15: BOK-001, BOK-002, BOK-003, and +1 khác
    const bokChips = screen.getAllByText("BOK-001");
    expect(bokChips.length).toBeGreaterThan(0);
    expect(screen.getAllByText("Nguyễn Văn A")[0]).toBeInTheDocument();

    const chip = bokChips[0].closest("button");
    expect(chip).not.toBeNull();
    fireEvent.click(chip!);

    expect(handleSelect).toHaveBeenCalledWith(mockBookings[0]);
  });

  it("displays +N khác when bookings exceed max visible", () => {
    const handleSelect = vi.fn();
    render(
      <BookingCalendarView
        currentDate={testMonth}
        bookings={mockBookings}
        isLoading={false}
        onSelectBooking={handleSelect}
      />
    );

    // 4 bookings on Oct 15 -> 3 visible, 1 hidden
    const moreBtn = screen.getByText("+1 đơn khác");
    expect(moreBtn).toBeInTheDocument();

    fireEvent.click(moreBtn);
    expect(handleSelect).toHaveBeenCalledWith(mockBookings[3]);
  });

  it("displays spinner during loading state", () => {
    render(
      <BookingCalendarView
        currentDate={testMonth}
        bookings={[]}
        isLoading={true}
        onSelectBooking={vi.fn()}
      />
    );

    expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();
  });
});
