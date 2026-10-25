import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  CurrencyField,
  formatCurrencyVND,
  parseCurrencyVND,
} from "./CurrencyField";

describe("CurrencyField component", () => {
  it("formats and parses currency correctly with utility functions", () => {
    expect(formatCurrencyVND(1500000)).toBe("1.500.000");
    expect(formatCurrencyVND("200000")).toBe("200.000");
    expect(formatCurrencyVND(0)).toBe("0");
    expect(formatCurrencyVND("")).toBe("");

    expect(parseCurrencyVND("1.500.000")).toBe(1500000);
    expect(parseCurrencyVND("250.000₫")).toBe(250000);
    expect(parseCurrencyVND("")).toBe(0);
  });

  it("renders with label, placeholder, suffix and hint", () => {
    render(
      <CurrencyField
        label="Tiền cọc giữ đồ"
        hint="Cọc tối thiểu 200.000₫"
        suffix="VND"
        placeholder="Nhập số tiền"
      />
    );

    expect(screen.getByText("Tiền cọc giữ đồ")).toBeInTheDocument();
    expect(screen.getByText("Cọc tối thiểu 200.000₫")).toBeInTheDocument();
    expect(screen.getByText("VND")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nhập số tiền")).toBeInTheDocument();
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

  it("enforces min and max values", () => {
    const handleChange = vi.fn();
    render(
      <CurrencyField
        label="Số tiền"
        min={100000}
        max={1000000}
        onChange={handleChange}
      />
    );

    const input = screen.getByRole("textbox");
    // Under min
    fireEvent.change(input, { target: { value: "50000" } });
    expect(handleChange).toHaveBeenCalledWith(100000);

    // Over max
    fireEvent.change(input, { target: { value: "2000000" } });
    expect(handleChange).toHaveBeenCalledWith(1000000);
  });

  it("handles quick presets buttons", () => {
    const handleChange = vi.fn();
    render(
      <CurrencyField
        label="Tiền cọc"
        quickPresets={[200000, 500000, 1000000]}
        onChange={handleChange}
      />
    );

    expect(screen.getByRole("button", { name: "200.000₫" })).toBeInTheDocument();
    const presetBtn = screen.getByRole("button", { name: "500.000₫" });
    fireEvent.click(presetBtn);

    expect(handleChange).toHaveBeenCalledWith(500000);
  });

  it("displays error message and sets aria-invalid", () => {
    render(
      <CurrencyField
        label="Tiền cọc"
        error="Số tiền cọc không được để trống"
      />
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Số tiền cọc không được để trống");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <CurrencyField
        label="Giá thuê theo ngày"
        value={350000}
        hint="Đã bao gồm thuế"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
