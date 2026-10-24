import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ColorSwatch, ColorSwatchGroup } from "./ColorSwatch";

describe("ColorSwatch & ColorSwatchGroup", () => {
  const sampleColors = [
    { name: "Trắng ngọc trai", hex: "#FFFFFF" },
    { name: "Đỏ burgundy", hex: "#641D2B" },
    { name: "Hồng pastel", hex: "#DCC8BD" },
  ];

  it("renders swatches and handles selection", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <ColorSwatchGroup
        colors={sampleColors}
        selectedColor="#FFFFFF"
        onSelectColor={handleSelect}
        showName
      />
    );

    expect(screen.getByText("Trắng ngọc trai")).toBeInTheDocument();
    const redSwatch = screen.getByRole("radio", { name: "Màu Đỏ burgundy" });
    await user.click(redSwatch);
    expect(handleSelect).toHaveBeenCalledWith("#641D2B");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ColorSwatchGroup colors={sampleColors} selectedColor="#641D2B" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
