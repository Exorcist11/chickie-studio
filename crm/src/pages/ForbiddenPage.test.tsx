import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ForbiddenPage } from "./ForbiddenPage";
import "../i18n";

describe("ForbiddenPage", () => {
  it("renders access denied details and home button", () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ForbiddenPage />
      </MemoryRouter>
    );

    expect(screen.getByTestId("forbidden-page")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
