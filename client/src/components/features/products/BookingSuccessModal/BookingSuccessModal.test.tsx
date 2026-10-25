import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { BookingSuccessModal } from "./BookingSuccessModal";
import { BookingResponse } from "@/types/booking";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

const mockBooking: BookingResponse = {
  id: 1,
  bookingCode: "BK20261025-MODAL",
  customerName: "Nguyễn Dũng",
  customerPhone: "0919362514",
  deliveryMethod: "PICKUP_STORE",
  rentalStartDate: "2026-12-30",
  rentalEndDate: "2026-12-31",
  durationDays: 1,
  status: "PENDING",
  totalRentalPrice: 270000,
  totalDepositPrice: 1800000,
  totalAmount: 2070000,
  createdAt: "2026-10-25T08:00:00Z",
  items: [
    {
      id: 10,
      variantId: 701,
      productName: "Combo Máy ảnh Sony A6400 kèm lens",
      rentalStartDate: "2026-12-30",
      rentalEndDate: "2026-12-31",
      rentalPrice: 270000,
      depositPrice: 1800000,
    },
  ],
};

describe("BookingSuccessModal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false or booking is null", () => {
    const { rerender } = render(
      <BookingSuccessModal
        isOpen={false}
        onClose={vi.fn()}
        booking={mockBooking}
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(
      <BookingSuccessModal
        isOpen={true}
        onClose={vi.fn()}
        booking={null}
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders booking details, customer, pricing and bank transfer info", () => {
    render(
      <BookingSuccessModal
        isOpen={true}
        onClose={vi.fn()}
        booking={mockBooking}
        productName="Combo Máy ảnh Sony A6400 kèm lens"
        pillar="CAMERA"
      />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Đặt Thuê Thiết Bị Thành Công!" })
    ).toBeInTheDocument();
    expect(screen.getByText("BK20261025-MODAL")).toBeInTheDocument();
    expect(screen.getByText("Nguyễn Dũng - 0919362514")).toBeInTheDocument();
    expect(screen.getByText("1.800.000đ")).toBeInTheDocument();
    expect(screen.getByText("9999 8888 6666")).toBeInTheDocument();
    expect(screen.getByAltText("Mã QR chuyển khoản cọc giữ đồ")).toBeInTheDocument();
  });

  it("calls onClose when clicking close button or pressing Escape", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <BookingSuccessModal
        isOpen={true}
        onClose={handleClose}
        booking={mockBooking}
      />
    );

    const closeBtn = screen.getByRole("button", { name: "Close" });
    await user.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    await user.keyboard("{Escape}");
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it("navigates to invoice receipt page and closes modal when clicking 'Xem hóa đơn chi tiết'", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(
      <BookingSuccessModal
        isOpen={true}
        onClose={handleClose}
        booking={mockBooking}
      />
    );

    const viewReceiptBtn = screen.getByRole("button", {
      name: /Xem hóa đơn chi tiết/i,
    });
    await user.click(viewReceiptBtn);

    expect(handleClose).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith("/booking/success/BK20261025-MODAL");
  });

  it("copies booking code, bank account and transfer note to clipboard", async () => {
    const user = userEvent.setup();
    const writeTextSpy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue();

    render(
      <BookingSuccessModal
        isOpen={true}
        onClose={vi.fn()}
        booking={mockBooking}
      />
    );

    const copyCodeBtn = screen.getByTitle("Sao chép mã");
    await user.click(copyCodeBtn);
    expect(writeTextSpy).toHaveBeenCalledWith("BK20261025-MODAL");

    const copyBankBtn = screen.getByRole("button", {
      name: "Sao chép số tài khoản",
    });
    await user.click(copyBankBtn);
    expect(writeTextSpy).toHaveBeenCalledWith("999988886666");

    const copyNoteBtn = screen.getByTitle("Sao chép nội dung chuyển khoản");
    await user.click(copyNoteBtn);
    expect(writeTextSpy).toHaveBeenCalledWith("BK20261025-MODAL 0919362514");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <BookingSuccessModal
        isOpen={true}
        onClose={vi.fn()}
        booking={mockBooking}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
