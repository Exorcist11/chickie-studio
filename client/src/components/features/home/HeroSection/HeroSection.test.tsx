import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { HeroSection } from "./HeroSection";

describe("HeroSection component", () => {
  it("renders main headline, tagline badge, and CTA button", () => {
    render(<HeroSection />);

    expect(screen.getByText("Chickie Studio • More than just a dress")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Khám phá bộ sưu tập/i })).toBeInTheDocument();
  });

  it("handles slider navigation controls", async () => {
    const user = userEvent.setup();
    render(<HeroSection />);

    expect(screen.getByText("01")).toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: "Slide kế tiếp" });
    const prevBtn = screen.getByRole("button", { name: "Slide trước" });

    await user.click(nextBtn);
    expect(screen.getByText("02")).toBeInTheDocument();

    await user.click(prevBtn);
    expect(screen.getByText("01")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<HeroSection />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
