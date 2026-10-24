import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Checkbox } from "./Checkbox";

describe("Chickie Base Checkbox Component", () => {
  it("renders with label and toggles checked state", async () => {
    const handleCheckedChange = vi.fn();
    render(
      <Checkbox
        label="Đồng ý với chính sách thuê đồ"
        onCheckedChange={handleCheckedChange}
      />
    );

    const checkbox = screen.getByLabelText(/đồng ý với chính sách thuê đồ/i);
    expect(checkbox).not.toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(handleCheckedChange).toHaveBeenCalledWith(true);

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });

  it("handles controlled checked state", () => {
    const { rerender } = render(
      <Checkbox label="Bảo hiểm trang phục" checked={true} readOnly />
    );
    const checkbox = screen.getByLabelText(/bảo hiểm trang phục/i);
    expect(checkbox).toBeChecked();

    rerender(<Checkbox label="Bảo hiểm trang phục" checked={false} readOnly />);
    expect(checkbox).not.toBeChecked();
  });

  it("shows hint text and links aria-describedby", () => {
    render(
      <Checkbox
        id="terms"
        label="Điều khoản dịch vụ"
        hint="Cần đọc kỹ quy định trả cọc trước khi bấm"
      />
    );
    const checkbox = screen.getByLabelText(/điều khoản dịch vụ/i);
    expect(checkbox).toHaveAttribute("aria-describedby", "terms-hint");
    expect(screen.getByText("Cần đọc kỹ quy định trả cọc trước khi bấm")).toBeInTheDocument();
  });

  it("shows semantic error with role alert and aria-invalid", () => {
    render(
      <Checkbox
        id="confirm"
        label="Xác nhận đủ 18 tuổi"
        error="Bạn phải đủ 18 tuổi để tự đứng tên thuê"
      />
    );
    const checkbox = screen.getByLabelText(/xác nhận đủ 18 tuổi/i);
    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(checkbox).toHaveAttribute("aria-describedby", "confirm-error");
    expect(screen.getByRole("alert")).toHaveTextContent("Bạn phải đủ 18 tuổi để tự đứng tên thuê");
  });

  it("renders required marker when required is true", () => {
    render(<Checkbox label="Bắt buộc chọn" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders disabled state and ignores clicks", async () => {
    const handleCheckedChange = vi.fn();
    render(
      <Checkbox
        label="Dịch vụ tạm ngưng"
        disabled
        onCheckedChange={handleCheckedChange}
      />
    );

    const checkbox = screen.getByLabelText(/dịch vụ tạm ngưng/i);
    expect(checkbox).toBeDisabled();
    await userEvent.click(checkbox);
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  it("has no accessibility violations (a11y with vitest-axe)", async () => {
    const { container } = render(
      <Checkbox
        label="Nhận thông báo ưu đãi qua Zalo"
        hint="Tối đa 2 tin/tháng"
        required
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
