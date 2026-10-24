import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RevenueChart } from "./RevenueChart";

describe("RevenueChart", () => {
  const dummyData = [
    { label: "Tháng 1", revenue: 20000000 },
    { label: "Tháng 2", revenue: 35000000 },
    { label: "Tháng 3", revenue: 50000000 },
  ];

  it("renders chart title, labels, and SVG element", () => {
    render(<RevenueChart title="Doanh thu Q1" data={dummyData} />);

    expect(screen.getByText("Doanh thu Q1")).toBeInTheDocument();
    expect(screen.getByText("Tháng 1")).toBeInTheDocument();
    expect(screen.getByText("Tháng 2")).toBeInTheDocument();
    expect(screen.getByText("Tháng 3")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Doanh thu Q1" })).toBeInTheDocument();
  });

  it("shows tooltip on circle hover", () => {
    const { container } = render(<RevenueChart data={dummyData} />);
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(3);

    fireEvent.mouseEnter(circles[1]);
    expect(screen.getByText("35.0M ₫")).toBeInTheDocument();

    fireEvent.mouseLeave(circles[1]);
    expect(screen.queryByText("35.0M ₫")).not.toBeInTheDocument();
  });
});
