import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { FaqClientPage } from "./FaqClientPage";
import { I18nProvider } from "@/components/providers/I18nProvider";

describe("FaqClientPage", () => {
  it("renders page header, category pills and faq items", () => {
    render(
      <I18nProvider>
        <FaqClientPage />
      </I18nProvider>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Câu Hỏi Thường Gặp"
    );
    expect(screen.getByPlaceholderText("Tìm kiếm câu hỏi thắc mắc...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tất cả câu hỏi" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Giặt ủi & Giữ gìn" })).toBeInTheDocument();
    expect(
      screen.getByText("Tôi có cần tự giặt hấp trang phục trước khi trả lại tiệm không?")
    ).toBeInTheDocument();
  });

  it("filters faq list by keyword in search input", async () => {
    const user = userEvent.setup();

    render(
      <I18nProvider>
        <FaqClientPage />
      </I18nProvider>
    );

    const searchInput = screen.getByPlaceholderText("Tìm kiếm câu hỏi thắc mắc...");
    await user.type(searchInput, "thử đồ");

    expect(
      screen.getByText("Chickie Studio có hỗ trợ đến thử đồ trực tiếp tại showroom không?")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Tôi có cần tự giặt hấp trang phục trước khi trả lại tiệm không?")
    ).not.toBeInTheDocument();
  });

  it("shows empty state when no faq matches query and resets filter", async () => {
    const user = userEvent.setup();

    render(
      <I18nProvider>
        <FaqClientPage />
      </I18nProvider>
    );

    const searchInput = screen.getByPlaceholderText("Tìm kiếm câu hỏi thắc mắc...");
    await user.type(searchInput, "xyzabcrandomnotfound");

    expect(
      screen.getByText("Không tìm thấy câu hỏi phù hợp với từ khóa của bạn.")
    ).toBeInTheDocument();

    const resetButton = screen.getByRole("button", { name: "Xóa bộ lọc tìm kiếm" });
    await user.click(resetButton);

    expect(
      screen.getByText("Tôi có cần tự giặt hấp trang phục trước khi trả lại tiệm không?")
    ).toBeInTheDocument();
  });

  it("switches category pill and expands an accordion item on click", async () => {
    const user = userEvent.setup();

    render(
      <I18nProvider>
        <FaqClientPage />
      </I18nProvider>
    );

    // Filter by fitting category
    const fittingPill = screen.getByRole("button", { name: "Thử đồ & Giao nhận" });
    await user.click(fittingPill);

    // In fitting category, faq-2 is now the first item or can be clicked
    const faqButton = screen.getByRole("button", {
      name: /Chickie Studio có hỗ trợ đến thử đồ trực tiếp tại showroom không/i,
    });
    await user.click(faqButton);

    expect(
      screen.getByText(/Tiệm có 3 phòng thử đồ riêng tư/i)
    ).toBeInTheDocument();
  });
});
