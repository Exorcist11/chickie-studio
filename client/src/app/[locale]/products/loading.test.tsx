import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import ProductsLoading from "./loading";

describe("Products Loading component", () => {
  it("renders catalog loading skeleton with banner and product grid placeholders", () => {
    render(<ProductsLoading />);

    const loadingContainer = screen.getByTestId("products-loading-skeleton");
    expect(loadingContainer).toBeInTheDocument();
    expect(loadingContainer).toHaveAttribute("role", "status");
    expect(loadingContainer).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Chickie Studio Catalog")).toBeInTheDocument();
  });

  it("passes accessibility audit without violations", async () => {
    const { container } = render(<ProductsLoading />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
