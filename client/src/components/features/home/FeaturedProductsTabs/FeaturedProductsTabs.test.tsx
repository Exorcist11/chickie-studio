import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { FeaturedProductsTabs } from "./FeaturedProductsTabs";
import { DEFAULT_FEATURED_PRODUCTS } from "@/lib/api/product";

describe("FeaturedProductsTabs component", () => {
  it("renders heading and category filter chips", () => {
    render(<FeaturedProductsTabs products={DEFAULT_FEATURED_PRODUCTS} />);

    expect(screen.getByRole("heading", { name: "Sản phẩm nổi bật" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tất cả" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Áo dài" })).toBeInTheDocument();
  });

  it("filters products when clicking a tab chip", async () => {
    const user = userEvent.setup();
    render(<FeaturedProductsTabs products={DEFAULT_FEATURED_PRODUCTS} />);

    const aoDaiTab = screen.getByRole("button", { name: "Áo dài" });
    await user.click(aoDaiTab);

    // Matches ao dai product link
    expect(
      screen.getAllByRole("link", { name: /Áo dài cách tân/i }).length
    ).toBeGreaterThan(0);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <FeaturedProductsTabs products={DEFAULT_FEATURED_PRODUCTS} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
