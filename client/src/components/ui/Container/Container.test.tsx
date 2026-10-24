import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Container } from "./Container";

describe("Container component", () => {
  it("renders with container max width and padding classes", () => {
    render(<Container data-testid="container">Nội dung</Container>);
    const el = screen.getByTestId("container");
    expect(el).toHaveClass("max-w-container");
    expect(el).toHaveClass("mx-auto");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Container><p>Accessibility text</p></Container>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
