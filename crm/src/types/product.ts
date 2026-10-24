export type ProductStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export interface ProductVariant {
  id?: number;
  size: string;
  color: string;
  sku?: string;
  createdAt?: string;
}

export interface ProductImage {
  id?: number;
  imageUrl: string;
  isThumbnail?: boolean;
  displayOrder?: number;
}

export interface ProductListResponse extends Record<string, unknown> {
  id: number;
  categoryId: number;
  categoryName: string;
  productCode: string;
  name: string;
  slug: string;
  rentalPrice: number;
  depositPrice: number;
  status: ProductStatus;
  thumbnailUrl?: string | null;
  variantCount: number;
  createdAt: string;
}

export interface ProductDetailResponse extends Record<string, unknown> {
  id: number;
  categoryId: number;
  categoryName: string;
  productCode: string;
  name: string;
  slug: string;
  description?: string;
  material?: string;
  occasion?: string;
  rentalPrice: number;
  depositPrice: number;
  status: ProductStatus;
  variants: ProductVariant[];
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  categoryId: number;
  productCode?: string;
  name: string;
  slug?: string;
  description?: string;
  material?: string;
  occasion?: string;
  rentalPrice: number;
  depositPrice: number;
  status?: ProductStatus;
  variants: {
    size: string;
    color: string;
    sku?: string;
  }[];
  images: {
    imageUrl: string;
    isThumbnail?: boolean;
    displayOrder?: number;
  }[];
}

export interface UpdateProductInput {
  categoryId: number;
  productCode?: string;
  name: string;
  slug?: string;
  description?: string;
  material?: string;
  occasion?: string;
  rentalPrice: number;
  depositPrice: number;
  status: ProductStatus;
  variants: {
    id?: number;
    size: string;
    color: string;
    sku?: string;
  }[];
  images: {
    id?: number;
    imageUrl: string;
    isThumbnail?: boolean;
    displayOrder?: number;
  }[];
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ProductQueryParams {
  categoryId?: number;
  status?: ProductStatus;
  search?: string;
  page?: number;
  size?: number;
  sort?: string;
}
