import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Select } from "./Select";

describe("Select component", () => {
  const options = [
    { label: "Váy thiết kế", value: "vay" },
    { label: "Áo dài truyền thống", value: "aodai" },
    { label: "Máy ảnh du lịch", value: "mayanh" },
  ];

  it("renders with options and label", () => {
    render(<Select label="Loại trang phục" options={options} />);
    const select = screen.getByLabelText(/loại trang phục/i);
    expect(select).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Váy thiết kế" })).toBeInTheDocument();
  });

  it("allows selecting options", async () => {
    const user = userEvent.setup();
    render(<Select label="Loại" options={options} defaultValue="vay" />);
    const select = screen.getByLabelText(/loại/i);
    await user.selectOptions(select, "aodai");
    expect(select).toHaveValue("aodai");
  });

  it("renders error state", () => {
    render(<Select label="Loại" options={options} error="Vui lòng chọn loại" />);
    expect(screen.getByLabelText(/loại/i)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Vui lòng chọn loại")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Select label="Chọn danh mục" options={options} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
