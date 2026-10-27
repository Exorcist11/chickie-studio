import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dispatchService } from "../../services/dispatch.service";
import { dispatchKeys } from "./dispatchKeys";
import { bookingKeys } from "./bookingKeys";
import {
  CalendarQueryParams,
  ReassignItemRequest,
  RescheduleBookingRequest,
  TimelineQueryParams,
} from "../../types/dispatch";

export const useCalendarDataQuery = (
  params?: CalendarQueryParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: dispatchKeys.calendar(params),
    queryFn: () => dispatchService.getCalendarData(params),
    staleTime: 30000,
    enabled,
  });
};

export const useTimelineDataQuery = (
  params?: TimelineQueryParams,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: dispatchKeys.timeline(params),
    queryFn: () => dispatchService.getTimelineData(params),
    staleTime: 30000,
    enabled,
  });
};

export const useAvailableReplacementsQuery = (bookingItemId: number | null) => {
  return useQuery({
    queryKey: dispatchKeys.replacements(bookingItemId ?? 0),
    queryFn: () => dispatchService.getAvailableReplacements(bookingItemId!),
    enabled: Boolean(bookingItemId && bookingItemId > 0),
  });
};

export const useReassignItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReassignItemRequest) => dispatchService.reassignItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dispatchKeys.all });
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
};

export const useRescheduleBookingMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RescheduleBookingRequest) => dispatchService.rescheduleBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dispatchKeys.all });
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
    },
  });
};
