import { describe, it, expect, vi, beforeEach } from "vitest";
import { authService } from "./auth.service";
import { apiClient } from "./apiClient";

describe("authService", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    apiClient.setToken(null);
  });

  it("login_shouldCallApiAndSetToken", async () => {
    const mockResponse = {
      code: 200,
      message: "SUCCESS",
      timestamp: "2026-10-24T10:00:00",
      data: {
        accessToken: "test-access-token",
        tokenType: "Bearer",
        expiresIn: 900,
        refreshToken: "test-refresh-token",
        user: {
          id: 1,
          username: "admin",
          email: "admin@chickie.vn",
          fullName: "Admin Chickie",
          role: "ROLE_ADMIN" as const,
          status: "ACTIVE" as const,
        },
      },
    };

    const postSpy = vi.spyOn(apiClient, "post").mockResolvedValue(mockResponse);

    const result = await authService.login({
      username: "admin",
      password: "password123",
    });

    expect(postSpy).toHaveBeenCalledWith("/api/public/auth/login", {
      username: "admin",
      password: "password123",
    });
    expect(result.accessToken).toBe("test-access-token");
    expect(apiClient.getToken()).toBe("test-access-token");
  });

  it("refreshToken_shouldUpdateTokenOnSuccess", async () => {
    const mockRefreshResponse = {
      code: 200,
      message: "SUCCESS",
      timestamp: "2026-10-24T10:00:00",
      data: {
        accessToken: "new-access-token",
        tokenType: "Bearer",
        expiresIn: 900,
      },
    };

    vi.spyOn(apiClient, "post").mockResolvedValue(mockRefreshResponse);

    const result = await authService.refreshToken();

    expect(result.accessToken).toBe("new-access-token");
    expect(apiClient.getToken()).toBe("new-access-token");
  });

  it("logout_shouldCallApiAndClearToken", async () => {
    apiClient.setToken("some-active-token");
    const postSpy = vi.spyOn(apiClient, "post").mockResolvedValue({
      code: 200,
      message: "SUCCESS",
      timestamp: "2026-10-24T10:00:00",
      data: undefined as unknown as void,
    });

    await authService.logout();

    expect(postSpy).toHaveBeenCalledWith("/api/admin/auth/logout");
    expect(apiClient.getToken()).toBeNull();
  });

  it("getProfile_whenUserInResponse_shouldReturnUser", async () => {
    const mockUser = {
      id: 1,
      username: "admin",
      email: "admin@chickie.vn",
      fullName: "Admin Chickie",
      role: "ROLE_ADMIN" as const,
      status: "ACTIVE" as const,
    };

    vi.spyOn(apiClient, "get").mockResolvedValue({
      code: 200,
      message: "SUCCESS",
      timestamp: "2026-10-24T10:00:00",
      data: {
        username: "admin",
        user: mockUser,
      },
    });

    const result = await authService.getProfile();
    expect(result.username).toBe("admin");
    expect(result.user).toEqual(mockUser);
  });

  it("getProfile_whenNoUserInResponse_shouldFallbackFromAuthorities", async () => {
    localStorage.clear();
    vi.spyOn(apiClient, "get").mockResolvedValue({
      code: 200,
      message: "SUCCESS",
      timestamp: "2026-10-24T10:00:00",
      data: {
        username: "adminuser",
        authorities: [{ authority: "ROLE_ADMIN" }],
      },
    });

    const result = await authService.getProfile();
    expect(result.username).toBe("adminuser");
    expect(result.user.role).toBe("ROLE_ADMIN");
  });

  it("getProfile_whenStoredInLocalStorage_shouldReturnStoredUser", async () => {
    const cachedUser = {
      id: 5,
      username: "cached_staff",
      email: "cached_staff@chickie.vn",
      fullName: "Cached Staff",
      role: "ROLE_STAFF" as const,
      status: "ACTIVE" as const,
    };
    localStorage.setItem("chickie_crm_user", JSON.stringify(cachedUser));

    vi.spyOn(apiClient, "get").mockResolvedValue({
      code: 200,
      message: "SUCCESS",
      timestamp: "2026-10-24T10:00:00",
      data: {
        username: "cached_staff",
      },
    });

    const result = await authService.getProfile();
    expect(result.username).toBe("cached_staff");
    expect(result.user).toEqual(cachedUser);
  });
});
