import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ProductCatalogView } from "./ProductCatalogView";
import { DEFAULT_FEATURED_PRODUCTS } from "@/lib/api/product";
import { DEFAULT_CATEGORIES } from "@/lib/api/category";

describe("ProductCatalogView component", () => {
  it("renders catalog toolbar, sort select, and initial product cards", () => {
    render(
      <ProductCatalogView
        products={DEFAULT_FEATURED_PRODUCTS}
        categories={DEFAULT_CATEGORIES}
      />
    );

    expect(screen.getByRole("combobox", { name: "Sắp xếp sản phẩm" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Tìm theo tên váy, mã sản phẩm...")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Đầm maxi/i }).length).toBeGreaterThan(0);
  });

  it("sorts products by rental price ascending when selecting price-asc option", async () => {
    const user = userEvent.setup();
    render(
      <ProductCatalogView
        products={DEFAULT_FEATURED_PRODUCTS}
        categories={DEFAULT_CATEGORIES}
      />
    );

    const sortSelect = screen.getByRole("combobox", { name: "Sắp xếp sản phẩm" });
    await user.selectOptions(sortSelect, "price-asc");

    expect(sortSelect).toHaveValue("price-asc");
  });

  it("filters products by search keyword", async () => {
    const user = userEvent.setup();
    render(
      <ProductCatalogView
        products={DEFAULT_FEATURED_PRODUCTS}
        categories={DEFAULT_CATEGORIES}
      />
    );

    const searchInput = screen.getByPlaceholderText("Tìm theo tên váy, mã sản phẩm...");
    await user.type(searchInput, "Sony");

    expect(screen.getAllByRole("link", { name: /Sony/i }).length).toBeGreaterThan(0);
  });

  it("clears all filters when clicking clear button", async () => {
    const user = userEvent.setup();
    render(
      <ProductCatalogView
        products={DEFAULT_FEATURED_PRODUCTS}
        categories={DEFAULT_CATEGORIES}
      />
    );

    const searchInput = screen.getByPlaceholderText("Tìm theo tên váy, mã sản phẩm...");
    await user.type(searchInput, "Từ khóa không tồn tại 123456");

    expect(screen.getByText("Chưa tìm thấy sản phẩm phù hợp")).toBeInTheDocument();

    const clearBtns = screen.getAllByRole("button", { name: /Xóa tất cả bộ lọc/i });
    await user.click(clearBtns[0]);

    expect(screen.getAllByRole("link", { name: /Đầm maxi/i }).length).toBeGreaterThan(0);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ProductCatalogView
        products={DEFAULT_FEATURED_PRODUCTS}
        categories={DEFAULT_CATEGORIES}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
