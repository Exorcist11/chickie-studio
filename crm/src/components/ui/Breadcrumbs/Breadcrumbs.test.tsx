import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Breadcrumbs } from "./Breadcrumbs";

describe("Breadcrumbs Component (CRM)", () => {
  it("renders breadcrumb trail with links and current item", () => {
    render(
      <Breadcrumbs
        homeLabel="Tổng quan"
        homeHref="/dashboard"
        items={[
          { label: "Sản phẩm", href: "/products" },
          { label: "Váy Nàng Thơ" },
        ]}
      />
    );

    expect(screen.getByText("Tổng quan")).toBeInTheDocument();
    expect(screen.getByText("Sản phẩm")).toBeInTheDocument();
    expect(screen.getByText("Váy Nàng Thơ")).toHaveAttribute("aria-current", "page");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: "Quản trị", href: "/admin" },
          { label: "Cài đặt" },
        ]}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
