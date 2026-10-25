import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ContactClientPage } from "./ContactClientPage";
import { I18nProvider } from "@/components/providers/I18nProvider";

describe("ContactClientPage", () => {
  it("renders showroom details, address, opening hours, hotline and map link", () => {
    render(
      <I18nProvider>
        <ContactClientPage />
      </I18nProvider>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Liên Hệ & Ghé Thăm Showroom"
    );
    expect(screen.getByText("Số 12 ngõ 80 Chùa Láng, Đống Đa, Hà Nội")).toBeInTheDocument();
    expect(screen.getByText("08:30 - 21:30 (Thứ Hai - Chủ Nhật)")).toBeInTheDocument();
    expect(screen.getByText("0987.654.321")).toBeInTheDocument();
    expect(screen.getByText("Mở ứng dụng Google Maps")).toBeInTheDocument();

    const mapLink = screen.getByRole("link", { name: /Mở ứng dụng Google Maps/i });
    expect(mapLink).toHaveAttribute("target", "_blank");
    expect(mapLink.getAttribute("href")).toContain("maps.google.com");
  });

  it("validates required fields when submitting empty form", async () => {
    const user = userEvent.setup();

    render(
      <I18nProvider>
        <ContactClientPage />
      </I18nProvider>
    );

    const submitBtn = screen.getByRole("button", { name: "Gửi lời nhắn" });
    await user.click(submitBtn);

    expect(screen.getByText("Vui lòng nhập họ và tên của bạn")).toBeInTheDocument();
    expect(screen.getByText("Vui lòng nhập số điện thoại liên hệ")).toBeInTheDocument();
  });

  it("submits message successfully with valid input and allows resetting", async () => {
    const user = userEvent.setup();

    render(
      <I18nProvider>
        <ContactClientPage />
      </I18nProvider>
    );

    const nameInput = screen.getByPlaceholderText("Ví dụ: Nguyễn Linh Chi");
    const phoneInput = screen.getByPlaceholderText("Ví dụ: 0912345678");
    const submitBtn = screen.getByRole("button", { name: "Gửi lời nhắn" });

    await user.type(nameInput, "Trần Mai Anh");
    await user.type(phoneInput, "0988776655");
    await user.click(submitBtn);

    await waitFor(
      () => {
        expect(screen.getByText("Gửi lời nhắn thành công!")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const resetBtn = screen.getByRole("button", { name: "Gửi lời nhắn khác" });
    await user.click(resetBtn);

    expect(screen.getByPlaceholderText("Ví dụ: Nguyễn Linh Chi")).toBeInTheDocument();
  });
});
