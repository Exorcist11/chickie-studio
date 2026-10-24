import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { ServiceCard } from "./ServiceCard";

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe("ServiceCard component", () => {
  const sampleService = {
    title: "Thuê váy thiết kế",
    description: "Đa dạng phong cách, từ dịu dàng nữ tính đến cá tính hiện đại.",
    imageUrl: "/images/service-dress.jpg",
    href: "/danh-muc/vay-thiet-ke",
  };

  it("renders title, description and link", () => {
    render(<ServiceCard {...sampleService} />);
    expect(screen.getByRole("heading", { name: "Thuê váy thiết kế" })).toBeInTheDocument();
    expect(screen.getByText(/đa dạng phong cách/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /khám phá/i })).toHaveAttribute(
      "href",
      "/danh-muc/vay-thiet-ke"
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<ServiceCard {...sampleService} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
