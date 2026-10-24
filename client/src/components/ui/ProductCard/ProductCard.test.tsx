import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ProductCard } from "./ProductCard";

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe("ProductCard component", () => {
  const sampleProduct = {
    id: "prod-1",
    name: "Đầm maxi voan xòe trắng tiểu thư",
    slug: "dam-maxi-voan-trang",
    imageUrl: "/images/dam-1.jpg",
    price: 180000,
    rating: 4.9,
    reviewCount: 36,
    colors: [
      { name: "Trắng", hex: "#FFFFFF" },
      { name: "Đỏ", hex: "#641D2B" },
    ],
  };

  it("renders product name, price, rating and swatches", () => {
    render(<ProductCard {...sampleProduct} />);
    expect(screen.getByText("Đầm maxi voan xòe trắng tiểu thư")).toBeInTheDocument();
    expect(screen.getByText(/180\.000đ/)).toBeInTheDocument();
    expect(screen.getByText("/ngày")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /đầm maxi/i })).toBeInTheDocument();
  });

  it("toggles favorite state on button click", async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();

    render(
      <ProductCard
        {...sampleProduct}
        isFavorite={false}
        onToggleFavorite={handleToggle}
      />
    );

    const favBtn = screen.getByRole("button", { name: /thêm vào yêu thích/i });
    await user.click(favBtn);

    expect(handleToggle).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: /bỏ yêu thích/i })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ProductCard {...sampleProduct} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
