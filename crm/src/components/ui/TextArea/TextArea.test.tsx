import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { TextArea } from "./TextArea";

describe("Chickie Base TextArea Component", () => {
  it("renders with label, placeholder, and specified rows", () => {
    render(
      <TextArea
        label="Ghi chú số đo"
        placeholder="Nhập chiều cao, cân nặng..."
        rows={4}
      />
    );
    const textarea = screen.getByLabelText(/ghi chú số đo/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("rows", "4");
    expect(screen.getByPlaceholderText("Nhập chiều cao, cân nặng...")).toBeInTheDocument();
  });

  it("handles typing and updates character count", async () => {
    const handleChange = vi.fn();
    render(
      <TextArea
        label="Yêu cầu riêng"
        showCount
        maxLength={100}
        onChange={handleChange}
      />
    );

    const textarea = screen.getByLabelText(/yêu cầu riêng/i);
    const countDisplay = screen.getByTestId("textarea-count");
    expect(countDisplay).toHaveTextContent("0/100");

    await userEvent.type(textarea, "Muốn váy dài qua gối");
    expect(handleChange).toHaveBeenCalled();
    expect(countDisplay).toHaveTextContent("20/100");
  });

  it("shows hint text and links aria-describedby", () => {
    render(
      <TextArea
        id="notes"
        label="Ghi chú"
        hint="Tối đa 500 ký tự"
      />
    );
    const textarea = screen.getByLabelText(/ghi chú/i);
    expect(textarea).toHaveAttribute("aria-describedby", "notes-hint");
    expect(screen.getByText("Tối đa 500 ký tự")).toBeInTheDocument();
  });

  it("shows semantic error with role alert and aria-invalid", () => {
    render(
      <TextArea
        id="feedback"
        label="Phản hồi"
        error="Nội dung phản hồi không được để trống"
      />
    );
    const textarea = screen.getByLabelText(/phản hồi/i);
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("aria-describedby", "feedback-error");
    expect(screen.getByRole("alert")).toHaveTextContent("Nội dung phản hồi không được để trống");
  });

  it("renders required marker when required is true", () => {
    render(<TextArea label="Địa chỉ" required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders disabled state", () => {
    render(<TextArea label="Mô tả" disabled value="Nội dung khóa" readOnly />);
    expect(screen.getByLabelText(/mô tả/i)).toBeDisabled();
  });

  it("has no accessibility violations (a11y with vitest-axe)", async () => {
    const { container } = render(
      <TextArea
        label="Yêu cầu sửa trang phục"
        hint="Mô tả chi tiết vị trí cần chỉnh sửa"
        required
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
