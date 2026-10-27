import { apiClient } from "./apiClient";
import { PageResult } from "../types/product";
import {
  StaffUser,
  CreateStaffInput,
  UpdateStaffInput,
  UpdateStaffStatusInput,
  ResetPasswordInput,
  StaffQueryParams,
} from "../types/staff";

export const staffService = {
  async getStaffs(params?: StaffQueryParams): Promise<PageResult<StaffUser>> {
    const query = new URLSearchParams();
    if (params) {
      if (params.search) query.set("search", params.search);
      if (params.role) query.set("role", params.role);
      if (params.status) query.set("status", params.status);
      if (params.page !== undefined) query.set("page", String(params.page));
      if (params.size !== undefined) query.set("size", String(params.size));
      if (params.sort) query.set("sort", params.sort);
    }
    const queryString = query.toString();
    const endpoint = `/api/admin/users${queryString ? `?${queryString}` : ""}`;
    const res = await apiClient.get<PageResult<StaffUser>>(endpoint);
    return res.data;
  },

  async getStaffById(id: number): Promise<StaffUser> {
    const res = await apiClient.get<StaffUser>(`/api/admin/users/${id}`);
    return res.data;
  },

  async createStaff(data: CreateStaffInput): Promise<StaffUser> {
    const res = await apiClient.post<StaffUser>("/api/admin/users", data);
    return res.data;
  },

  async updateStaff(id: number, data: UpdateStaffInput): Promise<StaffUser> {
    const res = await apiClient.put<StaffUser>(`/api/admin/users/${id}`, data);
    return res.data;
  },

  async updateStaffStatus(id: number, data: UpdateStaffStatusInput): Promise<StaffUser> {
    const res = await apiClient.patch<StaffUser>(`/api/admin/users/${id}/status`, data);
    return res.data;
  },

  async resetPassword(id: number, data: ResetPasswordInput): Promise<void> {
    await apiClient.post<void>(`/api/admin/users/${id}/reset-password`, data);
  },
};
