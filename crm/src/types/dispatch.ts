import { BookingStatus } from "./booking";

export type DispatchViewMode = "calendar" | "timeline";

export interface CalendarItemDto {
  bookingItemId: number;
  itemId?: number | null;
  barcode: string;
  productName: string;
  variantInfo: string;
  rentalPrice: number;
}

export interface CalendarBookingDto {
  id: number;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  status: BookingStatus;
  rentalStartDate: string;
  rentalEndDate: string;
  totalRentalPrice: number;
  totalDepositPrice: number;
  totalAmount: number;
  itemCount: number;
  items: CalendarItemDto[];
}

export interface CalendarDispatchResponse {
  startDate: string;
  endDate: string;
  totalBookings: number;
  bookings: CalendarBookingDto[];
}

export interface TimelineEventDto {
  bookingId: number;
  bookingItemId: number;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  bufferEndDate: string;
  bufferDays: number;
  status: BookingStatus;
  rentalPrice: number;
  depositPrice: number;
}

export interface TimelineResourceDto {
  itemId: number;
  barcode: string;
  productName: string;
  variantInfo: string;
  categoryType: string;
  itemStatus: string;
  events: TimelineEventDto[];
}

export interface TimelineDispatchResponse {
  startDate: string;
  endDate: string;
  resources: TimelineResourceDto[];
}

export interface AvailableReplacementDto {
  itemId: number;
  barcode: string;
  productName: string;
  variantInfo: string;
  itemStatus: string;
  rentalCount: number;
  note?: string | null;
  isCurrent: boolean;
  isAvailable: boolean;
}

export interface ReassignItemRequest {
  bookingItemId: number;
  newItemId: number;
  reason: string;
}

export interface ReassignItemResponse {
  bookingItemId: number;
  bookingCode: string;
  oldBarcode: string;
  newBarcode: string;
  changedBy: string;
  updatedAt: string;
  message: string;
}

export interface RescheduleBookingRequest {
  bookingId: number;
  newStartDate: string;
  newEndDate: string;
  reason: string;
}

export interface RescheduleBookingResponse {
  bookingId: number;
  bookingCode: string;
  newStartDate: string;
  newEndDate: string;
  durationDays: number;
  totalRentalPrice: number;
  changedBy: string;
  updatedAt: string;
  message: string;
}

export interface CalendarQueryParams {
  startDate?: string;
  endDate?: string;
  status?: BookingStatus;
  search?: string;
}

export interface TimelineQueryParams {
  startDate?: string;
  endDate?: string;
  categoryId?: number;
  search?: string;
}
