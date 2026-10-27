import { describe, it, expect, vi, beforeEach } from "vitest";
import { dispatchService } from "./dispatch.service";
import { apiClient } from "./apiClient";
import {
  AvailableReplacementDto,
  CalendarDispatchResponse,
  ReassignItemRequest,
  ReassignItemResponse,
  RescheduleBookingRequest,
  RescheduleBookingResponse,
  TimelineDispatchResponse,
} from "../types/dispatch";

vi.mock("./apiClient", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("dispatchService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getCalendarData calls /api/admin/dispatch/calendar with params", async () => {
    const mockResponse: CalendarDispatchResponse = {
      startDate: "2026-11-01",
      endDate: "2026-11-30",
      totalBookings: 1,
      bookings: [
        {
          id: 1,
          bookingCode: "BK-001",
          customerName: "Nguyễn Mai Anh",
          customerPhone: "0987654321",
          status: "CONFIRMED",
          rentalStartDate: "2026-11-05",
          rentalEndDate: "2026-11-07",
          totalRentalPrice: 1500000,
          totalDepositPrice: 1000000,
          totalAmount: 2500000,
          itemCount: 1,
          items: [],
        },
      ],
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      code: 200,
      data: mockResponse,
      message: "Success",
      timestamp: "2026-10-27T00:00:00Z",
    });

    const result = await dispatchService.getCalendarData({
      startDate: "2026-11-01",
      endDate: "2026-11-30",
      status: "CONFIRMED",
      search: "Mai Anh",
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/admin/dispatch/calendar?startDate=2026-11-01&endDate=2026-11-30&status=CONFIRMED&search=Mai+Anh"
    );
    expect(result).toEqual(mockResponse);
  });

  it("getCalendarData calls endpoint without query string if params empty", async () => {
    vi.mocked(apiClient.get).mockResolvedValueOnce({
      code: 200,
      data: { startDate: "2026-11-01", endDate: "2026-11-30", totalBookings: 0, bookings: [] },
      message: "Success",
      timestamp: "2026-10-27T00:00:00Z",
    });

    await dispatchService.getCalendarData();

    expect(apiClient.get).toHaveBeenCalledWith("/api/admin/dispatch/calendar");
  });

  it("getTimelineData calls /api/admin/dispatch/timeline with params", async () => {
    const mockResponse: TimelineDispatchResponse = {
      startDate: "2026-11-01",
      endDate: "2026-11-30",
      resources: [],
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      code: 200,
      data: mockResponse,
      message: "Success",
      timestamp: "2026-10-27T00:00:00Z",
    });

    const result = await dispatchService.getTimelineData({
      startDate: "2026-11-01",
      endDate: "2026-11-30",
      categoryId: 1,
      search: "CK-DR",
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/admin/dispatch/timeline?startDate=2026-11-01&endDate=2026-11-30&categoryId=1&search=CK-DR"
    );
    expect(result).toEqual(mockResponse);
  });

  it("getAvailableReplacements calls endpoint with bookingItemId", async () => {
    const mockReplacements: AvailableReplacementDto[] = [
      {
        itemId: 102,
        barcode: "CK-DR-002",
        productName: "Váy Dạ Hội",
        variantInfo: "S - Trắng",
        itemStatus: "AVAILABLE",
        rentalCount: 1,
        isCurrent: false,
        isAvailable: true,
      },
    ];

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      code: 200,
      data: mockReplacements,
      message: "Success",
      timestamp: "2026-10-27T00:00:00Z",
    });

    const result = await dispatchService.getAvailableReplacements(301);

    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/admin/dispatch/available-replacements?bookingItemId=301"
    );
    expect(result).toEqual(mockReplacements);
  });

  it("reassignItem posts to /api/admin/dispatch/reassign-item", async () => {
    const request: ReassignItemRequest = {
      bookingItemId: 301,
      newItemId: 102,
      reason: "Đổi váy bị rách cúc",
    };

    const mockResponse: ReassignItemResponse = {
      bookingItemId: 301,
      bookingCode: "BK-001",
      oldBarcode: "CK-DR-001",
      newBarcode: "CK-DR-002",
      changedBy: "admin",
      updatedAt: "2026-10-27T10:00:00",
      message: "Điều phối đổi sang món đồ CK-DR-002 thành công",
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce({
      code: 200,
      data: mockResponse,
      message: "Success",
      timestamp: "2026-10-27T00:00:00Z",
    });

    const result = await dispatchService.reassignItem(request);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/admin/dispatch/reassign-item",
      request
    );
    expect(result).toEqual(mockResponse);
  });

  it("rescheduleBooking posts to /api/admin/dispatch/reschedule", async () => {
    const request: RescheduleBookingRequest = {
      bookingId: 201,
      newStartDate: "2026-11-10",
      newEndDate: "2026-11-13",
      reason: "Dời lịch cưới",
    };

    const mockResponse: RescheduleBookingResponse = {
      bookingId: 201,
      bookingCode: "BK-001",
      newStartDate: "2026-11-10",
      newEndDate: "2026-11-13",
      durationDays: 4,
      totalRentalPrice: 2000000,
      changedBy: "staff",
      updatedAt: "2026-10-27T10:00:00",
      message: "Dời lịch thành công",
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce({
      code: 200,
      data: mockResponse,
      message: "Success",
      timestamp: "2026-10-27T00:00:00Z",
    });

    const result = await dispatchService.rescheduleBooking(request);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/admin/dispatch/reschedule",
      request
    );
    expect(result).toEqual(mockResponse);
  });
});
