import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { BookingForm } from "./BookingForm";

const mockVariants = [
  { id: 1, size: "S", color: "Trắng", sku: "SKU-S" },
  { id: 2, size: "M", color: "Đỏ", sku: "SKU-M" },
];

describe("BookingForm component", () => {
  it("renders correctly with product pricing", () => {
    render(
      <BookingForm
        productId={1}
        productName="Váy Dạ Hội Sparkle"
        rentalPrice={200000}
        depositPrice={500000}
        variants={mockVariants}
      />
    );

    expect(screen.getByText("Đặt Lịch Thuê & Thử Váy")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Xác Nhận Đặt Thuê Ngay" })).toBeInTheDocument();
  });

  it("shows error when submitting without required customer info", async () => {
    const user = userEvent.setup();
    render(
      <BookingForm
        productId={1}
        productName="Váy Dạ Hội Sparkle"
        rentalPrice={200000}
        depositPrice={500000}
      />
    );

    const submitBtn = screen.getByRole("button", { name: "Xác Nhận Đặt Thuê Ngay" });
    await user.click(submitBtn);

    expect(
      screen.getByText("Vui lòng nhập họ và tên của bạn.")
    ).toBeInTheDocument();
  });

  it("submits successfully and opens modal when all info is provided", async () => {
    const user = userEvent.setup();
    render(
      <BookingForm
        productId={1}
        productName="Váy Dạ Hội Sparkle"
        rentalPrice={200000}
        depositPrice={500000}
        variants={mockVariants}
      />
    );

    const nameInput = screen.getByPlaceholderText("Ví dụ: Nguyễn Quỳnh Anh");
    const phoneInput = screen.getByPlaceholderText("Ví dụ: 0912 345 678");

    await user.type(nameInput, "Trần Hà My");
    await user.type(phoneInput, "0988776655");

    const submitBtn = screen.getByRole("button", { name: "Xác Nhận Đặt Thuê Ngay" });
    await user.click(submitBtn);

    await waitFor(
      () => {
        expect(screen.getByText("Đặt Lịch Thuê Thành Công!")).toBeInTheDocument();
      },
      { timeout: 2000 }
    );

    expect(screen.getByText("Trần Hà My - 0988776655")).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByRole("button", { name: "Đóng" });
    await user.click(closeBtn);
    expect(screen.queryByText("Đặt Lịch Thuê Thành Công!")).not.toBeInTheDocument();
  });

  it("toggles try at studio option", async () => {
    const user = userEvent.setup();
    render(
      <BookingForm
        productId={1}
        productName="Váy Dạ Hội Sparkle"
        rentalPrice={200000}
        depositPrice={500000}
      />
    );

    const addressInput = screen.getByPlaceholderText(
      "Nhập địa chỉ nhận đồ tại Hà Nội hoặc tỉnh..."
    );
    expect(addressInput).toBeInTheDocument();

    const checkbox = screen.getByLabelText(/Thử đồ trực tiếp tại Studio:/i);
    await user.click(checkbox);

    expect(
      screen.queryByPlaceholderText("Nhập địa chỉ nhận đồ tại Hà Nội hoặc tỉnh...")
    ).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <BookingForm
        productId={1}
        productName="Váy Dạ Hội Sparkle"
        rentalPrice={200000}
        depositPrice={500000}
        variants={mockVariants}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
