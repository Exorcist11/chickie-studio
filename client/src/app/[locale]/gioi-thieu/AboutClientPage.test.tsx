import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { AboutClientPage } from "./AboutClientPage";
import { I18nProvider } from "@/components/providers/I18nProvider";

describe("AboutClientPage", () => {
  it("renders brand story, stats, core values, showroom and CTA buttons", () => {
    render(
      <I18nProvider>
        <AboutClientPage />
      </I18nProvider>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Về Chickie Studio");
    expect(screen.getByText("More Than Just A Dress")).toBeInTheDocument();
    expect(screen.getByText("200+")).toBeInTheDocument();
    expect(screen.getByText("Mẫu thiết kế độc quyền")).toBeInTheDocument();
    expect(screen.getByText("5,000+")).toBeInTheDocument();

    expect(screen.getByText("Giá Trị Cốt Lõi Của Chúng Mình")).toBeInTheDocument();
    expect(screen.getByText("Chất Lượng Vượt Trội")).toBeInTheDocument();
    expect(screen.getByText("Chuẩn Form Tôn Dáng")).toBeInTheDocument();
    expect(screen.getByText("Khử Khuẩn An Toàn")).toBeInTheDocument();
    expect(screen.getByText("Tận Tâm Đồng Hành")).toBeInTheDocument();

    expect(screen.getByText("Ghé Thăm Showroom Chickie")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Chỉ đường tới showroom/i })
    ).toHaveAttribute("href", "/lien-he");

    expect(screen.getByRole("link", { name: /Xem bộ sưu tập váy/i })).toHaveAttribute(
      "href",
      "/products"
    );
  });
});
