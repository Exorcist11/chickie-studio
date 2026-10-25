import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { StickyBottomCta } from "./StickyBottomCta";

describe("StickyBottomCta", () => {
  it("renders price and deposit formatted correctly", () => {
    render(
      <StickyBottomCta
        rentalPrice={250000}
        depositPrice={800000}
        pillar="COSTUME"
      />
    );

    expect(screen.getByText("250.000đ")).toBeInTheDocument();
    expect(screen.getByText("800.000đ")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Đặt lịch ngay" })).toBeInTheDocument();
  });

  it("scrolls to booking form when clicking 'Đặt lịch ngay'", async () => {
    const user = userEvent.setup();
    const scrollMock = vi.fn();
    const mockElement = document.createElement("div");
    mockElement.id = "booking-form-section";
    mockElement.scrollIntoView = scrollMock;
    document.body.appendChild(mockElement);

    render(
      <StickyBottomCta
        rentalPrice={250000}
        depositPrice={800000}
      />
    );

    const btn = screen.getByRole("button", { name: "Đặt lịch ngay" });
    await user.click(btn);

    expect(scrollMock).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
    document.body.removeChild(mockElement);
  });

  it("opens size guide when size button is clicked", async () => {
    const user = userEvent.setup();
    const handleOpenSize = vi.fn();

    render(
      <StickyBottomCta
        rentalPrice={250000}
        depositPrice={800000}
        pillar="COSTUME"
        onOpenSizeGuide={handleOpenSize}
      />
    );

    const sizeBtn = screen.getByRole("button", { name: "Xem bảng quy đổi kích cỡ" });
    await user.click(sizeBtn);

    expect(handleOpenSize).toHaveBeenCalled();
  });

  it("passes accessibility checks", async () => {
    const { container } = render(
      <StickyBottomCta
        rentalPrice={250000}
        depositPrice={800000}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
