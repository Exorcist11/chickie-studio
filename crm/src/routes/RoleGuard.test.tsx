import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { RoleGuard } from "./RoleGuard";
import * as AuthContextModule from "../context/AuthContext";
import "../i18n";

describe("RoleGuard", () => {
  const routerFuture = { v7_startTransition: true, v7_relativeSplatPath: true };

  it("renders loading indicator when auth is loading", () => {
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn(),
    });

    render(
      <MemoryRouter future={routerFuture}>
        <RoleGuard>
          <div>Protected Content</div>
        </RoleGuard>
      </MemoryRouter>
    );

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("redirects to /login when unauthenticated", () => {
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      hasRole: vi.fn(),
    });

    render(
      <MemoryRouter future={routerFuture} initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <RoleGuard>
                <div>Protected Content</div>
              </RoleGuard>
            }
          />
          <Route path="/login" element={<div data-testid="login-screen">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("login-screen")).toBeInTheDocument();
  });

  it("redirects to /403 when role is not allowed", () => {
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: {
        id: 2,
        username: "staff",
        email: "staff@chickie.vn",
        fullName: "Staff",
        role: "ROLE_STAFF",
        status: "ACTIVE",
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      hasRole: () => false,
    });

    render(
      <MemoryRouter future={routerFuture} initialEntries={["/settings"]}>
        <Routes>
          <Route
            path="/settings"
            element={
              <RoleGuard allowedRoles={["ROLE_ADMIN"]}>
                <div>Settings Page</div>
              </RoleGuard>
            }
          />
          <Route path="/403" element={<div data-testid="forbidden-screen">403 Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("forbidden-screen")).toBeInTheDocument();
  });

  it("renders protected content when authenticated and role matches", () => {
    vi.spyOn(AuthContextModule, "useAuth").mockReturnValue({
      user: {
        id: 1,
        username: "admin",
        email: "admin@chickie.vn",
        fullName: "Admin",
        role: "ROLE_ADMIN",
        status: "ACTIVE",
      },
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
      hasRole: () => true,
    });

    render(
      <MemoryRouter future={routerFuture} initialEntries={["/settings"]}>
        <Routes>
          <Route
            path="/settings"
            element={
              <RoleGuard allowedRoles={["ROLE_ADMIN"]}>
                <div data-testid="settings-content">Settings Page</div>
              </RoleGuard>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("settings-content")).toBeInTheDocument();
  });
});
