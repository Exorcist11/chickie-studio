import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Toast } from "./Toast";

describe("Toast component", () => {
  it("renders with role alert, title, message and icon", () => {
    render(
      <Toast
        variant="success"
        title="Thành công"
        message="Đã lưu thông tin đơn thuê"
      />
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Thành công")).toBeInTheDocument();
    expect(screen.getByText("Đã lưu thông tin đơn thuê")).toBeInTheDocument();
  });

  it("handles close button click", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<Toast message="Thông báo" onClose={handleClose} />);

    const closeBtn = screen.getByRole("button", { name: "Đóng thông báo" });
    await user.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Toast variant="info" title="Lưu ý" message="Vui lòng đặt cọc trước" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
