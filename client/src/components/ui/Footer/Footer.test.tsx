import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { Footer } from "./Footer";

const renderFooter = (props = {}) => {
  return render(
    <I18nProvider locale="vi">
      <Footer {...props} />
    </I18nProvider>
  );
};

describe("Footer component", () => {
  it("renders brand tagline, navigation, contact channels and LanguageSwitcher", () => {
    renderFooter({ hotline: "0987.654.321", address: "Số 12 Chùa Láng, Hà Nội" });
    expect(screen.getByText("More than just a dress")).toBeInTheDocument();
    expect(screen.getByText(/hotline: 0987\.654\.321/i)).toBeInTheDocument();
    expect(screen.getByText(/nhắn tin zalo tư vấn/i)).toBeInTheDocument();
    expect(screen.getByText(/số 12 chùa láng, hà nội/i)).toBeInTheDocument();
    // Verify LanguageSwitcher in footer
    expect(screen.getByRole("radiogroup", { name: "Chọn ngôn ngữ" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = renderFooter();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
