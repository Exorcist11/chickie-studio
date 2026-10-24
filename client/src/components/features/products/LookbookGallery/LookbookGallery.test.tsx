import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { LookbookGallery } from "./LookbookGallery";

const mockImages = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1?w=800",
    isThumbnail: true,
    displayOrder: 1,
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-2?w=800",
    isThumbnail: false,
    displayOrder: 2,
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-3?w=800",
    isThumbnail: false,
    displayOrder: 3,
  },
];

describe("LookbookGallery component", () => {
  it("renders correctly with given images", () => {
    render(<LookbookGallery productName="Váy Dạ Hội" images={mockImages} />);

    expect(screen.getByText("Lookbook Chickie Studio")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(screen.getByAltText("Váy Dạ Hội - Ảnh 1")).toBeInTheDocument();
  });

  it("handles next and prev navigation buttons", async () => {
    const user = userEvent.setup();
    render(<LookbookGallery productName="Váy Dạ Hội" images={mockImages} />);

    const nextBtn = screen.getByRole("button", { name: "Ảnh kế tiếp" });
    const prevBtn = screen.getByRole("button", { name: "Ảnh trước" });

    await user.click(nextBtn);
    expect(screen.getByText("2 / 3")).toBeInTheDocument();

    await user.click(nextBtn);
    expect(screen.getByText("3 / 3")).toBeInTheDocument();

    // Loops back to first image
    await user.click(nextBtn);
    expect(screen.getByText("1 / 3")).toBeInTheDocument();

    // Prev goes to last
    await user.click(prevBtn);
    expect(screen.getByText("3 / 3")).toBeInTheDocument();
  });

  it("allows selecting image by clicking thumbnail", async () => {
    const user = userEvent.setup();
    render(<LookbookGallery productName="Váy Dạ Hội" images={mockImages} />);

    const thumbnail2 = screen.getByRole("tab", { name: "Xem ảnh 2" });
    await user.click(thumbnail2);

    expect(screen.getByText("2 / 3")).toBeInTheDocument();
    expect(thumbnail2).toHaveAttribute("aria-selected", "true");
  });

  it("renders fallback image when images array is empty", () => {
    render(<LookbookGallery productName="Váy Mẫu" images={[]} />);
    expect(screen.getByText("1 / 1")).toBeInTheDocument();
    expect(screen.getByAltText("Váy Mẫu - Ảnh 1")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <LookbookGallery productName="Váy Dạ Hội" images={mockImages} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
