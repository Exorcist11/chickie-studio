import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BookingDetailModal } from "./BookingDetailModal";
import { BookingResponse } from "../../../../types/booking";
import "../../../../i18n";

describe("BookingDetailModal", () => {
  const sampleBooking: BookingResponse = {
    id: 1,
    bookingCode: "BK20261025-ABCD",
    customerName: "Trần Thu Hà",
    customerPhone: "0987654321",
    deliveryMethod: "PICKUP_STORE",
    deliveryAddress: null,
    rentalStartDate: "2026-10-27",
    rentalEndDate: "2026-10-28",
    durationDays: 2,
    status: "PENDING",
    totalRentalPrice: 300000,
    totalDepositPrice: 500000,
    totalAmount: 800000,
    note: "Khách cần lấy đồ trước 9h sáng",
    createdAt: "2026-10-25T10:00:00",
    items: [
      {
        id: 10,
        productItemId: 100,
        productItemCode: "CK-DR-001-S-RED-01",
        productName: "Váy Dạ Hội Ruby",
        variantSize: "S",
        variantColor: "Đỏ Ruby",
        rentalStartDate: "2026-10-27",
        rentalEndDate: "2026-10-28",
        rentalPrice: 300000,
        depositPrice: 500000,
      },
    ],
    statusHistories: [
      {
        id: 1,
        fromStatus: null,
        toStatus: "PENDING",
        changedBy: "CUSTOMER",
        note: "Đặt trực tuyến",
        createdAt: "2026-10-25T10:00:00",
      },
    ],
  };

  it("renders booking details, items, timeline and actions", () => {
    const onRequestStatusChange = vi.fn();
    const onClose = vi.fn();

    render(
      <BookingDetailModal
        open={true}
        booking={sampleBooking}
        onClose={onClose}
        onRequestStatusChange={onRequestStatusChange}
      />
    );

    // Code & customer
    expect(screen.getByText("BK20261025-ABCD")).toBeInTheDocument();
    expect(screen.getByText("Trần Thu Hà")).toBeInTheDocument();
    expect(screen.getByText("0987654321")).toBeInTheDocument();
    expect(screen.getByText("Khách cần lấy đồ trước 9h sáng")).toBeInTheDocument();

    // Items
    expect(screen.getByText("Váy Dạ Hội Ruby")).toBeInTheDocument();
    expect(screen.getByText("Size S")).toBeInTheDocument();
    expect(screen.getByText("Đỏ Ruby")).toBeInTheDocument();
    expect(screen.getByText(/CK-DR-001-S-RED-01/)).toBeInTheDocument();

    // Audit trail
    expect(screen.getByText(/CUSTOMER/)).toBeInTheDocument();
    expect(screen.getByText(/"Đặt trực tuyến"/)).toBeInTheDocument();

    // Actions for PENDING: approve & cancel
    const approveBtn = screen.getByRole("button", { name: /Duyệt đơn|Confirm/i });
    expect(approveBtn).toBeInTheDocument();
    fireEvent.click(approveBtn);
    expect(onRequestStatusChange).toHaveBeenCalledWith("CONFIRMED");

    const cancelBtn = screen.getByRole("button", { name: /Hủy đơn|Cancel Order/i });
    fireEvent.click(cancelBtn);
    expect(onRequestStatusChange).toHaveBeenCalledWith("CANCELLED");
  });

  it("returns null when booking is null", () => {
    const { container } = render(
      <BookingDetailModal
        open={true}
        booking={null}
        onClose={vi.fn()}
        onRequestStatusChange={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("triggers clipboard copy on booking code", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    render(
      <BookingDetailModal
        open={true}
        booking={sampleBooking}
        onClose={vi.fn()}
        onRequestStatusChange={vi.fn()}
      />
    );

    const copyBtn = screen.getByLabelText("copy-booking-code");
    fireEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("BK20261025-ABCD");
  });
});
