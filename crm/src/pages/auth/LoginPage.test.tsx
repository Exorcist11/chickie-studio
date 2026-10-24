import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import * as AuthContextModule from "../../context/AuthContext";
import "../../i18n";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginPage", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
      logout: vi.fn(),
      hasRole: vi.fn(),
    });
  });

  it("renders login form correctly with inputs and submit button", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nhập username hoặc email...")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nhập mật khẩu...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Đăng Nhập/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Đăng Nhập/i }));

    await waitFor(() => {
      expect(screen.getByText("Vui lòng nhập tên đăng nhập hoặc email")).toBeInTheDocument();
      expect(screen.getByText("Vui lòng nhập mật khẩu")).toBeInTheDocument();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("submits form and navigates on successful login", async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Nhập username hoặc email..."), {
      target: { value: "admin@chickie.vn" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu..."), {
      target: { value: "Admin@123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Đăng Nhập/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        username: "admin@chickie.vn",
        password: "Admin@123456",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  it("displays server error message on login failure", async () => {
    mockLogin.mockRejectedValueOnce(new Error("Tên đăng nhập hoặc mật khẩu không chính xác"));

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Nhập username hoặc email..."), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu..."), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Đăng Nhập/i }));

    await waitFor(() => {
      expect(screen.getByTestId("login-error-alert")).toBeInTheDocument();
      expect(screen.getByText("Tên đăng nhập hoặc mật khẩu không chính xác")).toBeInTheDocument();
    });
  });

  it("toggles password visibility when eye icon clicked", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu...") as HTMLInputElement;
    const toggleButton = screen.getByRole("button", { name: /Hiện mật khẩu/i });

    expect(passwordInput.type).toBe("password");

    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");

    fireEvent.click(screen.getByRole("button", { name: /Ẩn mật khẩu/i }));
    expect(passwordInput.type).toBe("password");
  });
});
