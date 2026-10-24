import { apiClient } from "./apiClient";
import { AuthUser, LoginCredentials, LoginResponseData, TokenResponseData } from "../types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponseData> {
    const res = await apiClient.post<LoginResponseData>("/api/public/auth/login", credentials);
    apiClient.setToken(res.data.accessToken);
    return res.data;
  },

  async refreshToken(): Promise<TokenResponseData> {
    const res = await apiClient.post<TokenResponseData>("/api/public/auth/refresh");
    apiClient.setToken(res.data.accessToken);
    return res.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post<void>("/api/admin/auth/logout");
    } finally {
      apiClient.setToken(null);
    }
  },

  async getProfile(): Promise<{ username: string; user: AuthUser }> {
    const res = await apiClient.get<{ username: string; user: AuthUser }>("/api/admin/profile");
    return res.data;
  },
};
