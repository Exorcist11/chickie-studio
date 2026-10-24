import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Footer } from "./Footer";

describe("Footer component", () => {
  it("renders brand tagline, navigation and contact channels", () => {
    render(<Footer hotline="0987.654.321" address="Số 12 Chùa Láng, Hà Nội" />);
    expect(screen.getByText("More than just a dress")).toBeInTheDocument();
    expect(screen.getByText(/hotline: 0987\.654\.321/i)).toBeInTheDocument();
    expect(screen.getByText(/nhắn tin zalo tư vấn/i)).toBeInTheDocument();
    expect(screen.getByText(/số 12 chùa láng, hà nội/i)).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Footer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
