import { UserRole, UserStatus } from "./auth";

export interface StaffUser extends Record<string, unknown> {
  id: number;
  username: string;
  email: string;
  fullName: string;
  phone?: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt?: string;
}

export interface CreateStaffInput {
  username: string;
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRole;
}

export interface UpdateStaffInput {
  fullName: string;
  email: string;
  phone?: string;
  role?: UserRole;
}

export interface UpdateStaffStatusInput {
  status: UserStatus;
}

export interface ResetPasswordInput {
  newPassword: string;
}

export interface StaffQueryParams {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
  page?: number;
  size?: number;
  sort?: string;
}
