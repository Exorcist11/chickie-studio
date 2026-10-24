import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { SizeSelector } from "./SizeSelector";

describe("SizeSelector component", () => {
  it("renders default sizes and handles change", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<SizeSelector value="S" onChange={handleChange} />);
    expect(screen.getByRole("radio", { name: "S" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("radio", { name: "M" })).toHaveAttribute("aria-checked", "false");

    await user.click(screen.getByRole("radio", { name: "M" }));
    expect(handleChange).toHaveBeenCalledWith("M");
  });

  it("disables out-of-stock sizes", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const customSizes = [
      { value: "S", disabled: false },
      { value: "M", disabled: true },
    ];

    render(<SizeSelector sizes={customSizes} onChange={handleChange} />);
    const mSize = screen.getByRole("radio", { name: "M" });
    expect(mSize).toBeDisabled();

    await user.click(mSize);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<SizeSelector value="M" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
