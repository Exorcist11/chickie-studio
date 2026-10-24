import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AppLayout } from "./AppLayout";
import "../../../i18n";

describe("AppLayout", () => {
  it("renders brand, menu items, and user information", () => {
    render(
      <AppLayout userName="Nguyễn Văn A" userRole="Manager">
        <div>Nội dung trang quản trị</div>
      </AppLayout>
    );

    expect(screen.getByText("CHICKIE CRM")).toBeInTheDocument();
    expect(screen.getByText("Tổng quan")).toBeInTheDocument();
    expect(screen.getByText("Đơn thuê")).toBeInTheDocument();
    expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    expect(screen.getByText("Nội dung trang quản trị")).toBeInTheDocument();
  });

  it("handles sidebar collapse toggle", () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );

    const toggleBtn = screen.getByRole("button", { name: "Thu gọn menu" });
    fireEvent.click(toggleBtn);
    expect(screen.getByText("CS")).toBeInTheDocument();

    const expandBtn = screen.getByRole("button", { name: "Mở rộng menu" });
    fireEvent.click(expandBtn);
    expect(screen.getByText("CHICKIE CRM")).toBeInTheDocument();
  });

  it("calls onMenuClick when selecting an item", () => {
    const handleMenuClick = vi.fn();
    render(
      <AppLayout onMenuClick={handleMenuClick}>
        <div>Content</div>
      </AppLayout>
    );

    const ordersItem = screen.getByText("Đơn thuê");
    fireEvent.click(ordersItem);
    expect(handleMenuClick).toHaveBeenCalledWith("orders");
  });

  it("opens user menu and triggers logout", () => {
    const handleLogout = vi.fn();
    render(
      <AppLayout userName="Admin" onLogout={handleLogout}>
        <div>Content</div>
      </AppLayout>
    );

    const userBtn = screen.getByRole("button", { name: /Admin/i });
    fireEvent.click(userBtn);

    const logoutBtn = screen.getByRole("button", { name: /Đăng xuất/i });
    fireEvent.click(logoutBtn);
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });
});

