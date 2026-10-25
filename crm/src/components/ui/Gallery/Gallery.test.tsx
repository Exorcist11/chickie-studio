import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Gallery } from "./Gallery";

const mockItems = [
  { id: 1, src: "https://example.com/1.jpg", alt: "Ảnh 1" },
  { id: 2, src: "https://example.com/2.jpg", alt: "Ảnh 2" },
];

describe("Gallery Component (CRM)", () => {
  it("renders gallery, counter and navigates images", () => {
    render(<Gallery items={mockItems} />);

    expect(screen.getByText("1 / 2")).toBeInTheDocument();
    expect(screen.getByAltText("Ảnh 1")).toBeInTheDocument();

    const nextBtn = screen.getByRole("button", { name: "Ảnh tiếp theo" });
    fireEvent.click(nextBtn);

    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });

  it("opens and closes lightbox", () => {
    render(<Gallery items={mockItems} enableLightbox />);

    const zoomBtn = screen.getByRole("button", { name: "Phóng to ảnh" });
    fireEvent.click(zoomBtn);

    expect(screen.getByRole("dialog", { name: "Xem ảnh phóng to" })).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Đóng phóng to" });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole("dialog", { name: "Xem ảnh phóng to" })).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Gallery items={mockItems} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
