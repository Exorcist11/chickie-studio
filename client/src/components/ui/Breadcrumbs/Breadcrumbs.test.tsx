import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Breadcrumbs } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  it("renders breadcrumb list with home item by default", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Chính sách", href: "/chinh-sach-thue-do" },
          { label: "Quy định cọc" },
        ]}
      />
    );

    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav).toBeInTheDocument();

    const homeLink = screen.getByRole("link", { name: "Trang chủ" });
    expect(homeLink).toHaveAttribute("href", "/");

    const policyLink = screen.getByRole("link", { name: "Chính sách" });
    expect(policyLink).toHaveAttribute("href", "/chinh-sach-thue-do");

    const currentPage = screen.getByText("Quy định cọc");
    expect(currentPage).toHaveAttribute("aria-current", "page");
  });

  it("supports custom home label and home href", () => {
    render(
      <Breadcrumbs
        homeLabel="Home"
        homeHref="/en"
        items={[{ label: "FAQ" }]}
      />
    );

    const homeLink = screen.getByRole("link", { name: "Home" });
    expect(homeLink).toHaveAttribute("href", "/en");

    const faqCurrent = screen.getByText("FAQ");
    expect(faqCurrent).toHaveAttribute("aria-current", "page");
  });
});
