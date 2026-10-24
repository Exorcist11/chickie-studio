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
    const res = await apiClient.get<{
      username: string;
      user?: AuthUser;
      authorities?: Array<{ authority: string } | string>;
    }>("/api/admin/profile");

    let user = res.data?.user;
    if (!user && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("chickie_crm_user");
        if (stored) {
          user = JSON.parse(stored);
        }
      } catch {
        // ignore parse error
      }
    }

    if (!user) {
      const authorities = res.data?.authorities || [];
      const isAdmin = authorities.some((a) => {
        const val = typeof a === "string" ? a : a.authority;
        return val === "ROLE_ADMIN";
      });

      user = {
        id: 1,
        username: res.data?.username || "admin",
        email: `${res.data?.username || "admin"}@chickie.vn`,
        fullName: res.data?.username === "admin" ? "Admin Chickie" : "Nhân viên Chickie",
        role: isAdmin ? "ROLE_ADMIN" : "ROLE_STAFF",
        status: "ACTIVE",
      };
    }

    return {
      username: res.data?.username || user.username,
      user,
    };
  },
};
