import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import { authService } from "../services/auth.service";

describe("AuthContext", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("throws error when useAuth is called outside AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow("useAuth must be used within an AuthProvider");
  });

  it("restores session successfully on mount", async () => {
    const mockUser = {
      id: 1,
      username: "admin",
      email: "admin@chickie.vn",
      fullName: "Admin Chickie",
      role: "ROLE_ADMIN" as const,
      status: "ACTIVE" as const,
    };

    vi.spyOn(authService, "refreshToken").mockResolvedValue({
      accessToken: "restored-token",
      tokenType: "Bearer",
      expiresIn: 900,
    });
    vi.spyOn(authService, "getProfile").mockResolvedValue({
      username: "admin",
      user: mockUser,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.hasRole("ROLE_ADMIN")).toBe(true);
    expect(result.current.hasRole("ROLE_STAFF")).toBe(false);
  });

  it("handles login and logout flow correctly", async () => {
    vi.spyOn(authService, "refreshToken").mockRejectedValue(new Error("No cookie"));
    const mockUser = {
      id: 2,
      username: "staff",
      email: "staff@chickie.vn",
      fullName: "Staff Chickie",
      role: "ROLE_STAFF" as const,
      status: "ACTIVE" as const,
    };

    vi.spyOn(authService, "login").mockResolvedValue({
      accessToken: "staff-token",
      tokenType: "Bearer",
      expiresIn: 900,
      user: mockUser,
    });
    const logoutSpy = vi.spyOn(authService, "logout").mockResolvedValue();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);

    // Thực hiện Login
    await act(async () => {
      await result.current.login({ username: "staff", password: "pwd" });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.username).toBe("staff");
    expect(result.current.hasRole("ROLE_STAFF")).toBe(true);

    // Thực hiện Logout
    await act(async () => {
      await result.current.logout();
    });

    expect(logoutSpy).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
