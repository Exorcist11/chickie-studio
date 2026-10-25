import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TrackingClientPage } from "./TrackingClientPage";
import * as bookingApi from "@/lib/api/booking";
import { BookingResponse } from "@/types/booking";

// Mock next/navigation
const mockSearchParams = new Map<string, string>();
vi.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: (key: string) => mockSearchParams.get(key) || null,
  }),
}));

// Mock next-intl
vi.mock("next-intl", () => ({
  useTranslations: (ns?: string) => (key: string, params?: Record<string, unknown>) => {
    if (ns === "tracking.form") {
      const formTranslations: Record<string, string> = {
        bookingCodeLabel: "Mã đơn thuê",
        bookingCodePlaceholder: "Ví dụ: BK20261025-XXXX",
        bookingCodeHelp: "Mã đơn được gửi trong biên nhận",
        phoneLabel: "Số điện thoại đặt đồ",
        phonePlaceholder: "Ví dụ: 0987654321",
        phoneHelp: "Số điện thoại chính xác",
        submitButton: "Tra cứu đơn hàng",
        submitting: "Đang tra cứu...",
        errorNotFound: "Không tìm thấy đơn đặt thuê phù hợp",
      };
      return formTranslations[key] || key;
    }

    if (ns === "tracking.faq") {
      const faqTranslations: Record<string, string> = {
        title: "Câu hỏi thường gặp khi tra cứu",
        q1: "Nếu tôi quên mã đơn thì phải làm sao?",
        a1: "Kiểm tra lại tin nhắn Zalo/SMS",
        q2: "Khi nào thì đơn đặt thuê được duyệt chính thức?",
        a2: "Sau khi nhận được tiền cọc giữ đồ",
        q3: "Tôi có thể đổi ngày hoặc đổi size trang phục không?",
        a3: "Có thể đổi trước 2 ngày",
      };
      return faqTranslations[key] || key;
    }

    const baseTranslations: Record<string, string> = {
      title: "Tra Cứu Đơn Thuê Đồ",
      subtitle: "Kiểm tra tiến độ đơn hàng",
      breadcrumb: "Tra cứu đơn hàng",
    };
    return baseTranslations[key] || key;
  },
}));

// Mock Header & Footer
vi.mock("@/components/ui", () => ({
  Header: () => <header data-testid="mock-header">Header</header>,
  Footer: () => <footer data-testid="mock-footer">Footer</footer>,
}));

describe("TrackingClientPage", () => {
  const mockBookingResponse: BookingResponse = {
    id: 1,
    bookingCode: "BK20261025-1234",
    customerName: "Nguyễn Thu Thảo",
    customerPhone: "0909999999",
    deliveryMethod: "PICKUP_STORE",
    rentalStartDate: "2026-11-05",
    rentalEndDate: "2026-11-07",
    durationDays: 3,
    status: "CONFIRMED",
    totalRentalPrice: 450000,
    totalDepositPrice: 500000,
    totalAmount: 950000,
    createdAt: "2026-10-25T10:00:00Z",
    items: [
      {
        id: 101,
        variantId: 1,
        productName: "Áo Dài Lụa Hà Đông",
        variantSize: "M",
        rentalStartDate: "2026-11-05",
        rentalEndDate: "2026-11-07",
        rentalPrice: 450000,
        depositPrice: 500000,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams.clear();
  });

  it("renders page header, title, search form, and FAQ initial state", () => {
    render(<TrackingClientPage />);

    expect(screen.getByText("Tra Cứu Đơn Thuê Đồ")).toBeInTheDocument();
    expect(screen.getByTestId("tracking-search-form")).toBeInTheDocument();
    expect(
      screen.getByText("Câu hỏi thường gặp khi tra cứu")
    ).toBeInTheDocument();
  });

  it("submits search form and displays order timeline and details", async () => {
    const user = userEvent.setup();
    vi.spyOn(bookingApi, "trackBooking").mockResolvedValueOnce(
      mockBookingResponse
    );

    render(<TrackingClientPage />);

    const codeInput = screen.getByTestId("input-booking-code");
    const phoneInput = screen.getByTestId("input-phone");
    const submitBtn = screen.getByTestId("btn-submit-tracking");

    await user.type(codeInput, "BK20261025-1234");
    await user.type(phoneInput, "0909999999");
    await user.click(submitBtn);

    await waitFor(() => {
      expect(bookingApi.trackBooking).toHaveBeenCalledWith({
        bookingCode: "BK20261025-1234",
        phone: "0909999999",
      });
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("tracking-result-section")
      ).toBeInTheDocument();
      expect(screen.getByTestId("tracking-timeline")).toBeInTheDocument();
      expect(screen.getByTestId("tracking-order-card")).toBeInTheDocument();
    });
  });

  it("displays error alert when tracking fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(bookingApi, "trackBooking").mockRejectedValueOnce(
      new Error("Không tìm thấy đơn đặt thuê phù hợp")
    );

    render(<TrackingClientPage />);

    const codeInput = screen.getByTestId("input-booking-code");
    const phoneInput = screen.getByTestId("input-phone");
    const submitBtn = screen.getByTestId("btn-submit-tracking");

    await user.type(codeInput, "BK-INVALID");
    await user.type(phoneInput, "0900000000");
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByTestId("tracking-error-alert")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Không tìm thấy đơn đặt thuê phù hợp")
      ).toBeInTheDocument();
    });
  });
});
