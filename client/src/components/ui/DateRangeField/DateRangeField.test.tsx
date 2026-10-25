import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { DateRangeField } from "./DateRangeField";

describe("DateRangeField component", () => {
  it("renders both start and end date inputs with labels", () => {
    render(
      <DateRangeField
        label="Thời gian thuê đồ"
        startLabel="Ngày nhận đồ"
        endLabel="Ngày trả đồ"
      />
    );
    expect(screen.getByText("Thời gian thuê đồ")).toBeInTheDocument();
    expect(screen.getByLabelText("Ngày nhận đồ")).toBeInTheDocument();
    expect(screen.getByLabelText("Ngày trả đồ")).toBeInTheDocument();
  });

  it("triggers callbacks on change", async () => {
    const user = userEvent.setup();
    const handleStartChange = vi.fn();
    const handleEndChange = vi.fn();

    render(
      <DateRangeField
        startLabel="Từ ngày"
        endLabel="Đến ngày"
        onStartDateChange={handleStartChange}
        onEndDateChange={handleEndChange}
      />
    );

    const startInput = screen.getByLabelText("Từ ngày");
    await user.type(startInput, "2026-11-05");
    expect(handleStartChange).toHaveBeenCalled();
  });

  it("opens custom datepicker popover, navigates months, and selects a date", async () => {
    const user = userEvent.setup();
    const handleStartChange = vi.fn();
    const handleEndChange = vi.fn();

    render(
      <DateRangeField
        startLabel="Từ ngày"
        endLabel="Đến ngày"
        startDate="2026-11-05"
        endDate="2026-11-10"
        onStartDateChange={handleStartChange}
        onEndDateChange={handleEndChange}
      />
    );

    // Open start date popover via calendar icon button
    const openStartBtn = screen.getByRole("button", { name: "Mở lịch chọn Từ ngày" });
    await user.click(openStartBtn);

    expect(screen.getByRole("dialog", { name: "Lịch chọn ngày" })).toBeInTheDocument();
    expect(screen.getByText(/Tháng 11 \/ 2026/)).toBeInTheDocument();

    // Navigate to next month
    const nextBtn = screen.getByRole("button", { name: "Tháng sau" });
    await user.click(nextBtn);
    expect(screen.getByText(/Tháng 12 \/ 2026/)).toBeInTheDocument();

    // Navigate back to previous month
    const prevBtn = screen.getByRole("button", { name: "Tháng trước" });
    await user.click(prevBtn);
    expect(screen.getByText(/Tháng 11 \/ 2026/)).toBeInTheDocument();

    // Click a day: auto-closes popover and calls onStartDateChange
    const dayBtn = screen.getByRole("button", { name: "8" });
    await user.click(dayBtn);
    expect(handleStartChange).toHaveBeenCalledWith("2026-11-08");
    expect(screen.queryByRole("dialog", { name: "Lịch chọn ngày" })).not.toBeInTheDocument();
  });

  it("closes popover when clicking 'Hoàn tất'", async () => {
    const user = userEvent.setup();

    render(
      <DateRangeField
        startLabel="Từ ngày"
        endLabel="Đến ngày"
        startDate="2026-11-05"
      />
    );

    const openStartBtn = screen.getByRole("button", { name: "Mở lịch chọn Từ ngày" });
    await user.click(openStartBtn);
    expect(screen.getByRole("dialog", { name: "Lịch chọn ngày" })).toBeInTheDocument();

    const finishBtn = screen.getByRole("button", { name: "Hoàn tất" });
    await user.click(finishBtn);
    expect(screen.queryByRole("dialog", { name: "Lịch chọn ngày" })).not.toBeInTheDocument();
  });

  it("opens end date popover, selects date, and handles close via X button", async () => {
    const user = userEvent.setup();
    const handleEndChange = vi.fn();

    render(
      <DateRangeField
        startLabel="Từ ngày"
        endLabel="Đến ngày"
        startDate="2026-11-05"
        endDate="2026-11-10"
        onEndDateChange={handleEndChange}
      />
    );

    const openEndBtn = screen.getByRole("button", { name: "Mở lịch chọn Đến ngày" });
    await user.click(openEndBtn);

    expect(screen.getByRole("dialog", { name: "Lịch chọn ngày" })).toBeInTheDocument();

    // Close via close icon X
    const closeBtn = screen.getByRole("button", { name: "Đóng bảng lịch" });
    await user.click(closeBtn);
    expect(screen.queryByRole("dialog", { name: "Lịch chọn ngày" })).not.toBeInTheDocument();
  });

  it("closes popover when clicking outside", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <DateRangeField startLabel="Từ ngày" endLabel="Đến ngày" />
        <button type="button">Bên ngoài</button>
      </div>
    );

    const openStartBtn = screen.getByRole("button", { name: "Mở lịch chọn Từ ngày" });
    await user.click(openStartBtn);
    expect(screen.getByRole("dialog", { name: "Lịch chọn ngày" })).toBeInTheDocument();

    // Click outside
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("dialog", { name: "Lịch chọn ngày" })).not.toBeInTheDocument();
  });

  it("renders error state", () => {
    render(
      <DateRangeField
        label="Thời gian thuê"
        startLabel="Từ ngày"
        endLabel="Đến ngày"
        error="Ngày trả phải sau ngày nhận đồ"
      />
    );
    expect(screen.getByText("Ngày trả phải sau ngày nhận đồ")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <DateRangeField
        label="Thời gian thuê đồ"
        startLabel="Từ ngày"
        endLabel="Đến ngày"
        helperText="Tối thiểu thuê 1 ngày"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
