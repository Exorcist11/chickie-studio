import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";
import { notify, Toaster } from "./index";

describe("Notify and Toaster system (CRM)", () => {
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
      notify.success("Lưu thành công!", { title: "Thành công" });
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByText("Thành công")).toBeInTheDocument();
    expect(screen.getByText("Lưu thành công!")).toBeInTheDocument();
  });

  it("renders error, warning, and info variants", () => {
    render(<Toaster />);

    act(() => {
      notify.error("Lỗi xóa danh mục");
      notify.warning("Cảnh báo kho đồ");
      notify.info("Dữ liệu đã cập nhật");
    });

    expect(screen.getByText("Lỗi xóa danh mục")).toBeInTheDocument();
    expect(screen.getByText("Cảnh báo kho đồ")).toBeInTheDocument();
    expect(screen.getByText("Dữ liệu đã cập nhật")).toBeInTheDocument();
  });

  it("auto dismisses toast after specified duration", () => {
    render(<Toaster />);

    act(() => {
      notify.success("Tin nhắn tự đóng", { duration: 1000 });
    });

    expect(screen.getByText("Tin nhắn tự đóng")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText("Tin nhắn tự đóng")).not.toBeInTheDocument();
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

  it("pauses timer on hover and resumes on leave", () => {
    render(<Toaster />);

    act(() => {
      notify.success("Dừng khi hover", { duration: 2000 });
    });

    const toastElement = screen.getByRole("status");
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    fireEvent.mouseEnter(toastElement);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText("Dừng khi hover")).toBeInTheDocument();

    fireEvent.mouseLeave(toastElement);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByText("Dừng khi hover")).not.toBeInTheDocument();
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
