import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Switch } from "./Switch";

describe("Chickie Base Switch Component", () => {
  it("renders with label and toggles checked state", async () => {
    const handleCheckedChange = vi.fn();
    render(
      <Switch
        label="Tự động gia hạn thuê"
        onCheckedChange={handleCheckedChange}
      />
    );

    const switchBtn = screen.getByRole("switch", { name: /tự động gia hạn thuê/i });
    expect(switchBtn).toHaveAttribute("aria-checked", "false");

    await userEvent.click(switchBtn);
    expect(switchBtn).toHaveAttribute("aria-checked", "true");
    expect(handleCheckedChange).toHaveBeenCalledWith(true);

    await userEvent.click(switchBtn);
    expect(switchBtn).toHaveAttribute("aria-checked", "false");
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });

  it("handles controlled checked state", () => {
    const { rerender } = render(
      <Switch label="Bật thông báo" checked={true} />
    );
    const switchBtn = screen.getByRole("switch");
    expect(switchBtn).toHaveAttribute("aria-checked", "true");

    rerender(<Switch label="Bật thông báo" checked={false} />);
    expect(switchBtn).toHaveAttribute("aria-checked", "false");
  });

  it("supports left and right label positions", () => {
    const { rerender } = render(
      <Switch label="Nhãn bên phải" labelPosition="right" />
    );
    expect(screen.getByText("Nhãn bên phải")).toBeInTheDocument();

    rerender(<Switch label="Nhãn bên trái" labelPosition="left" />);
    expect(screen.getByText("Nhãn bên trái")).toBeInTheDocument();
  });

  it("shows hint text and links aria-describedby", () => {
    render(
      <Switch
        id="auto-clean"
        label="Dịch vụ giặt ủi cấp tốc"
        hint="Cộng thêm phí 150.000₫"
      />
    );
    const switchBtn = screen.getByRole("switch");
    expect(switchBtn).toHaveAttribute("aria-describedby", "auto-clean-hint");
    expect(screen.getByText("Cộng thêm phí 150.000₫")).toBeInTheDocument();
  });

  it("shows semantic error with role alert and aria-invalid", () => {
    render(
      <Switch
        id="policy-toggle"
        label="Xác nhận cam kết"
        error="Bạn cần bật cam kết bảo quản đồ"
      />
    );
    const switchBtn = screen.getByRole("switch");
    expect(switchBtn).toHaveAttribute("aria-invalid", "true");
    expect(switchBtn).toHaveAttribute("aria-describedby", "policy-toggle-error");
    expect(screen.getByRole("alert")).toHaveTextContent("Bạn cần bật cam kết bảo quản đồ");
  });

  it("renders disabled state and ignores clicks", async () => {
    const handleCheckedChange = vi.fn();
    render(
      <Switch
        label="Tùy chọn bị khóa"
        disabled
        onCheckedChange={handleCheckedChange}
      />
    );

    const switchBtn = screen.getByRole("switch");
    expect(switchBtn).toBeDisabled();
    await userEvent.click(switchBtn);
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  it("has no accessibility violations (a11y with vitest-axe)", async () => {
    const { container } = render(
      <Switch
        label="Đồng ý xuất hóa đơn VAT"
        hint="Gửi qua email công ty trong 24h"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
