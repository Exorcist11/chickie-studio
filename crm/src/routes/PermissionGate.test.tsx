import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PermissionGate } from "./PermissionGate";
import * as AuthContextModule from "../context/AuthContext";

describe("PermissionGate", () => {
  it("renders children when user has required role", () => {
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
      hasRole: (roles) => {
        const allowed = Array.isArray(roles) ? roles : [roles];
        return allowed.includes("ROLE_ADMIN");
      },
    });

    render(
      <PermissionGate allowedRoles="ROLE_ADMIN">
        <div data-testid="admin-content">Admin Secret</div>
      </PermissionGate>
    );

    expect(screen.getByTestId("admin-content")).toBeInTheDocument();
  });

  it("renders fallback when user does not have required role", () => {
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
      <PermissionGate
        allowedRoles="ROLE_ADMIN"
        fallback={<div data-testid="no-access">No Access</div>}
      >
        <div data-testid="admin-content">Admin Secret</div>
      </PermissionGate>
    );

    expect(screen.queryByTestId("admin-content")).not.toBeInTheDocument();
    expect(screen.getByTestId("no-access")).toBeInTheDocument();
  });
});
