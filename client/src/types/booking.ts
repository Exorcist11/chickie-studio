export type BookingDeliveryMethod = "PICKUP_STORE" | "SHIP_TO_ADDRESS";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DEPOSITED"
  | "DELIVERED"
  | "RETURNED"
  | "COMPLETED"
  | "CANCELLED"
  | "OVERDUE";

export interface CreateBookingRequest {
  customerName: string;
  customerPhone: string;
  deliveryMethod: BookingDeliveryMethod;
  deliveryAddress?: string;
  rentalStartDate: string; // YYYY-MM-DD
  rentalEndDate: string; // YYYY-MM-DD
  variantId: number;
  note?: string;
}

export interface BookingTrackingRequest {
  bookingCode: string;
  phone: string;
}

export interface BookingStatusHistoryResponse {
  id: number;
  fromStatus?: BookingStatus;
  toStatus: BookingStatus;
  changedBy: string;
  note?: string;
  createdAt: string;
}

export interface BookingItemResponse {
  id: number;
  productItemId?: number;
  productItemCode?: string;
  productItemBarcode?: string;
  variantId: number;
  productName: string;
  variantSize?: string;
  variantColor?: string;
  rentalStartDate: string;
  rentalEndDate: string;
  rentalPrice: number;
  depositPrice: number;
}

export interface BookingResponse {
  id: number;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: BookingDeliveryMethod;
  deliveryAddress?: string;
  rentalStartDate: string;
  rentalEndDate: string;
  durationDays: number;
  status: BookingStatus;
  totalRentalPrice: number;
  totalDepositPrice: number;
  totalAmount: number;
  note?: string;
  createdAt: string;
  items: BookingItemResponse[];
  statusHistories?: BookingStatusHistoryResponse[];
}
