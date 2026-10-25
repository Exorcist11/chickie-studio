import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { SizeSelector } from "./SizeSelector";

describe("SizeSelector component (CRM)", () => {
  it("renders with default sizes and label", () => {
    render(<SizeSelector value="M" />);
    expect(screen.getByText("Kích cỡ:")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "M" })).toBeInTheDocument();
  });

  it("selects a size on click", () => {
    const handleChange = vi.fn();
    render(<SizeSelector value="S" onChange={handleChange} />);

    const mBtn = screen.getByRole("radio", { name: "M" });
    fireEvent.click(mBtn);

    expect(handleChange).toHaveBeenCalledWith("M");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SizeSelector value="L" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
