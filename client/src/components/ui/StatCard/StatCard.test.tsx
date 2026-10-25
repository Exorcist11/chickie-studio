import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Sparkles } from "lucide-react";
import { axe } from "vitest-axe";
import { StatCard } from "./StatCard";

describe("StatCard Component", () => {
  it("renders title, value, prefix and suffix", () => {
    render(
      <StatCard
        title="Tổng chi tiêu thuê đồ"
        value="12.500.000"
        suffix="₫"
        prefix="~"
        icon={<Sparkles data-testid="stat-icon" />}
      />
    );

    expect(screen.getByText("Tổng chi tiêu thuê đồ")).toBeInTheDocument();
    expect(screen.getByText("12.500.000")).toBeInTheDocument();
    expect(screen.getByText("₫")).toBeInTheDocument();
    expect(screen.getByText("~")).toBeInTheDocument();
    expect(screen.getByTestId("stat-icon")).toBeInTheDocument();
  });

  it("renders positive trend indicator", () => {
    render(
      <StatCard
        title="Lượt thuê tháng này"
        value="48"
        trend={{ value: 15.2, isPositive: true, description: "so với tháng trước" }}
      />
    );

    expect(screen.getByText("15.2%")).toBeInTheDocument();
    expect(screen.getByText("so với tháng trước")).toBeInTheDocument();
  });

  it("renders negative trend indicator", () => {
    render(
      <StatCard
        title="Tỷ lệ hủy đơn"
        value="2.1"
        suffix="%"
        trend={{ value: 0.8, isPositive: false, description: "giảm thiểu" }}
      />
    );

    expect(screen.getByText("0.8%")).toBeInTheDocument();
    expect(screen.getByText("giảm thiểu")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <StatCard
        title="Số lượng mẫu đầm"
        value="250+"
        trend={{ value: 12, isPositive: true }}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
