import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Logo } from "./Logo";

describe("Logo component", () => {
  it("renders text and tagline in horizontal mode", () => {
    render(<Logo variant="horizontal" />);
    expect(screen.getByText("Chickie Studio")).toBeInTheDocument();
    expect(screen.getByText("More than just a dress")).toBeInTheDocument();
  });

  it("renders vertical and mono variants", () => {
    const { rerender } = render(<Logo variant="vertical" />);
    expect(screen.getByText("Chickie Studio")).toHaveClass("text-lg");

    rerender(<Logo variant="mono" />);
    expect(screen.getByText("Chickie Studio")).toHaveClass("text-warm-white");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Logo />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
