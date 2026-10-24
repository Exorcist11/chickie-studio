import { apiClient } from "./apiClient";
import { Category, CreateCategoryInput, UpdateCategoryInput } from "../types/category";

export const categoryService = {
  async getAllCategories(): Promise<Category[]> {
    const res = await apiClient.get<Category[]>("/api/admin/categories");
    return res.data;
  },

  async getCategoryById(id: number): Promise<Category> {
    const res = await apiClient.get<Category>(`/api/admin/categories/${id}`);
    return res.data;
  },

  async createCategory(data: CreateCategoryInput): Promise<Category> {
    const res = await apiClient.post<Category>("/api/admin/categories", data);
    return res.data;
  },

  async updateCategory(id: number, data: UpdateCategoryInput): Promise<Category> {
    const res = await apiClient.put<Category>(`/api/admin/categories/${id}`, data);
    return res.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await apiClient.delete<void>(`/api/admin/categories/${id}`);
  },
};
