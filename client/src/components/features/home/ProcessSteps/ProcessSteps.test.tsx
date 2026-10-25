import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ProcessSteps } from "./ProcessSteps";
import { RentalStep } from "@/types/home";

describe("ProcessSteps Component", () => {
  it("renders default steps properly", () => {
    render(<ProcessSteps />);

    expect(screen.getByText("Quy Trình Thuê Đồ Đơn Giản")).toBeInTheDocument();
    expect(screen.getByText("Chọn mẫu & size")).toBeInTheDocument();
    expect(screen.getByText("Đặt cọc giữ đồ")).toBeInTheDocument();
    expect(screen.getByText("Nhận đồ xinh")).toBeInTheDocument();
    expect(screen.getByText("Trả đồ & hoàn cọc")).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
  });

  it("renders custom steps and custom title/description", () => {
    const customSteps: RentalStep[] = [
      {
        stepNumber: 1,
        title: "Bước 1 Custom",
        description: "Mô tả bước 1",
        icon: "sparkles",
      },
    ];

    render(
      <ProcessSteps
        steps={customSteps}
        title="Tiêu đề tùy chỉnh"
        description="Mô tả tùy chỉnh"
      />
    );

    expect(screen.getByText("Tiêu đề tùy chỉnh")).toBeInTheDocument();
    expect(screen.getByText("Mô tả tùy chỉnh")).toBeInTheDocument();
    expect(screen.getByText("Bước 1 Custom")).toBeInTheDocument();
    expect(screen.getByText("Mô tả bước 1")).toBeInTheDocument();
  });
});
