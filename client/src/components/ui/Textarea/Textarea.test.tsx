import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Textarea } from "./Textarea";

describe("Textarea component", () => {
  it("renders with label and textarea", () => {
    render(<Textarea label="Ghi chú" placeholder="Ghi chú chiều cao cân nặng" />);
    expect(screen.getByLabelText(/ghi chú/i)).toBeInTheDocument();
  });

  it("handles typing", async () => {
    const user = userEvent.setup();
    render(<Textarea label="Ghi chú" />);
    const textarea = screen.getByLabelText(/ghi chú/i);
    await user.type(textarea, "Cao 1m62");
    expect(textarea).toHaveValue("Cao 1m62");
  });

  it("renders error state", () => {
    render(<Textarea label="Ghi chú" error="Không được để trống" />);
    expect(screen.getByLabelText(/ghi chú/i)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Không được để trống")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Textarea label="Ghi chú đặt đồ" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
