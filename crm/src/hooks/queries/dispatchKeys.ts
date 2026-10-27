import { CalendarQueryParams, TimelineQueryParams } from "../../types/dispatch";

export const dispatchKeys = {
  all: ["dispatch"] as const,
  calendar: (params?: CalendarQueryParams) => [...dispatchKeys.all, "calendar", params] as const,
  timeline: (params?: TimelineQueryParams) => [...dispatchKeys.all, "timeline", params] as const,
  replacements: (bookingItemId: number) => [...dispatchKeys.all, "replacements", bookingItemId] as const,
};
