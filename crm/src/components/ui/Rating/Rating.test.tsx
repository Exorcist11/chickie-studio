import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Rating } from "./Rating";

describe("CRM Rating Component", () => {
  it("renders star icons and score", () => {
    render(<Rating score={4.5} reviewCount={18} />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      "Đánh giá 4.5 trên 5 sao với 18 đánh giá"
    );
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("(18 đánh giá)")).toBeInTheDocument();
  });

  it("supports sm and md sizes", () => {
    const { rerender } = render(<Rating score={5} size="sm" />);
    expect(screen.getByText("5.0")).toHaveClass("text-xs");

    rerender(<Rating score={5} size="md" />);
    expect(screen.getByText("5.0")).toHaveClass("text-sm");
  });

  it("can hide count", () => {
    render(<Rating score={4} reviewCount={10} showCount={false} />);
    expect(screen.queryByText("(10 đánh giá)")).toBeNull();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Rating score={4.8} reviewCount={25} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
