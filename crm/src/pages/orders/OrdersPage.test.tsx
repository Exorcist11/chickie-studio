import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { OrdersPage } from "./OrdersPage";
import { bookingService } from "../../services/booking.service";
import { BookingResponse } from "../../types/booking";
import { PageResult } from "../../types/product";
import "../../i18n";

vi.mock("../../services/booking.service", () => ({
  bookingService: {
    getBookings: vi.fn(),
    getBookingById: vi.fn(),
    updateBookingStatus: vi.fn(),
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, gcTime: 0 },
    mutations: { retry: false },
  },
});

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <OrdersPage />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe("OrdersPage", () => {
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

  const samplePageResult: PageResult<BookingResponse> = {
    content: [sampleBooking],
    totalElements: 1,
    totalPages: 1,
    size: 10,
    number: 0,
    first: true,
    last: true,
    empty: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    vi.mocked(bookingService.getBookings).mockResolvedValue(samplePageResult);
  });

  it("renders page header, stat cards, filter tabs and data table row", async () => {
    renderComponent();

    expect(screen.getByText("Quản Lý Đơn Thuê")).toBeInTheDocument();
    expect(screen.getByText("Tổng đơn thuê")).toBeInTheDocument();
    expect(screen.getByText("Chờ xác nhận")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("BK20261025-ABCD")).toBeInTheDocument();
      expect(screen.getByText("Trần Thu Hà")).toBeInTheDocument();
      expect(screen.getByText("0987654321")).toBeInTheDocument();
    });
  });

  it("switches filter tabs and triggers API with corresponding status", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("BK20261025-ABCD")).toBeInTheDocument();
    });

    const pendingTab = screen.getByRole("button", { name: "Chờ duyệt" });
    fireEvent.click(pendingTab);

    await waitFor(() => {
      expect(bookingService.getBookings).toHaveBeenCalledWith(
        expect.objectContaining({ status: "PENDING" })
      );
    });

    const todayDeliverTab = screen.getByRole("button", { name: "Cần giao hôm nay" });
    fireEvent.click(todayDeliverTab);

    await waitFor(() => {
      expect(bookingService.getBookings).toHaveBeenCalledWith(
        expect.objectContaining({ todayDeliver: true })
      );
    });
  });

  it("opens BookingDetailModal when clicking on booking code", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("BK20261025-ABCD")).toBeInTheDocument();
    });

    const codeBtn = screen.getByText("BK20261025-ABCD");
    fireEvent.click(codeBtn);

    expect(screen.getByText("Thông tin khách hàng")).toBeInTheDocument();
    expect(screen.getByText("Chi tiết trang phục / thiết bị thuê")).toBeInTheDocument();
  });

  it("opens UpdateStatusModal on quick action click and triggers status mutation", async () => {
    vi.mocked(bookingService.updateBookingStatus).mockResolvedValueOnce({
      ...sampleBooking,
      status: "CONFIRMED",
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("BK20261025-ABCD")).toBeInTheDocument();
    });

    const approveBtn = screen.getByRole("button", { name: /Duyệt đơn/i });
    fireEvent.click(approveBtn);

    expect(screen.getByText("Cập nhật trạng thái đơn")).toBeInTheDocument();

    const confirmModalBtn = screen.getByRole("button", { name: "Xác nhận" });
    fireEvent.click(confirmModalBtn);

    await waitFor(() => {
      expect(bookingService.updateBookingStatus).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ status: "CONFIRMED" })
      );
    });
  });

  it("handles search input filtering", async () => {
    renderComponent();

    const searchInput = screen.getByPlaceholderText(
      "Tìm theo mã đơn, số điện thoại, tên khách hàng..."
    );
    fireEvent.change(searchInput, { target: { value: "Thu Hà" } });

    await waitFor(
      () => {
        expect(bookingService.getBookings).toHaveBeenCalledWith(
          expect.objectContaining({ search: "Thu Hà" })
        );
      },
      { timeout: 1000 }
    );
  });
});
