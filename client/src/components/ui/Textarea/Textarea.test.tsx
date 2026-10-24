import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { TextArea, Textarea } from "./Textarea";

describe("Chickie Base TextArea Component", () => {
  it("renders with label, placeholder, and handles typing", async () => {
    render(
      <TextArea
        label="Ghi chú đơn hàng"
        placeholder="Nhập yêu cầu đặc biệt..."
      />
    );

    const textarea = screen.getByLabelText(/ghi chú đơn hàng/i);
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute(
      "placeholder",
      "Nhập yêu cầu đặc biệt..."
    );

    await userEvent.type(textarea, "Cần lấy đồ gấp lúc 9h sáng");
    expect(textarea).toHaveValue("Cần lấy đồ gấp lúc 9h sáng");
  });

  it("handles typing and updates character count", async () => {
    render(
      <TextArea
        label="Yêu cầu sửa đồ"
        maxLength={50}
        showCount
      />
    );

    const textarea = screen.getByLabelText(/yêu cầu sửa đồ/i);
    expect(screen.getByTestId("textarea-count")).toHaveTextContent("0/50");

    await userEvent.type(textarea, "Bóp eo váy 2cm");
    expect(screen.getByTestId("textarea-count")).toHaveTextContent("14/50");
  });

  it("renders with hint text and connects aria-describedby", () => {
    render(
      <TextArea
        id="care-note"
        label="Ghi chú bảo quản"
        hint="Áo lụa tơ tằm vui lòng chỉ giặt khô"
      />
    );

    const textarea = screen.getByLabelText(/ghi chú bảo quản/i);
    expect(textarea).toHaveAttribute("aria-describedby", "care-note-hint");
    expect(
      screen.getByText("Áo lụa tơ tằm vui lòng chỉ giặt khô")
    ).toBeInTheDocument();
  });

  it("shows semantic error message with role alert and aria-invalid", () => {
    render(
      <TextArea
        id="damage-report"
        label="Biên bản hư hỏng"
        error="Vui lòng mô tả chi tiết vết xước hoặc ố"
      />
    );

    const textarea = screen.getByLabelText(/biên bản hư hỏng/i);
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveAttribute("aria-describedby", "damage-report-error");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Vui lòng mô tả chi tiết vết xước hoặc ố"
    );
  });

  it("renders disabled state and required asterisk", () => {
    render(<TextArea label="Ý kiến đóng góp" required disabled />);
    const textarea = screen.getByLabelText(/ý kiến đóng góp/i);
    expect(textarea).toBeDisabled();
    expect(textarea).toBeRequired();
  });

  it("supports Textarea alias", () => {
    render(<Textarea label="Bí danh" />);
    expect(screen.getByLabelText(/bí danh/i)).toBeInTheDocument();
  });

  it("has no accessibility violations (a11y with vitest-axe)", async () => {
    const { container } = render(
      <TextArea
        label="Ghi chú phụ kiện"
        hint="Kèm khăn voan và vương miện ngọc trai"
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
