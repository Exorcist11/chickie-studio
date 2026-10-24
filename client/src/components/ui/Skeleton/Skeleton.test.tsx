import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "./Skeleton";

describe("Skeleton component", () => {
  it("renders with animate-pulse and rounded class", () => {
    render(<Skeleton data-testid="skeleton" rounded="card" className="h-40 w-full" />);
    const el = screen.getByTestId("skeleton");
    expect(el).toHaveClass("animate-pulse");
    expect(el).toHaveClass("rounded-card");
  });
});
