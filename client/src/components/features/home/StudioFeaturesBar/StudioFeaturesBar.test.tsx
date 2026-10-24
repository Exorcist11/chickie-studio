import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { StudioFeaturesBar } from "./StudioFeaturesBar";

describe("StudioFeaturesBar component", () => {
  it("renders 4 core studio value items", () => {
    render(<StudioFeaturesBar />);

    expect(screen.getByText("Thiết kế tinh tế")).toBeInTheDocument();
    expect(screen.getByText("Dịch vụ chuyên nghiệp")).toBeInTheDocument();
    expect(screen.getByText("Trang thiết bị hiện đại")).toBeInTheDocument();
    expect(screen.getByText("Đội ngũ sáng tạo")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<StudioFeaturesBar />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
