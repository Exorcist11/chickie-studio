export interface ProductListItem {
  id: number;
  categoryId?: number;
  categoryName?: string;
  type?: "COSTUME" | "CAMERA" | "PHOTOGRAPHY" | string;
  productCode: string;
  name: string;
  slug: string;
  rentalPrice: number;
  depositPrice: number;
  status: "ACTIVE" | "INACTIVE" | "DISCONTINUED";
  thumbnailUrl?: string;
  variantCount?: number;
  createdAt?: string;
}

export interface ProductVariant {
  id: number;
  size: string;
  color: string;
  sku: string;
  createdAt?: string;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  isThumbnail: boolean;
  displayOrder: number;
}

export interface ProductDetail {
  id: number;
  categoryId?: number;
  categoryName?: string;
  type?: "COSTUME" | "CAMERA" | "PHOTOGRAPHY" | string;
  productCode: string;
  name: string;
  slug: string;
  description?: string;
  material?: string;
  occasion?: string;
  rentalPrice: number;
  depositPrice: number;
  status: "ACTIVE" | "INACTIVE" | "DISCONTINUED";
  variants: ProductVariant[];
  images: ProductImage[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductQueryParams {
  categoryId?: number | string;
  type?: string;
  search?: string;
  page?: number;
  size?: number;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface DayAvailability {
  date: string; // YYYY-MM-DD
  available: boolean;
  remainingCount: number;
  reason: "AVAILABLE" | "FULLY_BOOKED" | "MAINTENANCE" | "PAST_DATE" | string;
}

export interface ProductAvailabilityResponse {
  productId: number;
  slug: string;
  productName: string;
  variantId?: number;
  variantName?: string;
  month: string; // YYYY-MM
  totalItems: number;
  availableItems: number;
  bufferDays: number;
  days: DayAvailability[];
}

