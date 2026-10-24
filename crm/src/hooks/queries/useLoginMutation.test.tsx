import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLoginMutation } from "./useLoginMutation";
import { authKeys } from "./authKeys";
import * as AuthContextModule from "../../context/AuthContext";

describe("useLoginMutation", () => {
  const mockLogin = vi.fn();
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
      logout: vi.fn(),
      hasRole: vi.fn(),
    });
  });

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it("calls login and invalidates auth queries on success", async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      username: "admin@chickie.vn",
      password: "Password123",
    });

    expect(mockLogin).toHaveBeenCalledWith({
      username: "admin@chickie.vn",
      password: "Password123",
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: authKeys.all,
    });
  });

  it("propagates error when login fails", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Sai mật khẩu"));

    const { result } = renderHook(() => useLoginMutation(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        username: "admin@chickie.vn",
        password: "WrongPassword",
      })
    ).rejects.toThrow("Sai mật khẩu");

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
