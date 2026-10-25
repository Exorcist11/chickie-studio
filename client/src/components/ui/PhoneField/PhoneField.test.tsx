import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  PhoneField,
  formatPhoneNumberVN,
  cleanPhoneNumber,
  isValidVietnamesePhone,
} from "./PhoneField";

describe("PhoneField component", () => {
  it("formats and validates phone numbers with utilities", () => {
    expect(formatPhoneNumberVN("0987654321")).toBe("0987 654 321");
    expect(formatPhoneNumberVN("0987")).toBe("0987");
    expect(formatPhoneNumberVN("0987654")).toBe("0987 654");
    expect(formatPhoneNumberVN("")).toBe("");

    expect(cleanPhoneNumber("0987 654 321")).toBe("0987654321");
    expect(cleanPhoneNumber("+84-987-654-321")).toBe("8498765432");

    expect(isValidVietnamesePhone("0987654321")).toBe(true);
    expect(isValidVietnamesePhone("0367123456")).toBe(true);
    expect(isValidVietnamesePhone("0865999888")).toBe(true);
    expect(isValidVietnamesePhone("0123456789")).toBe(false); // 01 is not a valid prefix
    expect(isValidVietnamesePhone("0987")).toBe(false);
  });

  it("renders with label, placeholder, prefix +84 and hint", () => {
    render(
      <PhoneField
        label="Số điện thoại liên hệ"
        hint="Dùng để nhận mã đơn hàng qua SMS/Zalo"
      />
    );

    expect(screen.getByText("Số điện thoại liên hệ")).toBeInTheDocument();
    expect(screen.getByText("+84")).toBeInTheDocument();
    expect(screen.getByText("Dùng để nhận mã đơn hàng qua SMS/Zalo")).toBeInTheDocument();
  });

  it("formats as typing and calls onChange with cleaned number", () => {
    const handleChange = vi.fn();
    render(
      <PhoneField
        label="SĐT"
        onChange={handleChange}
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "0912345678" } });

    expect(handleChange).toHaveBeenCalledWith("0912345678");
    expect(input).toHaveValue("0912 345 678");
  });

  it("displays error message and sets aria-invalid", () => {
    render(
      <PhoneField
        label="SĐT"
        error="Số điện thoại không đúng định dạng"
      />
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Số điện thoại không đúng định dạng");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <PhoneField
        label="Số điện thoại"
        value="0987654321"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
