import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  DatePicker,
  formatIsoToVietnamese,
  dateToIso,
} from "./DatePicker";

describe("DatePicker component", () => {
  it("formats ISO date and converts date object with utilities", () => {
    expect(formatIsoToVietnamese("2026-10-25")).toBe("25/10/2026");
    expect(formatIsoToVietnamese("")).toBe("");
    expect(formatIsoToVietnamese("invalid")).toBe("invalid");

    const testDate = new Date(2026, 9, 25); // Month is 0-indexed: 9 = October
    expect(dateToIso(testDate)).toBe("2026-10-25");
  });

  it("renders with label, formatted date, and placeholder", () => {
    render(
      <DatePicker
        label="Ngày thuê"
        value="2026-10-25"
        hint="Chọn ngày bắt đầu nhận đồ"
      />
    );

    expect(screen.getByText("Ngày thuê")).toBeInTheDocument();
    expect(screen.getByText("25/10/2026")).toBeInTheDocument();
    expect(screen.getByText("Chọn ngày bắt đầu nhận đồ")).toBeInTheDocument();
  });

  it("opens calendar popup on trigger click and navigates months", () => {
    render(
      <DatePicker
        value="2026-10-25"
      />
    );

    const trigger = screen.getByRole("button", { name: "25/10/2026" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Lịch chọn ngày" })).toBeInTheDocument();
    expect(screen.getByText("Tháng 10, 2026")).toBeInTheDocument();

    // Next month
    fireEvent.click(screen.getByRole("button", { name: "Tháng sau" }));
    expect(screen.getByText("Tháng 11, 2026")).toBeInTheDocument();

    // Prev month
    fireEvent.click(screen.getByRole("button", { name: "Tháng trước" }));
    expect(screen.getByText("Tháng 10, 2026")).toBeInTheDocument();
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
    // Click on day 20
    const dayBtn = screen.getByRole("button", { name: "20" });
    fireEvent.click(dayBtn);

    expect(handleChange).toHaveBeenCalledWith("2026-10-20");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("handles selecting today and clearing date", () => {
    const handleChange = vi.fn();
    render(
      <DatePicker
        value="2026-10-25"
        onChange={handleChange}
      />
    );

    // Clear date
    const clearBtn = screen.getByRole("button", { name: "Xóa ngày đã chọn" });
    fireEvent.click(clearBtn);
    expect(handleChange).toHaveBeenCalledWith("");

    // Open and select today
    fireEvent.click(screen.getByRole("button", { name: "25/10/2026" }));
    const todayBtn = screen.getByRole("button", { name: "Hôm nay" });
    fireEvent.click(todayBtn);
    expect(handleChange).toHaveBeenCalledWith(dateToIso(new Date()));
  });

  it("closes on Escape key and restores focus to trigger", () => {
    render(
      <DatePicker
        value="2026-10-25"
      />
    );

    const trigger = screen.getByRole("button", { name: "25/10/2026" });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("disables dates outside minDate and maxDate bounds", () => {
    render(
      <DatePicker
        value="2026-10-15"
        minDate="2026-10-10"
        maxDate="2026-10-20"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "15/10/2026" }));

    // Day 5 should be disabled (< minDate)
    const day5 = screen.getByRole("button", { name: "5" });
    expect(day5).toBeDisabled();

    // Day 15 should be enabled
    const day15 = screen.getByRole("button", { name: "15" });
    expect(day15).not.toBeDisabled();

    // Day 25 should be disabled (> maxDate)
    const day25 = screen.getByRole("button", { name: "25" });
    expect(day25).toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <DatePicker
        label="Chọn ngày bắt đầu"
        value="2026-10-25"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Chọn ngày bắt đầu" }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
