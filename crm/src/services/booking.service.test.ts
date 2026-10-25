import { describe, it, expect, vi, beforeEach } from "vitest";
import { bookingService } from "./booking.service";
import { apiClient } from "./apiClient";
import { BookingResponse, UpdateBookingStatusInput } from "../types/booking";
import { PageResult } from "../types/product";

vi.mock("./apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    patch: vi.fn(),
  },
}));

describe("bookingService", () => {
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
    size: 20,
    number: 0,
    first: true,
    last: true,
    empty: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getBookings calls /api/admin/bookings with formatted params", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      code: 200,
      data: samplePageResult,
      message: "Success",
      timestamp: "2026-10-25T10:00:00Z",
    });

    const result = await bookingService.getBookings({
      status: "PENDING",
      search: "Trần",
      todayDeliver: true,
      todayReturn: false,
      overdue: false,
      page: 0,
      size: 10,
      sort: "createdAt,desc",
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      expect.stringContaining("/api/admin/bookings?")
    );
    expect(apiClient.get).toHaveBeenCalledWith(
      expect.stringContaining("status=PENDING")
    );
    expect(apiClient.get).toHaveBeenCalledWith(
      expect.stringContaining("search=Tr%E1%BA%A7n")
    );
    expect(apiClient.get).toHaveBeenCalledWith(
      expect.stringContaining("todayDeliver=true")
    );
    expect(result.content).toHaveLength(1);
    expect(result.content[0].bookingCode).toBe("BK20261025-ABCD");
  });

  it("getBookings without params calls endpoint directly", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      code: 200,
      data: samplePageResult,
      message: "Success",
      timestamp: "2026-10-25T10:00:00Z",
    });

    const result = await bookingService.getBookings();
    expect(apiClient.get).toHaveBeenCalledWith("/api/admin/bookings");
    expect(result.totalElements).toBe(1);
  });

  it("getBookingById calls /api/admin/bookings/{id}", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      code: 200,
      data: sampleBooking,
      message: "Success",
      timestamp: "2026-10-25T10:00:00Z",
    });

    const result = await bookingService.getBookingById(1);
    expect(apiClient.get).toHaveBeenCalledWith("/api/admin/bookings/1");
    expect(result.id).toBe(1);
    expect(result.customerName).toBe("Trần Thu Hà");
  });

  it("updateBookingStatus calls PATCH /api/admin/bookings/{id}/status", async () => {
    const updatedBooking = { ...sampleBooking, status: "CONFIRMED" as const };
    vi.mocked(apiClient.patch).mockResolvedValueOnce({
      code: 200,
      data: updatedBooking,
      message: "Success",
      timestamp: "2026-10-25T10:00:00Z",
    });

    const input: UpdateBookingStatusInput = {
      status: "CONFIRMED",
      note: "Đã liên hệ khách",
    };

    const result = await bookingService.updateBookingStatus(1, input);
    expect(apiClient.patch).toHaveBeenCalledWith(
      "/api/admin/bookings/1/status",
      input
    );
    expect(result.status).toBe("CONFIRMED");
  });
});
