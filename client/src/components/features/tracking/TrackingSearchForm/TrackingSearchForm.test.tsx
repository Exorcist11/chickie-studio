import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TrackingSearchForm } from "./TrackingSearchForm";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      bookingCodeLabel: "Mã đơn thuê",
      bookingCodePlaceholder: "Ví dụ: BK20261025-XXXX",
      bookingCodeHelp: "Mã đơn được gửi trong biên nhận",
      phoneLabel: "Số điện thoại đặt đồ",
      phonePlaceholder: "Ví dụ: 0987654321",
      phoneHelp: "Số điện thoại chính xác",
      submitButton: "Tra cứu đơn hàng",
      submitting: "Đang tra cứu...",
    };
    return translations[key] || key;
  },
}));

describe("TrackingSearchForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with fields and labels", () => {
    render(<TrackingSearchForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText("Mã đơn thuê")).toBeInTheDocument();
    expect(screen.getByText("Số điện thoại đặt đồ")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Tra cứu đơn hàng/i })
    ).toBeInTheDocument();
  });

  it("populates initial values when provided", () => {
    render(
      <TrackingSearchForm
        initialValues={{
          bookingCode: "BK20261025-TEST",
          phone: "0901234567",
        }}
        onSubmit={mockOnSubmit}
      />
    );

    const codeInput = screen.getByTestId("input-booking-code") as HTMLInputElement;
    const phoneInput = screen.getByTestId("input-phone") as HTMLInputElement;

    expect(codeInput.value).toBe("BK20261025-TEST");
    expect(phoneInput.value).toBe("0901234567");
  });

  it("submits valid form values successfully", async () => {
    const user = userEvent.setup();
    render(<TrackingSearchForm onSubmit={mockOnSubmit} />);

    const codeInput = screen.getByTestId("input-booking-code");
    const phoneInput = screen.getByTestId("input-phone");
    const submitBtn = screen.getByTestId("btn-submit-tracking");

    await user.type(codeInput, "BK20261025-DEMO");
    await user.type(phoneInput, "0912345678");
    await user.click(submitBtn);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        bookingCode: "BK20261025-DEMO",
        phone: "0912345678",
      });
    });
  });

  it("shows loading state when isLoading is true", () => {
    render(<TrackingSearchForm isLoading={true} onSubmit={mockOnSubmit} />);

    expect(screen.getByText("Đang tra cứu...")).toBeInTheDocument();
    expect(screen.getByTestId("btn-submit-tracking")).toBeDisabled();
    expect(screen.getByTestId("input-booking-code")).toBeDisabled();
    expect(screen.getByTestId("input-phone")).toBeDisabled();
  });
});
