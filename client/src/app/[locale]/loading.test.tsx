import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import Loading from "./loading";

describe("Root Loading component", () => {
  it("renders page loading skeleton with proper status role and branding", () => {
    render(<Loading />);

    const loadingContainer = screen.getByTestId("page-loading-skeleton");
    expect(loadingContainer).toBeInTheDocument();
    expect(loadingContainer).toHaveAttribute("role", "status");
    expect(loadingContainer).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Chickie Studio")).toBeInTheDocument();
  });

  it("passes accessibility audit without violations", async () => {
    const { container } = render(<Loading />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
