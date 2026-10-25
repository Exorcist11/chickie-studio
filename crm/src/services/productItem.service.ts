import { apiClient } from "./apiClient";
import {
  CreateProductItemInput,
  ProductItem,
  UpdateProductItemStatusInput,
} from "../types/productItem";

export const productItemService = {
  async getItemsByProduct(productId: number): Promise<ProductItem[]> {
    const res = await apiClient.get<ProductItem[]>(`/api/admin/products/${productId}/items`);
    return res.data;
  },

  async getItemsByVariant(variantId: number): Promise<ProductItem[]> {
    const res = await apiClient.get<ProductItem[]>(`/api/admin/product-variants/${variantId}/items`);
    return res.data;
  },

  async getItemById(id: number): Promise<ProductItem> {
    const res = await apiClient.get<ProductItem>(`/api/admin/product-items/${id}`);
    return res.data;
  },

  async suggestItemCode(variantId: number): Promise<string> {
    const res = await apiClient.get<{ suggestedCode: string }>(
      `/api/admin/product-variants/${variantId}/suggest-code`
    );
    return res.data.suggestedCode;
  },

  async createItem(variantId: number, data: CreateProductItemInput): Promise<ProductItem> {
    const res = await apiClient.post<ProductItem>(
      `/api/admin/product-variants/${variantId}/items`,
      data
    );
    return res.data;
  },

  async updateItemStatus(id: number, data: UpdateProductItemStatusInput): Promise<ProductItem> {
    const res = await apiClient.patch<ProductItem>(
      `/api/admin/product-items/${id}/status`,
      data
    );
    return res.data;
  },

  async deleteItem(id: number): Promise<void> {
    await apiClient.delete<void>(`/api/admin/product-items/${id}`);
  },
};
