import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Card } from "./Card";

describe("Card component", () => {
  it("renders card content with base classes", () => {
    render(<Card>Nội dung thẻ</Card>);
    const card = screen.getByText("Nội dung thẻ");
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass("rounded-card");
    expect(card).toHaveClass("shadow-card");
  });

  it("applies hoverEffect classes when enabled", () => {
    render(<Card hoverEffect>Thẻ có hover</Card>);
    const card = screen.getByText("Thẻ có hover");
    expect(card).toHaveClass("hover:shadow-raised");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Card><p>Thẻ hợp lệ</p></Card>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
