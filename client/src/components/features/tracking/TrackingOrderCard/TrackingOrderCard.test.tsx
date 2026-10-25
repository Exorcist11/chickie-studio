import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TrackingOrderCard } from "./TrackingOrderCard";
import { BookingResponse } from "@/types/booking";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    const translations: Record<string, string> = {
      orderInfo: "Thông tin đơn thuê",
      createdAt: "Ngày đặt",
      copyCode: "Sao chép mã",
      copied: "Đã chép!",
      pickupStore: "Nhận tại showroom",
      shipAddress: "Giao tận nơi",
      rentalTime: "Thời gian thuê đồ",
      duration: `${params?.days || 0} ngày`,
      itemsTitle: "Trang phục đã chọn",
      pricingTitle: "Chi tiết thanh toán",
      rentalFee: "Tiền thuê",
      depositFee: "Tiền cọc",
      totalAmount: "Tổng chi phí",
      depositStatus: "Tình trạng cọc",
      depositPaid: "Đã thanh toán cọc thành công",
      depositPaidDesc: "Tiệm đã giữ đồ cho bạn",
      depositPending: "Chưa thanh toán cọc",
      depositPendingDesc: "Vui lòng chuyển khoản giữ đồ",
      bankName: "Ngân hàng",
      accountNumber: "Số tài khoản",
      accountOwner: "Chủ tài khoản",
      transferContent: "Nội dung",
      copyContent: "Sao chép nội dung",
      needHelp: "Bạn cần hỗ trợ?",
      helpDesc: "Liên hệ ngay với tiệm",
      chatZalo: "Nhắn tin Zalo",
      callHotline: "Gọi hotline",
    };
    return translations[key] || key;
  },
}));

describe("TrackingOrderCard", () => {
  const mockBooking: BookingResponse = {
    id: 1,
    bookingCode: "BK20261025-9999",
    customerName: "Đỗ Hải Yến",
    customerPhone: "0901234567",
    deliveryMethod: "PICKUP_STORE",
    rentalStartDate: "2026-11-01",
    rentalEndDate: "2026-11-03",
    durationDays: 3,
    status: "PENDING",
    totalRentalPrice: 600000,
    totalDepositPrice: 1000000,
    totalAmount: 1600000,
    createdAt: "2026-10-25T08:00:00Z",
    items: [
      {
        id: 10,
        variantId: 100,
        productName: "Váy Lụa Trắng Cổ Yếm",
        variantSize: "S",
        rentalStartDate: "2026-11-01",
        rentalEndDate: "2026-11-03",
        rentalPrice: 600000,
        depositPrice: 1000000,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it("renders order code, customer name, and item details", () => {
    render(<TrackingOrderCard booking={mockBooking} />);

    expect(screen.getAllByText("BK20261025-9999").length).toBeGreaterThan(0);
    expect(screen.getByText("Đỗ Hải Yến")).toBeInTheDocument();
    expect(screen.getByText("Váy Lụa Trắng Cổ Yếm")).toBeInTheDocument();
    expect(screen.getByText("Nhận tại showroom")).toBeInTheDocument();
  });

  it("shows VietQR transfer info when deposit is not yet paid (PENDING)", () => {
    render(<TrackingOrderCard booking={mockBooking} />);

    expect(screen.getByText("Chưa thanh toán cọc")).toBeInTheDocument();
    expect(screen.getByText("0987654321")).toBeInTheDocument();
    expect(screen.getByText("CHICKIE STUDIO")).toBeInTheDocument();
  });

  it("shows deposit paid badge when status is DEPOSITED", () => {
    const depositedBooking: BookingResponse = {
      ...mockBooking,
      status: "DEPOSITED",
    };

    render(<TrackingOrderCard booking={depositedBooking} />);

    expect(
      screen.getByText("Đã thanh toán cọc thành công")
    ).toBeInTheDocument();
    expect(screen.queryByText("Chưa thanh toán cọc")).not.toBeInTheDocument();
  });

  it("copies booking code to clipboard when clicking copy button", async () => {
    render(<TrackingOrderCard booking={mockBooking} />);

    const copyBtn = screen.getByTestId("btn-copy-code");
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        "BK20261025-9999"
      );
      expect(screen.getByText("Đã chép!")).toBeInTheDocument();
    });
  });
});
