import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { RadioGroup } from "./RadioGroup";

describe("Chickie Base RadioGroup Component", () => {
  const sampleOptions = [
    { label: "Nhận tại showroom", value: "pickup", hint: "Miễn phí thử đồ" },
    { label: "Giao tận nơi", value: "delivery", hint: "Phí ship tính theo km" },
    { label: "Thuê gấp trong ngày", value: "express", disabled: true },
  ];

  it("renders with label, options, and option hints", () => {
    render(
      <RadioGroup
        label="Hình thức nhận trang phục"
        options={sampleOptions}
      />
    );
    expect(screen.getByText("Hình thức nhận trang phục")).toBeInTheDocument();
    expect(screen.getByLabelText("Nhận tại showroom")).toBeInTheDocument();
    expect(screen.getByText("Miễn phí thử đồ")).toBeInTheDocument();
    expect(screen.getByLabelText("Thuê gấp trong ngày")).toBeDisabled();
  });

  it("handles option selection in uncontrolled mode", async () => {
    const handleValueChange = vi.fn();
    render(
      <RadioGroup
        options={sampleOptions}
        defaultValue="pickup"
        onValueChange={handleValueChange}
      />
    );

    const pickupRadio = screen.getByLabelText("Nhận tại showroom");
    const deliveryRadio = screen.getByLabelText("Giao tận nơi");

    expect(pickupRadio).toBeChecked();
    expect(deliveryRadio).not.toBeChecked();

    await userEvent.click(deliveryRadio);
    expect(deliveryRadio).toBeChecked();
    expect(pickupRadio).not.toBeChecked();
    expect(handleValueChange).toHaveBeenCalledWith("delivery");
  });

  it("handles controlled value correctly", () => {
    const { rerender } = render(
      <RadioGroup options={sampleOptions} value="pickup" />
    );
    expect(screen.getByLabelText("Nhận tại showroom")).toBeChecked();

    rerender(<RadioGroup options={sampleOptions} value="delivery" />);
    expect(screen.getByLabelText("Giao tận nơi")).toBeChecked();
  });

  it("shows hint text and links aria-describedby", () => {
    render(
      <RadioGroup
        id="delivery-method"
        label="Phương thức"
        hint="Nên đặt trước 2 ngày"
        options={sampleOptions}
      />
    );
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAttribute("aria-describedby", "delivery-method-hint");
    expect(screen.getByText("Nên đặt trước 2 ngày")).toBeInTheDocument();
  });

  it("shows semantic error with role alert and aria-invalid", () => {
    render(
      <RadioGroup
        id="method"
        label="Phương thức"
        error="Vui lòng chọn hình thức nhận đồ"
        options={sampleOptions}
      />
    );
    const group = screen.getByRole("radiogroup");
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAttribute("aria-describedby", "method-error");
    expect(screen.getByRole("alert")).toHaveTextContent("Vui lòng chọn hình thức nhận đồ");
  });

  it("renders disabled group and prevents selection", async () => {
    const handleValueChange = vi.fn();
    render(
      <RadioGroup
        disabled
        options={sampleOptions}
        onValueChange={handleValueChange}
      />
    );

    const radio = screen.getByLabelText("Nhận tại showroom");
    expect(radio).toBeDisabled();
    await userEvent.click(radio);
    expect(handleValueChange).not.toHaveBeenCalled();
  });

  it("has no accessibility violations (a11y with vitest-axe)", async () => {
    const { container } = render(
      <RadioGroup
        label="Chọn gói thuê đồ"
        required
        options={sampleOptions}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
