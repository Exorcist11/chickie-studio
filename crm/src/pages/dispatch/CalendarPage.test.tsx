import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { CalendarPage } from "./CalendarPage";
import { dispatchService } from "../../services/dispatch.service";
import "../../i18n";

vi.mock("../../services/dispatch.service", () => ({
  dispatchService: {
    getCalendarData: vi.fn(),
    getTimelineData: vi.fn(),
    getAvailableReplacements: vi.fn(),
    reassignItem: vi.fn(),
    rescheduleBooking: vi.fn(),
  },
}));

describe("CalendarPage Integration", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();

    vi.mocked(dispatchService.getCalendarData).mockResolvedValue({
      startDate: "2026-10-01",
      endDate: "2026-10-31",
      totalBookings: 1,
      bookings: [
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
      ],
    });

    vi.mocked(dispatchService.getTimelineData).mockResolvedValue({
      startDate: "2026-10-01",
      endDate: "2026-10-31",
      resources: [
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
              bookingItemId: 101,
              bookingCode: "BOK-001",
              customerName: "Nguyễn Văn A",
              customerPhone: "0901234567",
              startDate: "2026-10-15",
              endDate: "2026-10-17",
              bufferEndDate: "2026-10-18",
              bufferDays: 1,
              status: "CONFIRMED",
              rentalPrice: 500000,
              depositPrice: 1000000,
            },
          ],
        },
      ],
    });
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <CalendarPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it("renders page title and switches between calendar and timeline views", async () => {
    renderComponent();

    expect(screen.getByText("Lịch Thuê & Điều Phối Kho Đồ")).toBeInTheDocument();
    expect(screen.getByText("Lịch Đơn Thuê")).toBeInTheDocument();
    expect(screen.getByText("Timeline Kho Đồ")).toBeInTheDocument();

    // Verify calendar view is active initially
    await waitFor(() => {
      expect(screen.getAllByText("BOK-001")[0]).toBeInTheDocument();
    });

    // Switch to Timeline view
    const timelineBtn = screen.getByText("Timeline Kho Đồ").closest("button");
    fireEvent.click(timelineBtn!);

    await waitFor(() => {
      expect(dispatchService.getTimelineData).toHaveBeenCalled();
      expect(screen.getByText("AO-DAI-01")).toBeInTheDocument();
    });
  });

  it("navigates months using Prev, Next and Today buttons", async () => {
    renderComponent();

    const nextBtn = screen.getByLabelText("Tháng sau");
    fireEvent.click(nextBtn);

    const prevBtn = screen.getByLabelText("Tháng trước");
    fireEvent.click(prevBtn);

    const todayBtn = screen.getByText("Hôm nay");
    fireEvent.click(todayBtn);

    expect(dispatchService.getCalendarData).toHaveBeenCalled();
  });

  it("opens booking detail modal when clicking a booking chip", async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getAllByText("BOK-001")[0]).toBeInTheDocument();
    });

    const chip = screen.getAllByText("BOK-001")[0].closest("button");
    fireEvent.click(chip!);

    expect(screen.getByText("Chi tiết đơn: BOK-001")).toBeInTheDocument();
    expect(screen.getAllByText("Nguyễn Văn A").length).toBeGreaterThan(0);
  });
});
