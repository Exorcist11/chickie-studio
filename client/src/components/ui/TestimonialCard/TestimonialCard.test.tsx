import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { TestimonialCard } from "./TestimonialCard";

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe("TestimonialCard component", () => {
  const sample = {
    quote: "Dịch vụ tại Chickie Studio thật sự tuyệt vời! Váy form đẹp, ảnh chụp xinh.",
    authorName: "Nguyễn Thị Mai",
    authorRole: "Khách chụp kỷ yếu",
    rating: 5,
  };

  it("renders quote, author and role", () => {
    render(<TestimonialCard {...sample} />);
    expect(screen.getByText(/dịch vụ tại chickie studio thật sự tuyệt vời/i)).toBeInTheDocument();
    expect(screen.getByText("Nguyễn Thị Mai")).toBeInTheDocument();
    expect(screen.getByText("Khách chụp kỷ yếu")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<TestimonialCard {...sample} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
