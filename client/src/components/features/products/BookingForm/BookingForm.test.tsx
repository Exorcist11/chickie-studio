import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { BookingForm } from "./BookingForm";
import * as bookingApi from "@/lib/api/booking";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => ({}),
}));

const mockVariants = [
  { id: 1, size: "S", color: "Trắng", sku: "SKU-S" },
  { id: 2, size: "M", color: "Đỏ", sku: "SKU-M" },
];

describe("BookingForm component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockClear();
  });

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
    expect(
      screen.getByRole("button", { name: "Xác Nhận Đặt Thuê Ngay" })
    ).toBeInTheDocument();
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

    const submitBtn = screen.getByRole("button", {
      name: "Xác Nhận Đặt Thuê Ngay",
    });
    await user.click(submitBtn);

    expect(
      screen.getByText("Vui lòng nhập đầy đủ họ và tên người thuê.")
    ).toBeInTheDocument();
  });

  it("submits successfully and opens modal when all info is provided", async () => {
    const user = userEvent.setup();
    vi.spyOn(bookingApi, "createBooking").mockResolvedValueOnce({
      id: 1,
      bookingCode: "BK20261025-TEST",
      customerName: "Trần Hà My",
      customerPhone: "0988776655",
      deliveryMethod: "PICKUP_STORE",
      rentalStartDate: "2026-11-10",
      rentalEndDate: "2026-11-11",
      durationDays: 2,
      status: "PENDING",
      totalRentalPrice: 400000,
      totalDepositPrice: 500000,
      totalAmount: 900000,
      createdAt: new Date().toISOString(),
      items: [],
    });

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

    const submitBtn = screen.getByRole("button", {
      name: "Xác Nhận Đặt Thuê Ngay",
    });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Đặt Lịch Thuê Thành Công!")).toBeInTheDocument();
    });

    expect(screen.getByText("BK20261025-TEST")).toBeInTheDocument();
    expect(screen.getByText(/Trần Hà My • 0988776655/i)).toBeInTheDocument();

    // Close modal
    const closeBtn = screen.getByRole("button", { name: "Đóng" });
    await user.click(closeBtn);
    expect(
      screen.queryByText("Đặt Lịch Thuê Thành Công!")
    ).not.toBeInTheDocument();
  });

  it("handles delivery method toggle and requires address when ship to address is selected", async () => {
    const user = userEvent.setup();
    render(
      <BookingForm
        productId={1}
        productName="Váy Dạ Hội Sparkle"
        rentalPrice={200000}
        depositPrice={500000}
      />
    );

    // Initial state: PICKUP_STORE
    expect(
      screen.queryByPlaceholderText(
        "Số nhà, tên đường, ngõ ngách, phường/xã, quận..."
      )
    ).not.toBeInTheDocument();

    // Switch to SHIP_TO_ADDRESS
    const shipBtn = screen.getByRole("button", { name: /Giao hàng tận nơi/i });
    await user.click(shipBtn);

    expect(
      screen.getByPlaceholderText(
        "Số nhà, tên đường, ngõ ngách, phường/xã, quận..."
      )
    ).toBeInTheDocument();

    // Fill customer info without address
    const nameInput = screen.getByPlaceholderText("Ví dụ: Nguyễn Quỳnh Anh");
    const phoneInput = screen.getByPlaceholderText("Ví dụ: 0912 345 678");
    await user.type(nameInput, "Nguyễn Văn A");
    await user.type(phoneInput, "0912345678");

    const submitBtn = screen.getByRole("button", {
      name: "Xác Nhận Đặt Thuê Ngay",
    });
    await user.click(submitBtn);

    expect(
      screen.getByText("Vui lòng cung cấp địa chỉ giao hàng chi tiết.")
    ).toBeInTheDocument();
  });

  it("displays server error message when API fails with conflict", async () => {
    const user = userEvent.setup();
    vi.spyOn(bookingApi, "createBooking").mockRejectedValueOnce(
      new Error("Sản phẩm đã kín lịch trong khoảng thời gian đã chọn")
    );

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

    await user.type(nameInput, "Lê Thị B");
    await user.type(phoneInput, "0987654321");

    const submitBtn = screen.getByRole("button", {
      name: "Xác Nhận Đặt Thuê Ngay",
    });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText("Sản phẩm đã kín lịch trong khoảng thời gian đã chọn")
      ).toBeInTheDocument();
    });
  });

  it("navigates to receipt page when clicking xem hóa đơn chi tiết", async () => {
    const user = userEvent.setup();
    vi.spyOn(bookingApi, "createBooking").mockResolvedValueOnce({
      id: 1,
      bookingCode: "BK20261025-RECEIPT",
      customerName: "Trần Hà My",
      customerPhone: "0988776655",
      deliveryMethod: "PICKUP_STORE",
      rentalStartDate: "2026-11-10",
      rentalEndDate: "2026-11-11",
      durationDays: 2,
      status: "PENDING",
      totalRentalPrice: 400000,
      totalDepositPrice: 500000,
      totalAmount: 900000,
      createdAt: new Date().toISOString(),
      items: [],
    });

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

    const submitBtn = screen.getByRole("button", {
      name: "Xác Nhận Đặt Thuê Ngay",
    });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("BK20261025-RECEIPT")).toBeInTheDocument();
    });

    const viewReceiptBtn = screen.getByRole("button", {
      name: /Xem hóa đơn chi tiết/i,
    });
    await user.click(viewReceiptBtn);

    expect(mockPush).toHaveBeenCalledWith(
      "/booking/success/BK20261025-RECEIPT"
    );
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
      {
        id: 2,
        size: "Combo 2 Pin + Thẻ 64GB",
        color: "Đen Canon",
        sku: "R50-COMBO",
      },
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
    expect(
      screen.getByRole("button", { name: "Xác Nhận Thuê Thiết Bị" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Phiên bản \/ Bộ Combo:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Combo 2 Pin + Thẻ 64GB" })
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
    expect(
      screen.getByRole("button", { name: "Xác Nhận Đặt Lịch Chụp" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Quy mô gói chụp:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cặp đôi (2 người)" })
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
    const sizeGuideBtn = screen.getByRole("button", {
      name: /Bảng quy đổi kích cỡ/i,
    });
    await user.click(sizeGuideBtn);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Close size guide modal
    const closeGuideBtn = screen.getByRole("button", { name: "Đóng modal" });
    await user.click(closeGuideBtn);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Toggle calendar visibility
    const toggleCalendarBtn = screen.getByRole("button", {
      name: "Thu gọn lịch",
    });
    await user.click(toggleCalendarBtn);
    expect(
      screen.getByRole("button", { name: "Xem lịch trống" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Xem lịch trống" }));
    expect(
      screen.getByRole("button", { name: "Thu gọn lịch" })
    ).toBeInTheDocument();
  });

  it("handles color selection and size selection from modal", async () => {
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

    // Click color option
    const redColorBtn = screen.getByRole("button", { name: "Đỏ" });
    await user.click(redColorBtn);
    expect(redColorBtn).toHaveClass("border-burgundy");

    // Open size guide and select size M
    const sizeGuideBtn = screen.getByRole("button", {
      name: /Bảng quy đổi kích cỡ/i,
    });
    await user.click(sizeGuideBtn);

    const chooseMBtn = screen.getByRole("button", { name: "Chọn M" });
    await user.click(chooseMBtn);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("copies booking code in success modal", async () => {
    const user = userEvent.setup();
    vi.spyOn(bookingApi, "createBooking").mockResolvedValueOnce({
      id: 1,
      bookingCode: "BK20261025-COPY",
      customerName: "Trần Hà My",
      customerPhone: "0988776655",
      deliveryMethod: "PICKUP_STORE",
      rentalStartDate: "2026-11-10",
      rentalEndDate: "2026-11-11",
      durationDays: 2,
      status: "PENDING",
      totalRentalPrice: 400000,
      totalDepositPrice: 500000,
      totalAmount: 900000,
      createdAt: new Date().toISOString(),
      items: [],
    });

    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
      configurable: true,
    });

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

    const submitBtn = screen.getByRole("button", {
      name: "Xác Nhận Đặt Thuê Ngay",
    });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("BK20261025-COPY")).toBeInTheDocument();
    });

    const copyBtn = screen.getByTitle("Sao chép mã");
    await user.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("BK20261025-COPY");
  });
});
