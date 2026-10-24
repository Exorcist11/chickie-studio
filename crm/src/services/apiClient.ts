import { ApiEnvelope, TokenResponseData } from "../types/auth";

class ApiClient {
  private token: string | null =
    typeof window !== "undefined" ? localStorage.getItem("chickie_crm_token") : null;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  public setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("chickie_crm_token", token);
      } else {
        localStorage.removeItem("chickie_crm_token");
      }
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("chickie_crm_token");
    }
    return this.token;
  }

  private onTokenRefreshed(newToken: string): void {
    this.refreshSubscribers.forEach((callback) => callback(newToken));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiEnvelope<T>> {
    const baseUrl = import.meta.env.VITE_API_URL || "";
    const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;
    const headers = new Headers(options.headers || {});

    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const currentToken = this.getToken();
    if (currentToken && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${currentToken}`);
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: "include",
    };

    let response = await fetch(url, config);

    // Xử lý 401 Unauthorized -> Tự động silent refresh
    if (response.status === 401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh")) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;

        try {
          const refreshRes = await fetch("/api/public/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          if (!refreshRes.ok) {
            this.setToken(null);
            this.isRefreshing = false;
            throw new Error("SESSION_EXPIRED");
          }

          const refreshData: ApiEnvelope<TokenResponseData> = await refreshRes.json();
          const newToken = refreshData.data.accessToken;
          this.setToken(newToken);
          this.isRefreshing = false;
          this.onTokenRefreshed(newToken);
        } catch (error) {
          this.isRefreshing = false;
          this.setToken(null);
          this.refreshSubscribers = [];
          throw error;
        }
      }

      // Đợi refresh hoàn tất và replay request
      const retryToken = await new Promise<string>((resolve) => {
        this.addRefreshSubscriber((token) => resolve(token));
      });

      headers.set("Authorization", `Bearer ${retryToken}`);
      response = await fetch(url, { ...config, headers });
    }

    if (!response.ok) {
      let errorMessage = `HTTP Error ${response.status}`;
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.message || errorMessage;
      } catch {
        // Fallback to status text
      }
      const error = new Error(errorMessage) as Error & {
        status?: number;
        response?: { status: number; data: { message: string } };
      };
      error.status = response.status;
      error.response = { status: response.status, data: { message: errorMessage } };
      throw error;
    }

    return response.json();
  }

  public get<T>(endpoint: string, options?: RequestInit): Promise<ApiEnvelope<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiEnvelope<T>> {
    const formattedBody =
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined;
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: formattedBody,
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<ApiEnvelope<T>> {
    const formattedBody =
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined;
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: formattedBody,
    });
  }

  public delete<T>(endpoint: string, options?: RequestInit): Promise<ApiEnvelope<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
