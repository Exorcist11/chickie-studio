import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { axe } from "vitest-axe";
import { LanguageSwitcher } from "./LanguageSwitcher";

let mockCurrentLocale = "vi";
let mockPathname = "/products";

vi.mock("next-intl", () => ({
  useLocale: () => mockCurrentLocale,
}));

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => mockPathname,
  Link: ({
    children,
    href,
    locale,
    onClick,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    locale?: string;
  }) => (
    <a
      href={`/${locale}${href === "/" ? "" : href}`}
      onClick={(e) => {
        onClick?.(e);
      }}
      {...props}
    >
      {children}
    </a>
  ),
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "always",
}));

describe("LanguageSwitcher Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurrentLocale = "vi";
    mockPathname = "/products";
  });

  it("renders pill variant with VI active by default", () => {
    render(<LanguageSwitcher />);

    const viBtn = screen.getByRole("radio", { name: /Tiếng Việt/i });
    const enBtn = screen.getByRole("radio", { name: /Switch to English/i });

    expect(viBtn).toHaveAttribute("aria-checked", "true");
    expect(enBtn).toHaveAttribute("aria-checked", "false");
    expect(enBtn).toHaveAttribute("href", "/en/products");
  });

  it("renders pill variant with EN active when locale is en", () => {
    mockCurrentLocale = "en";
    render(<LanguageSwitcher />);

    const viBtn = screen.getByRole("radio", { name: /Tiếng Việt/i });
    const enBtn = screen.getByRole("radio", { name: /Switch to English/i });

    expect(enBtn).toHaveAttribute("aria-checked", "true");
    expect(viBtn).toHaveAttribute("aria-checked", "false");
    expect(viBtn).toHaveAttribute("href", "/vi/products");
  });

  it("invokes onLocaleChange when clicking the English link", async () => {
    const handleLocaleChange = vi.fn();
    const user = userEvent.setup();

    render(<LanguageSwitcher onLocaleChange={handleLocaleChange} />);

    const enBtn = screen.getByRole("radio", { name: /Switch to English/i });
    await user.click(enBtn);

    expect(handleLocaleChange).toHaveBeenCalledWith("en");
  });

  it("renders compact variant with correct radio state and links", async () => {
    mockCurrentLocale = "en";
    const user = userEvent.setup();
    const handleLocaleChange = vi.fn();

    render(
      <LanguageSwitcher variant="compact" onLocaleChange={handleLocaleChange} />
    );

    const viBtn = screen.getByRole("radio", { name: "Tiếng Việt" });
    const enBtn = screen.getByRole("radio", { name: "English" });

    expect(enBtn).toHaveAttribute("aria-checked", "true");
    expect(viBtn).toHaveAttribute("aria-checked", "false");
    expect(viBtn).toHaveAttribute("href", "/vi/products");

    await user.click(viBtn);
    expect(handleLocaleChange).toHaveBeenCalledWith("vi");
  });

  it("renders icon variant switching to English when current locale is vi", async () => {
    mockCurrentLocale = "vi";
    const user = userEvent.setup();
    const handleLocaleChange = vi.fn();

    render(
      <LanguageSwitcher variant="icon" onLocaleChange={handleLocaleChange} />
    );

    const toggleBtn = screen.getByRole("radio", { name: /Switch to English/i });
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute("href", "/en/products");
    expect(screen.getByText("vi")).toBeInTheDocument();

    await user.click(toggleBtn);
    expect(handleLocaleChange).toHaveBeenCalledWith("en");
  });

  it("renders icon variant switching to Vietnamese when current locale is en", async () => {
    mockCurrentLocale = "en";
    const user = userEvent.setup();
    const handleLocaleChange = vi.fn();

    render(
      <LanguageSwitcher variant="icon" onLocaleChange={handleLocaleChange} />
    );

    const toggleBtn = screen.getByRole("radio", { name: /Chuyển sang Tiếng Việt/i });
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute("href", "/vi/products");
    expect(screen.getByText("en")).toBeInTheDocument();

    await user.click(toggleBtn);
    expect(handleLocaleChange).toHaveBeenCalledWith("vi");
  });

  it("has no accessibility violations across all variants", async () => {
    const { container: pillContainer } = render(<LanguageSwitcher variant="pill" />);
    expect(await axe(pillContainer)).toHaveNoViolations();

    const { container: iconContainer } = render(<LanguageSwitcher variant="icon" />);
    expect(await axe(iconContainer)).toHaveNoViolations();
  });
});
