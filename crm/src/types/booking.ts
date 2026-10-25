import { OrderStatus } from "../components/common/StatusBadge";

export type BookingStatus = OrderStatus;

export type BookingDeliveryMethod = "PICKUP_STORE" | "SHIP_TO_ADDRESS";

export interface BookingItemResponse {
  id: number;
  productItemId?: number | null;
  productItemCode?: string | null;
  variantId?: number | null;
  productName?: string;
  variantSize?: string | null;
  variantColor?: string | null;
  rentalStartDate: string;
  rentalEndDate: string;
  rentalPrice: number;
  depositPrice: number;
}

export interface BookingStatusHistoryResponse {
  id: number;
  fromStatus?: BookingStatus | null;
  toStatus: BookingStatus;
  changedBy?: string | null;
  note?: string | null;
  createdAt: string;
}

export interface BookingResponse extends Record<string, unknown> {
  id: number;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: BookingDeliveryMethod | string;
  deliveryAddress?: string | null;
  rentalStartDate: string;
  rentalEndDate: string;
  durationDays: number;
  status: BookingStatus;
  totalRentalPrice: number;
  totalDepositPrice: number;
  totalAmount: number;
  note?: string | null;
  createdAt: string;
  items: BookingItemResponse[];
  statusHistories?: BookingStatusHistoryResponse[];
}

export interface UpdateBookingStatusInput {
  status: BookingStatus;
  note?: string;
}

export interface BookingQueryParams {
  status?: BookingStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  todayDeliver?: boolean;
  todayReturn?: boolean;
  overdue?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}
