import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Section } from "./Section";

describe("Section component", () => {
  it("renders with background and spacing classes", () => {
    render(
      <Section variant="ivory" data-testid="section">
        Nội dung
      </Section>
    );
    const section = screen.getByTestId("section");
    expect(section).toHaveClass("bg-ivory");
    expect(section).toHaveClass("py-16");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Section><p>Nội dung section</p></Section>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
