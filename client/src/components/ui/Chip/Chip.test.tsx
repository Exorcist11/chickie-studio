import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Chip, ChipGroup } from "./Chip";

describe("Chip & ChipGroup components", () => {
  it("renders unselected and selected chip", () => {
    const { rerender } = render(<Chip selected={false}>Váy dạ hội</Chip>);
    const chip = screen.getByRole("checkbox", { name: "Váy dạ hội" });
    expect(chip).toHaveAttribute("aria-checked", "false");
    expect(chip).toHaveClass("bg-rose/40");

    rerender(<Chip selected={true}>Váy dạ hội</Chip>);
    expect(chip).toHaveAttribute("aria-checked", "true");
    expect(chip).toHaveClass("bg-burgundy");
  });

  it("handles click and toggle callback", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();
    render(<Chip onToggle={handleToggle}>Áo dài</Chip>);

    await user.click(screen.getByRole("checkbox", { name: "Áo dài" }));
    expect(handleToggle).toHaveBeenCalledWith(true);
  });

  it("renders ChipGroup in single select mode", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const options = [
      { label: "Tất cả", value: "all" },
      { label: "Mới nhất", value: "new" },
      { label: "Bán chạy", value: "hot" },
    ];

    render(<ChipGroup options={options} value="all" onChange={handleChange} />);
    expect(screen.getByRole("checkbox", { name: "Tất cả" })).toHaveAttribute("aria-checked", "true");
    expect(screen.getByRole("checkbox", { name: "Mới nhất" })).toHaveAttribute("aria-checked", "false");

    await user.click(screen.getByRole("checkbox", { name: "Mới nhất" }));
    expect(handleChange).toHaveBeenCalledWith("new");
  });

  it("renders ChipGroup in multi select mode", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const options = [
      { label: "Size S", value: "S" },
      { label: "Size M", value: "M" },
      { label: "Size L", value: "L" },
    ];

    render(
      <ChipGroup
        options={options}
        value={["S"]}
        multiple
        onChange={handleChange}
      />
    );

    await user.click(screen.getByRole("checkbox", { name: "Size M" }));
    expect(handleChange).toHaveBeenCalledWith(["S", "M"]);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Chip selected={true}>Bộ lọc váy</Chip>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
