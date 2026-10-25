import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { PolicyClientPage } from "./PolicyClientPage";
import { I18nProvider } from "@/components/providers/I18nProvider";

describe("PolicyClientPage", () => {
  it("renders page title, sections, table and breadcrumbs", () => {
    render(
      <I18nProvider>
        <PolicyClientPage />
      </I18nProvider>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Chính Sách Thuê Đồ & Đặt Cọc"
    );
    expect(screen.getByText("Mục lục chính sách")).toBeInTheDocument();
    expect(screen.getAllByText("1. Quy Định Đặt Cọc & Giữ Lịch").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("2. Hướng Dẫn Giữ Gìn & Bảo Quản").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("3. Quy Định Thời Gian Trả & Phụ Phí Trễ Hạn").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("4. Biểu Phí Xử Lý Hư Hại & Mất Mát").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("5. Chính Sách Đổi Ngày & Hủy Đơn").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Tình trạng hư hại")).toBeInTheDocument();
  });

  it("handles sidebar toc item click to scroll", async () => {
    const user = userEvent.setup();
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    render(
      <I18nProvider>
        <PolicyClientPage />
      </I18nProvider>
    );

    const depositButton = screen.getAllByRole("button", { name: /1\. Quy Định Đặt Cọc/i })[0];
    await user.click(depositButton);

    expect(scrollIntoViewMock).toHaveBeenCalled();
  });
});
