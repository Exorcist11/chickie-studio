export interface ProductListItem {
  id: number;
  categoryId?: number;
  categoryName?: string;
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
