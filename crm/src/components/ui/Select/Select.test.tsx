import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Select } from "./Select";

describe("Chickie Base Select Component", () => {
  const sampleOptions = [
    { label: "Váy dạ tiệc", value: "party" },
    { label: "Áo dài cách tân", value: "aodai" },
    { label: "Máy ảnh Sony", value: "sony", disabled: true },
  ];

  it("renders with options, placeholder, and label", () => {
    render(
      <Select
        label="Loại dịch vụ"
        placeholder="-- Chọn loại dịch vụ --"
        options={sampleOptions}
      />
    );
    expect(screen.getByLabelText(/loại dịch vụ/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Váy dạ tiệc")).toBeInTheDocument();
    expect(screen.getByText("Máy ảnh Sony")).toBeDisabled();
  });

  it("handles selection and triggers onValueChange and onChange", async () => {
    const handleValueChange = vi.fn();
    const handleChange = vi.fn();

    render(
      <Select
        label="Chọn trang phục"
        options={sampleOptions}
        onValueChange={handleValueChange}
        onChange={handleChange}
        defaultValue="party"
      />
    );

    const select = screen.getByLabelText(/chọn trang phục/i);
    await userEvent.selectOptions(select, "aodai");

    expect(handleValueChange).toHaveBeenCalledWith("aodai");
    expect(handleChange).toHaveBeenCalled();
    expect(select).toHaveValue("aodai");
  });

  it("shows hint text and links aria-describedby", () => {
    render(
      <Select
        id="service"
        label="Dịch vụ"
        hint="Chọn tối thiểu 1 gói dịch vụ"
        options={sampleOptions}
      />
    );
    const select = screen.getByLabelText(/dịch vụ/i);
    expect(select).toHaveAttribute("aria-describedby", "service-hint");
    expect(screen.getByText("Chọn tối thiểu 1 gói dịch vụ")).toBeInTheDocument();
  });

  it("shows semantic error with role alert and aria-invalid", () => {
    render(
      <Select
        id="category"
        label="Danh mục"
        error="Vui lòng chọn danh mục hợp lệ"
        options={sampleOptions}
      />
    );
    const select = screen.getByLabelText(/danh mục/i);
    expect(select).toHaveAttribute("aria-invalid", "true");
    expect(select).toHaveAttribute("aria-describedby", "category-error");
    expect(screen.getByRole("alert")).toHaveTextContent("Vui lòng chọn danh mục hợp lệ");
  });

  it("renders required indicator when required is true", () => {
    render(
      <Select
        label="Kích cỡ"
        required
        options={sampleOptions}
      />
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders disabled state", () => {
    render(
      <Select
        label="Màu sắc"
        disabled
        options={sampleOptions}
      />
    );
    expect(screen.getByLabelText(/màu sắc/i)).toBeDisabled();
  });

  it("has no accessibility violations (a11y with vitest-axe)", async () => {
    const { container } = render(
      <Select
        label="Phương thức nhận đồ"
        hint="Chọn cách thức nhận trang phục"
        required
        options={sampleOptions}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
