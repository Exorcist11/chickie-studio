import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Chip, ChipGroup } from "./Chip";

describe("Chip and ChipGroup component (CRM)", () => {
  it("renders chip and toggles on click", () => {
    const handleToggle = vi.fn();
    render(
      <Chip selected={false} onToggle={handleToggle}>
        Váy dạ hội
      </Chip>
    );

    const chip = screen.getByRole("checkbox", { name: "Váy dạ hội" });
    expect(chip).toHaveAttribute("aria-checked", "false");

    fireEvent.click(chip);
    expect(handleToggle).toHaveBeenCalledWith(true);
  });

  it("handles ChipGroup single and multiple selection", () => {
    const handleChange = vi.fn();
    render(
      <ChipGroup
        options={[
          { label: "Mẫu S", value: "S" },
          { label: "Mẫu M", value: "M" },
        ]}
        value="S"
        onChange={handleChange}
      />
    );

    const mChip = screen.getByRole("checkbox", { name: "Mẫu M" });
    fireEvent.click(mChip);
    expect(handleChange).toHaveBeenCalledWith("M");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Chip selected={true}>Đang thuê</Chip>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
