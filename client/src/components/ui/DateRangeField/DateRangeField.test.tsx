import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
