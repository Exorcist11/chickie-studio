import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { DatePicker } from "./DatePicker";
import { formatIsoToVietnamese, dateToIso } from "./DatePicker.utils";

describe("DatePicker component (CRM)", () => {
  it("formats ISO date and converts date object", () => {
    expect(formatIsoToVietnamese("2026-10-25")).toBe("25/10/2026");
    const testDate = new Date(2026, 9, 25);
    expect(dateToIso(testDate)).toBe("2026-10-25");
  });

  it("opens calendar popup on trigger click and navigates months", () => {
    render(
      <DatePicker
        value="2026-10-25"
      />
    );

    const trigger = screen.getByRole("button", { name: "25/10/2026" });
    fireEvent.click(trigger);

    expect(screen.getByRole("dialog", { name: "Lịch chọn ngày" })).toBeInTheDocument();
    expect(screen.getByText("Tháng 10, 2026")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Tháng sau" }));
    expect(screen.getByText("Tháng 11, 2026")).toBeInTheDocument();
  });

  it("selects a date and fires onChange", () => {
    const handleChange = vi.fn();
    render(
      <DatePicker
        value="2026-10-25"
        onChange={handleChange}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "25/10/2026" }));
    const dayBtn = screen.getByRole("button", { name: "20" });
    fireEvent.click(dayBtn);

    expect(handleChange).toHaveBeenCalledWith("2026-10-20");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <DatePicker
        label="Ngày nhận đồ CRM"
        value="2026-10-25"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Ngày nhận đồ CRM" }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
