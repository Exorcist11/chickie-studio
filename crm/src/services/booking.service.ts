import { apiClient } from "./apiClient";
import { PageResult } from "../types/product";
import {
  BookingQueryParams,
  BookingResponse,
  UpdateBookingStatusInput,
} from "../types/booking";

export const bookingService = {
  async getBookings(params?: BookingQueryParams): Promise<PageResult<BookingResponse>> {
    const query = new URLSearchParams();
    if (params) {
      if (params.status) query.set("status", params.status);
      if (params.search) query.set("search", params.search);
      if (params.startDate) query.set("startDate", params.startDate);
      if (params.endDate) query.set("endDate", params.endDate);
      if (params.todayDeliver !== undefined) query.set("todayDeliver", String(params.todayDeliver));
      if (params.todayReturn !== undefined) query.set("todayReturn", String(params.todayReturn));
      if (params.overdue !== undefined) query.set("overdue", String(params.overdue));
      if (params.page !== undefined) query.set("page", String(params.page));
      if (params.size !== undefined) query.set("size", String(params.size));
      if (params.sort) query.set("sort", params.sort);
    }
    const queryString = query.toString();
    const endpoint = `/api/admin/bookings${queryString ? `?${queryString}` : ""}`;
    const res = await apiClient.get<PageResult<BookingResponse>>(endpoint);
    return res.data;
  },

  async getBookingById(id: number): Promise<BookingResponse> {
    const res = await apiClient.get<BookingResponse>(`/api/admin/bookings/${id}`);
    return res.data;
  },

  async updateBookingStatus(
    id: number,
    data: UpdateBookingStatusInput
  ): Promise<BookingResponse> {
    const res = await apiClient.patch<BookingResponse>(`/api/admin/bookings/${id}/status`, data);
    return res.data;
  },
};
