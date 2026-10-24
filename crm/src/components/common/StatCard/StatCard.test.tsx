import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatCard } from "./StatCard";
import { DollarSign } from "lucide-react";

describe("StatCard", () => {
  it("renders title, value, prefix, suffix, and trend", () => {
    render(
      <StatCard
        title="Tổng doanh thu"
        value="45,000,000"
        suffix="₫"
        trend={{ value: 12.5, isPositive: true, description: "so với tháng trước" }}
        icon={<DollarSign data-testid="stat-icon" />}
      />
    );

    expect(screen.getByText("Tổng doanh thu")).toBeInTheDocument();
    expect(screen.getByText("45,000,000")).toBeInTheDocument();
    expect(screen.getByText("₫")).toBeInTheDocument();
    expect(screen.getByText("12.5%")).toBeInTheDocument();
    expect(screen.getByText("so với tháng trước")).toBeInTheDocument();
    expect(screen.getByTestId("stat-icon")).toBeInTheDocument();
  });

  it("renders negative trend correctly", () => {
    render(
      <StatCard
        title="Đơn hủy"
        value={5}
        trend={{ value: 3.2, isPositive: false }}
      />
    );

    expect(screen.getByText("3.2%")).toBeInTheDocument();
  });
});
