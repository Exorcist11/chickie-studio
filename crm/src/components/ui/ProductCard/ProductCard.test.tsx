import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ProductCard } from "./ProductCard";

describe("CRM ProductCard Component", () => {
  const sampleColors = [
    { name: "Burgundy", hex: "#641D2B" },
    { name: "Gold", hex: "#B8914F" },
  ];

  it("renders product name, code, category, and formatted price", () => {
    render(
      <ProductCard
        id="1"
        name="Váy Nàng Thơ Lụa"
        code="CK-DR-01"
        category="Dạ hội"
        imageUrl="https://example.com/dress.jpg"
        price={450000}
        rating={4.9}
        reviewCount={12}
        colors={sampleColors}
      />
    );

    expect(screen.getByText("Váy Nàng Thơ Lụa")).toBeInTheDocument();
    expect(screen.getByText("CK-DR-01")).toBeInTheDocument();
    expect(screen.getByText("Dạ hội")).toBeInTheDocument();
    expect(screen.getByText("450.000₫")).toBeInTheDocument();
    expect(screen.getByAltText("Váy Nàng Thơ Lụa")).toBeInTheDocument();
  });

  it("handles onSelect and onEdit actions", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onEdit = vi.fn();

    render(
      <ProductCard
        id="1"
        name="Váy Nàng Thơ Lụa"
        imageUrl="https://example.com/dress.jpg"
        price={450000}
        onSelect={onSelect}
        onEdit={onEdit}
      />
    );

    await user.click(screen.getByRole("button", { name: "Xem chi tiết Váy Nàng Thơ Lụa" }));
    expect(onSelect).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Chỉnh sửa Váy Nàng Thơ Lụa" }));
    expect(onEdit).toHaveBeenCalled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <ProductCard
        id="1"
        name="Váy Công Chúa Đính Đá"
        imageUrl="https://example.com/dress.jpg"
        price={600000}
        category="Váy dạ hội"
        colors={sampleColors}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
