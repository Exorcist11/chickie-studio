export type ProductItemStatus =
  | "AVAILABLE"
  | "RENTED"
  | "LAUNDRY"
  | "MAINTENANCE"
  | "RETIRED";

export interface ProductItem extends Record<string, unknown> {
  id: number;
  variantId: number;
  variantSize: string;
  variantColor: string;
  variantSku: string;
  productId: number;
  productName: string;
  productCode: string;
  itemCode: string;
  status: ProductItemStatus;
  rentalCount: number;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductItemInput {
  itemCode?: string;
  status?: ProductItemStatus;
  note?: string;
}

export interface UpdateProductItemStatusInput {
  status: ProductItemStatus;
  note?: string;
}

/**
 * Kiểm tra các trạng thái đích hợp lệ từ trạng thái hiện tại (State Machine Guard)
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<ProductItemStatus, ProductItemStatus[]> = {
  AVAILABLE: ["RENTED", "MAINTENANCE", "RETIRED"],
  RENTED: ["LAUNDRY"],
  LAUNDRY: ["AVAILABLE", "MAINTENANCE"],
  MAINTENANCE: ["AVAILABLE", "RETIRED"],
  RETIRED: [],
};

export const ITEM_STATUS_DEFAULT_LABELS: Record<ProductItemStatus, string> = {
  AVAILABLE: "Sẵn sàng",
  RENTED: "Đang cho thuê",
  LAUNDRY: "Đang giặt ủi",
  MAINTENANCE: "Đang sửa chữa",
  RETIRED: "Ngừng cho thuê",
};
