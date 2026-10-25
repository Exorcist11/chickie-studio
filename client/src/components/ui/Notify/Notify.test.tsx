import * as React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";
import { notify, Toaster } from "./index";

describe("Notify and Toaster system", () => {
  beforeEach(() => {
    notify.dismiss();
    vi.useFakeTimers();
  });

  afterEach(() => {
    notify.dismiss();
    vi.useRealTimers();
  });

  it("renders toast when notify.success is called", () => {
    render(<Toaster />);

    act(() => {
      notify.success("Tạo đơn hàng thành công!", { title: "Thành công" });
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Thành công")).toBeInTheDocument();
    expect(screen.getByText("Tạo đơn hàng thành công!")).toBeInTheDocument();
  });

  it("renders error, warning, and info variants", () => {
    render(<Toaster />);

    act(() => {
      notify.error("Lỗi kết nối máy chủ");
      notify.warning("Số lượng sắp hết");
      notify.info("Cập nhật thông tin");
    });

    expect(screen.getByText("Lỗi kết nối máy chủ")).toBeInTheDocument();
    expect(screen.getByText("Số lượng sắp hết")).toBeInTheDocument();
    expect(screen.getByText("Cập nhật thông tin")).toBeInTheDocument();
  });

  it("auto dismisses toast after specified duration", () => {
    render(<Toaster />);

    act(() => {
      notify.success("Tin nhắn tự biến mất", { duration: 1000 });
    });

    expect(screen.getByText("Tin nhắn tự biến mất")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText("Tin nhắn tự biến mất")).not.toBeInTheDocument();
  });

  it("dismisses toast when close button is clicked", () => {
    render(<Toaster />);

    act(() => {
      notify.info("Thông báo có thể đóng");
    });

    const closeBtn = screen.getByRole("button", { name: "Đóng thông báo" });
    fireEvent.click(closeBtn);

    expect(screen.queryByText("Thông báo có thể đóng")).not.toBeInTheDocument();
  });

  it("pauses timer on mouseEnter and resumes on mouseLeave", () => {
    render(<Toaster />);

    act(() => {
      notify.success("Tạm dừng khi rê chuột", { duration: 2000 });
    });

    const toastElement = screen.getByRole("status");

    // Advance 1000ms
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Hover -> pause
    fireEvent.mouseEnter(toastElement);

    // Advance another 2000ms while paused
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText("Tạm dừng khi rê chuột")).toBeInTheDocument();

    // Mouse leave -> resumes
    fireEvent.mouseLeave(toastElement);

    // Advance remaining 1000ms
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText("Tạm dừng khi rê chuột")).not.toBeInTheDocument();
  });

  it("clears all toasts with notify.dismiss()", () => {
    render(<Toaster />);

    act(() => {
      notify.success("Thông báo 1");
      notify.error("Thông báo 2");
    });

    expect(screen.getByText("Thông báo 1")).toBeInTheDocument();
    expect(screen.getByText("Thông báo 2")).toBeInTheDocument();

    act(() => {
      notify.dismiss();
    });

    expect(screen.queryByText("Thông báo 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Thông báo 2")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    vi.useRealTimers();
    const { container } = render(<Toaster />);

    act(() => {
      notify.success("Trợ năng chuẩn", { title: "Tiêu đề" });
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
