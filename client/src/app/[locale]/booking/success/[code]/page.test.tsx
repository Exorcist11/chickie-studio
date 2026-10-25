import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import BookingSuccessPage from "./page";
import * as bookingApi from "@/lib/api/booking";
import { BookingResponse } from "@/types/booking";

vi.mock("next/navigation", () => ({
  useParams: () => ({ code: "BK20261110-8888" }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockBookingData: BookingResponse = {
  id: 101,
  bookingCode: "BK20261110-8888",
  customerName: "Nguyễn Văn A",
  customerPhone: "0912345678",
  rentalStartDate: "2026-11-20",
  rentalEndDate: "2026-11-22",
  durationDays: 2,
  deliveryMethod: "PICKUP_STORE",
  deliveryAddress: "",
  note: "Lấy đồ buổi sáng",
  status: "PENDING",
  totalRentalPrice: 500000,
  totalDepositPrice: 1000000,
  totalAmount: 1500000,
  createdAt: "2026-10-25T08:00:00Z",
  items: [
    {
      id: 201,
      variantId: 701,
      productName: "Váy Dạ Hội Công Chúa Lộng Lẫy",
      variantSize: "M",
      variantColor: "Đỏ Rượu",
      productItemCode: "VA-001-01",
      rentalStartDate: "2026-11-20",
      rentalEndDate: "2026-11-22",
      rentalPrice: 500000,
      depositPrice: 1000000,
    },
  ],
};

describe("BookingSuccessPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it("renders loading state initially", () => {
    vi.spyOn(bookingApi, "getBookingByCode").mockReturnValue(
      new Promise(() => {}) // never resolves
    );

    render(<BookingSuccessPage />);
    expect(
      screen.getByText("Đang tải hóa đơn đơn hàng...")
    ).toBeInTheDocument();
  });

  it("renders booking details and VietQR code image upon fetch success", async () => {
    vi.spyOn(bookingApi, "getBookingByCode").mockResolvedValue(mockBookingData);

    render(<BookingSuccessPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Biên Nhận Giữ Đồ Chickie Studio")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("BK20261110-8888")).toBeInTheDocument();
    expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    expect(screen.getByText("0912345678")).toBeInTheDocument();
    expect(screen.getByText("Váy Dạ Hội Công Chúa Lộng Lẫy")).toBeInTheDocument();

    // Verify QR Image is displayed
    const qrImage = screen.getByAltText(
      "Mã QR chuyển khoản cọc VietQR Chickie Studio"
    );
    expect(qrImage).toBeInTheDocument();
    expect(qrImage.getAttribute("src")).toContain("img.vietqr.io");
    expect(qrImage.getAttribute("src")).toContain("999988886666");

    // Bank account info
    expect(screen.getByText("MB Bank (Ngân hàng Quân Đội)")).toBeInTheDocument();
    expect(screen.getByText("9999 8888 6666")).toBeInTheDocument();
    expect(
      screen.getByText("CHICKIE STUDIO - LE THI PHUONG ANH")
    ).toBeInTheDocument();
  });

  it("allows opening and closing the QR zoom lightbox modal", async () => {
    vi.spyOn(bookingApi, "getBookingByCode").mockResolvedValue(mockBookingData);

    render(<BookingSuccessPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Biên Nhận Giữ Đồ Chickie Studio")
      ).toBeInTheDocument();
    });

    // Click "Phóng to" button
    const zoomButton = screen.getByRole("button", { name: /phóng to/i });
    fireEvent.click(zoomButton);

    // Modal dialog should appear
    expect(
      screen.getByRole("dialog", { name: "Mã QR chuyển khoản cọc phóng to" })
    ).toBeInTheDocument();

    const largeQrImage = screen.getByAltText(
      "Mã QR chuyển khoản cọc VietQR Chickie Studio phóng to"
    );
    expect(largeQrImage).toBeInTheDocument();

    // Click "Đóng" in modal
    const closeButton = screen.getByRole("button", { name: "Đóng" });
    fireEvent.click(closeButton);

    expect(
      screen.queryByRole("dialog", { name: "Mã QR chuyển khoản cọc phóng to" })
    ).not.toBeInTheDocument();
  });

  it("handles copying code and bank account to clipboard", async () => {
    vi.spyOn(bookingApi, "getBookingByCode").mockResolvedValue(mockBookingData);

    render(<BookingSuccessPage />);

    await waitFor(() => {
      expect(screen.getByText("BK20261110-8888")).toBeInTheDocument();
    });

    const copyCodeBtn = screen.getByRole("button", { name: "Sao chép mã đơn" });
    await waitFor(() => {
      fireEvent.click(copyCodeBtn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("BK20261110-8888");

    const copyBankBtn = screen.getByRole("button", {
      name: "Sao chép số tài khoản",
    });
    await waitFor(() => {
      fireEvent.click(copyBankBtn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("999988886666");
  });

  it("renders error state when booking is not found", async () => {
    vi.spyOn(bookingApi, "getBookingByCode").mockRejectedValue(
      new Error("Không tìm thấy đơn hàng")
    );

    render(<BookingSuccessPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Không Tìm Thấy Đơn Đặt Thuê")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Không tìm thấy đơn hàng")
    ).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    vi.spyOn(bookingApi, "getBookingByCode").mockResolvedValue(mockBookingData);

    const { container } = render(<BookingSuccessPage />);

    await waitFor(() => {
      expect(
        screen.getByText("Biên Nhận Giữ Đồ Chickie Studio")
      ).toBeInTheDocument();
    });

    const mainEl = container.querySelector("main");
    expect(mainEl).toBeTruthy();
    const results = await axe(mainEl!);
    expect(results).toHaveNoViolations();
  });
});
