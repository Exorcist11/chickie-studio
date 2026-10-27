import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { BookingDetailModal } from "./BookingDetailModal";
import { CalendarBookingDto } from "../../../../types/dispatch";
import "../../../../i18n";

const mockBooking: CalendarBookingDto = {
  id: 10,
  bookingCode: "BOK-010",
  customerName: "Hoàng Yến",
  customerPhone: "0912345678",
  status: "CONFIRMED",
  rentalStartDate: "2026-10-20",
  rentalEndDate: "2026-10-22",
  totalRentalPrice: 600000,
  totalDepositPrice: 1200000,
  totalAmount: 1800000,
  itemCount: 1,
  items: [
    {
      bookingItemId: 201,
      barcode: "VAY-CUOI-01",
      productName: "Váy cưới đuôi cá",
      variantInfo: "Size S / Trắng",
      rentalPrice: 600000,
    },
  ],
};

describe("BookingDetailModal Component", () => {
  it("renders null when booking is null", () => {
    const { container } = render(
      <BrowserRouter>
        <BookingDetailModal
          isOpen={true}
          onClose={vi.fn()}
          booking={null}
        />
      </BrowserRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders booking information, items and triggers reschedule/reassign", () => {
    const handleClose = vi.fn();
    const handleReschedule = vi.fn();
    const handleReassign = vi.fn();

    render(
      <BrowserRouter>
        <BookingDetailModal
          isOpen={true}
          onClose={handleClose}
          booking={mockBooking}
          onReschedule={handleReschedule}
          onReassign={handleReassign}
        />
      </BrowserRouter>
    );

    expect(screen.getByText("Chi tiết đơn: BOK-010")).toBeInTheDocument();
    expect(screen.getByText("Hoàng Yến")).toBeInTheDocument();
    expect(screen.getByText("0912345678")).toBeInTheDocument();
    expect(screen.getByText("VAY-CUOI-01")).toBeInTheDocument();

    // Click Reassign item
    const reassignBtn = screen.getByText("Điều phối đổi món đồ");
    fireEvent.click(reassignBtn);
    expect(handleReassign).toHaveBeenCalledWith(mockBooking, mockBooking.items[0]);

    // Click Reschedule
    const rescheduleBtn = screen.getByText("Dời ngày thuê");
    fireEvent.click(rescheduleBtn);
    expect(handleReschedule).toHaveBeenCalledWith(mockBooking);

    // Click Close
    const closeBtn = screen.getByText("Đóng");
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});
