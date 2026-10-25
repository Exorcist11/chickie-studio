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

  it("renders correctly for CAMERA pillar with equipment wording and combo options", () => {
    const cameraVariants = [
      { id: 1, size: "Bộ Kit Tiêu Chuẩn", color: "Đen Canon", sku: "R50-KIT" },
      { id: 2, size: "Combo 2 Pin + Thẻ 64GB", color: "Đen Canon", sku: "R50-COMBO" },
    ];

    render(
      <BookingForm
        productId={7}
        productName="Canon EOS R50"
        rentalPrice={270000}
        depositPrice={1800000}
        variants={cameraVariants}
        pillar="CAMERA"
      />
    );

    expect(screen.getByText("Đặt Thuê Máy Ảnh & Thiết Bị")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Xác Nhận Thuê Thiết Bị" })).toBeInTheDocument();
    expect(screen.getByText(/Phiên bản \/ Bộ Combo:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Combo 2 Pin + Thẻ 64GB" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nhận & test máy trực tiếp tại Studio:/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Nhập địa chỉ nhận máy tại Hà Nội...")
    ).toBeInTheDocument();
  });

  it("renders correctly for PHOTOGRAPHY pillar with package scale and session wording", () => {
    const photographyVariants = [
      { id: 1, size: "Cá nhân (1 người)", color: "Tone Nàng Thơ", sku: "DV-1" },
      { id: 2, size: "Cặp đôi (2 người)", color: "Tone Nàng Thơ", sku: "DV-2" },
    ];

    render(
      <BookingForm
        productId={9}
        productName="Gói Chụp Ngoại Cảnh Nàng Thơ"
        rentalPrice={890000}
        depositPrice={300000}
        variants={photographyVariants}
        pillar="PHOTOGRAPHY"
      />
    );

    expect(screen.getByText("Đăng Ký & Đặt Lịch Chụp Ảnh")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Xác Nhận Đặt Lịch Chụp" })).toBeInTheDocument();
    expect(screen.getByText(/Quy mô gói chụp:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cặp đôi (2 người)" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Chụp tại Studio của Chickie:/i)).toBeInTheDocument();
  });

  it("allows selecting variants, colors, and entering address and notes", async () => {
    const user = userEvent.setup();
    const cameraVariants = [
      { id: 1, size: "Bộ Kit Tiêu Chuẩn", color: "Đen Canon", sku: "R50-KIT" },
      { id: 2, size: "Combo 2 Pin + Thẻ 64GB", color: "Bạc Vintage", sku: "R50-COMBO" },
    ];

    render(
      <BookingForm
        productId={7}
        productName="Canon EOS R50"
        rentalPrice={270000}
        depositPrice={1800000}
        variants={cameraVariants}
        pillar="CAMERA"
      />
    );

    // Click variant button
    const variantBtn = screen.getByRole("button", { name: "Combo 2 Pin + Thẻ 64GB" });
    await user.click(variantBtn);

    // Click color button
    const colorBtn = screen.getByRole("button", { name: "Bạc Vintage" });
    await user.click(colorBtn);

    // Enter address and note
    const addressInput = screen.getByPlaceholderText("Nhập địa chỉ nhận máy tại Hà Nội...");
    await user.type(addressInput, "123 Cầu Giấy, Hà Nội");

    const noteInput = screen.getByPlaceholderText("Ví dụ: Đi chụp kỷ yếu ngoại cảnh, cần hướng dẫn set màu film...");
    await user.type(noteInput, "Cần lấy lúc 8h sáng");

    expect(addressInput).toHaveValue("123 Cầu Giấy, Hà Nội");
    expect(noteInput).toHaveValue("Cần lấy lúc 8h sáng");
  });

  it("shows error when fullName is filled but phone is missing", async () => {
    const user = userEvent.setup();
    render(
      <BookingForm
        productId={1}
        productName="Váy Dạ Hội Sparkle"
        rentalPrice={200000}
        depositPrice={500000}
      />
    );

    const nameInput = screen.getByPlaceholderText("Ví dụ: Nguyễn Quỳnh Anh");
    await user.type(nameInput, "Nguyễn Mai Linh");

    const submitBtn = screen.getByRole("button", { name: "Xác Nhận Đặt Thuê Ngay" });
    await user.click(submitBtn);

    expect(
      screen.getByText("Vui lòng nhập số điện thoại để tiệm liên hệ.")
    ).toBeInTheDocument();
  });

  it("opens size guide modal and toggles calendar visibility", async () => {
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

    // Open size guide modal
    const sizeGuideBtn = screen.getByRole("button", { name: /Bảng quy đổi kích cỡ/i });
    await user.click(sizeGuideBtn);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close size guide modal
    const closeGuideBtn = screen.getByRole("button", { name: "Đóng modal" });
    await user.click(closeGuideBtn);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Toggle calendar visibility
    const toggleCalendarBtn = screen.getByRole("button", { name: "Thu gọn lịch" });
    await user.click(toggleCalendarBtn);
    expect(screen.getByRole("button", { name: "Xem lịch trống" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Xem lịch trống" }));
    expect(screen.getByRole("button", { name: "Thu gọn lịch" })).toBeInTheDocument();
  });
});

