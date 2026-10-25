import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { PhoneField } from "./PhoneField";
import {
  formatPhoneNumberVN,
  cleanPhoneNumber,
  isValidVietnamesePhone,
} from "./PhoneField.utils";

describe("PhoneField component (CRM)", () => {
  it("formats and validates phone numbers with utilities", () => {
    expect(formatPhoneNumberVN("0987654321")).toBe("0987 654 321");
    expect(cleanPhoneNumber("0987 654 321")).toBe("0987654321");
    expect(isValidVietnamesePhone("0987654321")).toBe(true);
    expect(isValidVietnamesePhone("12345")).toBe(false);
  });

  it("renders with label, placeholder, prefix +84", () => {
    render(
      <PhoneField
        label="Số điện thoại khách hàng"
      />
    );

    expect(screen.getByText("Số điện thoại khách hàng")).toBeInTheDocument();
    expect(screen.getByText("+84")).toBeInTheDocument();
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
