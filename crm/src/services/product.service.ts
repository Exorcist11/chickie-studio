import { apiClient } from "./apiClient";
import {
  CreateProductInput,
  PageResult,
  ProductDetailResponse,
  ProductListResponse,
  ProductQueryParams,
  UpdateProductInput,
} from "../types/product";

export const productService = {
  async getProducts(params?: ProductQueryParams): Promise<PageResult<ProductListResponse>> {
    const query = new URLSearchParams();
    if (params) {
      if (params.search) query.set("search", params.search);
      if (params.categoryId) query.set("categoryId", String(params.categoryId));
      if (params.status) query.set("status", params.status);
      if (params.page !== undefined) query.set("page", String(params.page));
      if (params.size !== undefined) query.set("size", String(params.size));
      if (params.sort) query.set("sort", params.sort);
    }
    const queryString = query.toString();
    const endpoint = `/api/admin/products${queryString ? `?${queryString}` : ""}`;
    const res = await apiClient.get<PageResult<ProductListResponse>>(endpoint);
    return res.data;
  },

  async getProductById(id: number): Promise<ProductDetailResponse> {
    const res = await apiClient.get<ProductDetailResponse>(`/api/admin/products/${id}`);
    return res.data;
  },

  async createProduct(data: CreateProductInput): Promise<ProductDetailResponse> {
    const res = await apiClient.post<ProductDetailResponse>("/api/admin/products", data);
    return res.data;
  },

  async updateProduct(id: number, data: UpdateProductInput): Promise<ProductDetailResponse> {
    const res = await apiClient.put<ProductDetailResponse>(`/api/admin/products/${id}`, data);
    return res.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await apiClient.delete<void>(`/api/admin/products/${id}`);
  },
};
