import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Pagination } from "./Pagination";

describe("Pagination Component (CRM)", () => {
  it("renders page buttons and handles page change", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={10}
        onPageChange={handlePageChange}
        showTotal
        totalItems={100}
      />
    );

    expect(screen.getByText("100")).toBeInTheDocument();
    const page2 = screen.getByRole("button", { name: "2" });
    fireEvent.click(page2);

    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={4}
        onPageChange={() => {}}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
