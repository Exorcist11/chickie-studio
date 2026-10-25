import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { ColorSwatch, ColorSwatchGroup } from "./ColorSwatch";

describe("ColorSwatch component (CRM)", () => {
  it("renders with color name and role radio", () => {
    render(<ColorSwatch color="#641D2B" name="Burgundy" selected={true} />);
    const swatch = screen.getByRole("radio", { name: "Màu Burgundy" });
    expect(swatch).toHaveAttribute("aria-checked", "true");
  });

  it("handles color selection in ColorSwatchGroup", () => {
    const handleSelect = vi.fn();
    render(
      <ColorSwatchGroup
        colors={[
          { name: "Burgundy", hex: "#641D2B" },
          { name: "Rose", hex: "#D48B97" },
        ]}
        selectedColor="#641D2B"
        onSelectColor={handleSelect}
        showName={true}
      />
    );

    expect(screen.getByText("Burgundy")).toBeInTheDocument();
    const roseBtn = screen.getByRole("radio", { name: "Màu Rose" });
    fireEvent.click(roseBtn);

    expect(handleSelect).toHaveBeenCalledWith("#D48B97");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ColorSwatch color="#641D2B" name="Burgundy" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
