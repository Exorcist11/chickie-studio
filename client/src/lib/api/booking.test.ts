import { describe, it, expect, vi, beforeEach } from "vitest";
import { createBooking, getBookingByCode, trackBooking } from "./booking";
import { CreateBookingRequest, BookingResponse } from "@/types/booking";

describe("Booking API Client", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  const mockRequest: CreateBookingRequest = {
    customerName: "Nguyễn Quỳnh Anh",
    customerPhone: "0912345678",
    deliveryMethod: "PICKUP_STORE",
    rentalStartDate: "2026-11-10",
    rentalEndDate: "2026-11-11",
    variantId: 100,
    note: "Cao 1m62",
  };

  const mockBookingResponse: BookingResponse = {
    id: 1,
    bookingCode: "BK20261110-8888",
    customerName: "Nguyễn Quỳnh Anh",
    customerPhone: "0912345678",
    deliveryMethod: "PICKUP_STORE",
    rentalStartDate: "2026-11-10",
    rentalEndDate: "2026-11-11",
    durationDays: 2,
    status: "PENDING",
    totalRentalPrice: 400000,
    totalDepositPrice: 500000,
    totalAmount: 900000,
    note: "Cao 1m62",
    createdAt: new Date().toISOString(),
    items: [
      {
        id: 1,
        variantId: 100,
        productName: "Đầm Dạ Hội",
        variantSize: "M",
        rentalStartDate: "2026-11-10",
        rentalEndDate: "2026-11-11",
        rentalPrice: 400000,
        depositPrice: 500000,
      },
    ],
  };

  describe("createBooking", () => {
    it("returns booking response when API succeeds", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          code: 200,
          data: mockBookingResponse,
        }),
      } as Response);

      const result = await createBooking(mockRequest);
      expect(result.bookingCode).toBe("BK20261110-8888");
      expect(result.customerName).toBe("Nguyễn Quỳnh Anh");
      expect(result.totalAmount).toBe(900000);
    });

    it("throws error with server message when API fails with 409 Conflict", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({
          code: 409,
          message: "Sản phẩm đã kín lịch trong khoảng thời gian đã chọn",
        }),
      } as Response);

      await expect(createBooking(mockRequest)).rejects.toThrow(
        "Sản phẩm đã kín lịch trong khoảng thời gian đã chọn"
      );
    });

    it("falls back to simulated response when network throws TypeError", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(
        new TypeError("Failed to fetch")
      );

      const result = await createBooking(mockRequest);
      expect(result).toBeDefined();
      expect(result.customerName).toBe("Nguyễn Quỳnh Anh");
      expect(result.bookingCode).toMatch(/^BK\d{8}-[A-Z0-9]{4}$/);
      expect(result.status).toBe("PENDING");
    });
  });

  describe("getBookingByCode", () => {
    it("returns booking when API succeeds", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          code: 200,
          data: mockBookingResponse,
        }),
      } as Response);

      const result = await getBookingByCode("BK20261110-8888");
      expect(result.bookingCode).toBe("BK20261110-8888");
    });

    it("falls back to localStorage when network error occurs", async () => {
      localStorage.setItem(
        "chickie_guest_bookings",
        JSON.stringify([mockBookingResponse])
      );

      vi.spyOn(global, "fetch").mockRejectedValueOnce(
        new TypeError("Network error")
      );

      const result = await getBookingByCode("BK20261110-8888");
      expect(result.bookingCode).toBe("BK20261110-8888");
    });

    it("returns fallback booking when API returns 404 not found", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          code: 404,
          message: "Không tìm thấy đơn đặt thuê",
        }),
      } as Response);

      const result = await getBookingByCode("BK20261025-DEMO");
      expect(result.bookingCode).toBe("BK20261025-DEMO");
      expect(result.status).toBe("PENDING");
    });

    it("throws error when API returns 500 server error", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          code: 500,
          message: "Lỗi hệ thống máy chủ",
        }),
      } as Response);

      await expect(getBookingByCode("BK-ERROR")).rejects.toThrow(
        "Lỗi hệ thống máy chủ"
      );
    });
  });

  describe("trackBooking", () => {
    it("returns booking response when tracking API succeeds", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          code: 200,
          data: mockBookingResponse,
        }),
      } as Response);

      const result = await trackBooking({
        bookingCode: "BK20261110-8888",
        phone: "0912345678",
      });
      expect(result.bookingCode).toBe("BK20261110-8888");
      expect(result.customerName).toBe("Nguyễn Quỳnh Anh");
    });

    it("throws not found message when tracking API returns 404", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({
          code: 404,
          message: "Không tìm thấy đơn đặt thuê phù hợp",
        }),
      } as Response);

      await expect(
        trackBooking({
          bookingCode: "BK-WRONG",
          phone: "0999999999",
        })
      ).rejects.toThrow("Không tìm thấy đơn đặt thuê phù hợp");
    });

    it("returns mock response on network error if code starts with BK", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(
        new TypeError("Failed to fetch")
      );

      const result = await trackBooking({
        bookingCode: "BK20261025-OFFLINE",
        phone: "0912345678",
      });

      expect(result.bookingCode).toBe("BK20261025-OFFLINE");
      expect(result.customerPhone).toBe("0912345678");
    });

    it("throws error when API returns 500 server error", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          code: 500,
          message: "Lỗi máy chủ",
        }),
      } as Response);

      await expect(
        trackBooking({
          bookingCode: "BK-ERR",
          phone: "0912345678",
        })
      ).rejects.toThrow("Lỗi máy chủ");
    });
  });
});
