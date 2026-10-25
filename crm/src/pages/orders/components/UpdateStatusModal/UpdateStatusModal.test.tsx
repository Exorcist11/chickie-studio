import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { UpdateStatusModal } from "./UpdateStatusModal";
import { BookingResponse } from "../../../../types/booking";
import "../../../../i18n";

describe("UpdateStatusModal", () => {
  const sampleBooking: BookingResponse = {
    id: 1,
    bookingCode: "BK20261025-ABCD",
    customerName: "Trần Thu Hà",
    customerPhone: "0987654321",
    deliveryMethod: "PICKUP_STORE",
    rentalStartDate: "2026-10-27",
    rentalEndDate: "2026-10-28",
    durationDays: 2,
    status: "PENDING",
    totalRentalPrice: 300000,
    totalDepositPrice: 500000,
    totalAmount: 800000,
    createdAt: "2026-10-25T10:00:00",
    items: [],
  };

  it("renders status transition confirmation and calls onConfirm", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    render(
      <UpdateStatusModal
        open={true}
        booking={sampleBooking}
        targetStatus="CONFIRMED"
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText("BK20261025-ABCD")).toBeInTheDocument();

    const noteInput = screen.getByPlaceholderText(/Nhập ghi chú/i);
    fireEvent.change(noteInput, { target: { value: "Đã gọi xác nhận" } });

    const confirmBtn = screen.getByRole("button", { name: /Xác nhận|Confirm/i });
    fireEvent.click(confirmBtn);

    expect(onConfirm).toHaveBeenCalledWith({
      status: "CONFIRMED",
      note: "Đã gọi xác nhận",
    });
  });

  it("requires note when targetStatus is CANCELLED", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);

    render(
      <UpdateStatusModal
        open={true}
        booking={sampleBooking}
        targetStatus="CANCELLED"
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />
    );

    // Click confirm without note
    const confirmBtn = screen.getByRole("button", { name: /Xác nhận|Confirm/i });
    fireEvent.click(confirmBtn);

    expect(screen.getByText(/Vui lòng nhập lý do khi hủy đơn thuê/i)).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();

    // Now enter note
    const noteInput = screen.getByPlaceholderText(/Nhập ghi chú/i);
    fireEvent.change(noteInput, { target: { value: "Khách bận việc gia đình" } });
    fireEvent.click(confirmBtn);

    expect(onConfirm).toHaveBeenCalledWith({
      status: "CANCELLED",
      note: "Khách bận việc gia đình",
    });
  });

  it("returns null when booking or targetStatus is null", () => {
    const { container } = render(
      <UpdateStatusModal
        open={true}
        booking={null}
        targetStatus={null}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });
});
