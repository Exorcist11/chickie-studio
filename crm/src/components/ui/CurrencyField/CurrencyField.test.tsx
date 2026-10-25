import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { CurrencyField } from "./CurrencyField";
import { formatCurrencyVND, parseCurrencyVND } from "./CurrencyField.utils";

describe("CurrencyField component (CRM)", () => {
  it("formats and parses currency correctly", () => {
    expect(formatCurrencyVND(1500000)).toBe("1.500.000");
    expect(parseCurrencyVND("1.500.000")).toBe(1500000);
  });

  it("renders with label, placeholder, suffix and hint", () => {
    render(
      <CurrencyField
        label="Tiền cọc CRM"
        hint="Cọc tối thiểu 200.000₫"
        suffix="VND"
        placeholder="Nhập số tiền"
      />
    );

    expect(screen.getByText("Tiền cọc CRM")).toBeInTheDocument();
    expect(screen.getByText("Cọc tối thiểu 200.000₫")).toBeInTheDocument();
    expect(screen.getByText("VND")).toBeInTheDocument();
  });

  it("formats input while typing and fires onChange with integer value", () => {
    const handleChange = vi.fn();
    render(
      <CurrencyField
        label="Giá thuê"
        onChange={handleChange}
      />
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "500000" } });

    expect(handleChange).toHaveBeenCalledWith(500000);
    expect(input).toHaveValue("500.000");
  });

  it("handles quick presets", () => {
    const handleChange = vi.fn();
    render(
      <CurrencyField
        label="Tiền cọc"
        quickPresets={[200000, 500000]}
        onChange={handleChange}
      />
    );

    const presetBtn = screen.getByRole("button", { name: "500.000₫" });
    fireEvent.click(presetBtn);

    expect(handleChange).toHaveBeenCalledWith(500000);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <CurrencyField
        label="Giá thuê theo ngày"
        value={350000}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
