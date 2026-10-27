import { apiClient } from "./apiClient";
import {
  AvailableReplacementDto,
  CalendarDispatchResponse,
  CalendarQueryParams,
  ReassignItemRequest,
  ReassignItemResponse,
  RescheduleBookingRequest,
  RescheduleBookingResponse,
  TimelineDispatchResponse,
  TimelineQueryParams,
} from "../types/dispatch";

export const dispatchService = {
  async getCalendarData(params?: CalendarQueryParams): Promise<CalendarDispatchResponse> {
    const query = new URLSearchParams();
    if (params) {
      if (params.startDate) query.set("startDate", params.startDate);
      if (params.endDate) query.set("endDate", params.endDate);
      if (params.status) query.set("status", params.status);
      if (params.search) query.set("search", params.search);
    }
    const queryString = query.toString();
    const endpoint = `/api/admin/dispatch/calendar${queryString ? `?${queryString}` : ""}`;
    const res = await apiClient.get<CalendarDispatchResponse>(endpoint);
    return res.data;
  },

  async getTimelineData(params?: TimelineQueryParams): Promise<TimelineDispatchResponse> {
    const query = new URLSearchParams();
    if (params) {
      if (params.startDate) query.set("startDate", params.startDate);
      if (params.endDate) query.set("endDate", params.endDate);
      if (params.categoryId) query.set("categoryId", String(params.categoryId));
      if (params.search) query.set("search", params.search);
    }
    const queryString = query.toString();
    const endpoint = `/api/admin/dispatch/timeline${queryString ? `?${queryString}` : ""}`;
    const res = await apiClient.get<TimelineDispatchResponse>(endpoint);
    return res.data;
  },

  async getAvailableReplacements(bookingItemId: number): Promise<AvailableReplacementDto[]> {
    const res = await apiClient.get<AvailableReplacementDto[]>(
      `/api/admin/dispatch/available-replacements?bookingItemId=${bookingItemId}`
    );
    return res.data;
  },

  async reassignItem(data: ReassignItemRequest): Promise<ReassignItemResponse> {
    const res = await apiClient.post<ReassignItemResponse>("/api/admin/dispatch/reassign-item", data);
    return res.data;
  },

  async rescheduleBooking(data: RescheduleBookingRequest): Promise<RescheduleBookingResponse> {
    const res = await apiClient.post<RescheduleBookingResponse>("/api/admin/dispatch/reschedule", data);
    return res.data;
  },
};
