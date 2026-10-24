import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PageLoading } from "./PageLoading";
import "../../../i18n";

describe("PageLoading", () => {
  it("renders default loading tip", () => {
    render(<PageLoading />);
    expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders custom loading tip", () => {
    render(<PageLoading tip="Đang chuẩn bị báo cáo..." />);
    expect(screen.getByText("Đang chuẩn bị báo cáo...")).toBeInTheDocument();
  });
});

