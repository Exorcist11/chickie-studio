import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Rating } from "./Rating";

describe("Rating component", () => {
  it("renders score and star count", () => {
    render(<Rating score={4.8} reviewCount={42} />);
    expect(screen.getByText("4.8")).toBeInTheDocument();
    expect(screen.getByText("(42 đánh giá)")).toBeInTheDocument();
  });

  it("has correct accessible label", () => {
    render(<Rating score={5} reviewCount={10} reviewLabel="nhận xét" />);
    const container = screen.getByLabelText(/đánh giá 5 trên 5 sao với 10 nhận xét/i);
    expect(container).toBeInTheDocument();
  });

  it("can hide review count", () => {
    render(<Rating score={4.5} reviewCount={20} showCount={false} />);
    expect(screen.queryByText(/20/)).toBeNull();
    expect(screen.getByText("4.5")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Rating score={4.9} reviewCount={88} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
