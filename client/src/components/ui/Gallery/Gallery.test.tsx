import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Gallery } from "./Gallery";

const mockItems = [
  { id: 1, src: "https://images.unsplash.com/photo-1", alt: "Ảnh 1" },
  { id: 2, src: "https://images.unsplash.com/photo-2", alt: "Ảnh 2" },
  { id: 3, src: "https://images.unsplash.com/photo-3", alt: "Ảnh 3" },
];

describe("Gallery Component (Client)", () => {
  it("renders gallery with counter and thumbnails", () => {
    render(<Gallery items={mockItems} />);

    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(screen.getByAltText("Ảnh 1")).toBeInTheDocument();
  });

  it("navigates next and previous images", () => {
    render(<Gallery items={mockItems} />);

    const nextBtn = screen.getByRole("button", { name: "Ảnh tiếp theo" });
    const prevBtn = screen.getByRole("button", { name: "Ảnh trước" });

    fireEvent.click(nextBtn);
    expect(screen.getByText("2 / 3")).toBeInTheDocument();

    fireEvent.click(prevBtn);
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("selects image when clicking thumbnail", () => {
    render(<Gallery items={mockItems} />);

    const thumb3 = screen.getByRole("button", { name: "Xem ảnh 3" });
    fireEvent.click(thumb3);

    expect(screen.getByText("3 / 3")).toBeInTheDocument();
  });

  it("opens and closes lightbox modal", () => {
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
