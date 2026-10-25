import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Pagination } from "./Pagination";

describe("Pagination Component (Client)", () => {
  it("renders page buttons and triggers onPageChange", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={handlePageChange}
        showTotal
        totalItems={50}
      />
    );

    expect(screen.getByText("50")).toBeInTheDocument();
    const page3 = screen.getByRole("button", { name: "3" });
    fireEvent.click(page3);

    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("handles previous and next buttons", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />
    );

    const prevBtn = screen.getByLabelText("Trang trước");
    const nextBtn = screen.getByLabelText("Trang tiếp");

    expect(prevBtn).toBeDisabled();
    expect(nextBtn).not.toBeDisabled();

    fireEvent.click(nextBtn);
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it("renders ellipsis when pages are many", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={() => {}}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getAllByText("Nhiều trang hơn").length).toBeGreaterThan(0);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={() => {}}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
