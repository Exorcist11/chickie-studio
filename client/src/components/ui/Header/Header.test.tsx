import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { I18nProvider } from "@/components/providers/I18nProvider";
import { Header } from "./Header";

const renderHeader = (props = {}) => {
  return render(
    <I18nProvider locale="vi">
      <Header {...props} />
    </I18nProvider>
  );
};

describe("Header component", () => {
  it("renders desktop nav items and action buttons including LanguageSwitcher", () => {
    renderHeader({ onSearchClick: vi.fn(), favoriteCount: 3 });
    expect(screen.getByRole("link", { name: /thuê trang phục/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tìm kiếm sản phẩm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Danh sách yêu thích" })).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    // Verify LanguageSwitcher radiogroup is present
    expect(screen.getAllByRole("radiogroup", { name: "Chọn ngôn ngữ" }).length).toBeGreaterThan(0);
  });

  it("opens and closes mobile drawer", async () => {
    const user = userEvent.setup();
    renderHeader();

    const openBtn = screen.getByRole("button", { name: "Mở menu di động" });
    await user.click(openBtn);

    expect(screen.getByRole("dialog", { name: "Menu điều hướng di động" })).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Đóng menu di động" });
    await user.click(closeBtn);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes mobile drawer on Escape key", async () => {
    const user = userEvent.setup();
    renderHeader();

    const openBtn = screen.getByRole("button", { name: "Mở menu di động" });
    await user.click(openBtn);
    expect(screen.getByRole("dialog", { name: "Menu điều hướng di động" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes mobile drawer when clicking a mobile nav link", async () => {
    const user = userEvent.setup();
    renderHeader();

    const openBtn = screen.getByRole("button", { name: "Mở menu di động" });
    await user.click(openBtn);
    const dialog = screen.getByRole("dialog", { name: "Menu điều hướng di động" });

    const link = dialog.querySelector("a[href='/products?type=costume']");
    if (link) {
      await user.click(link);
    }
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("calls onAccountClick when account button is clicked", async () => {
    const user = userEvent.setup();
    const handleAccount = vi.fn();
    renderHeader({ onAccountClick: handleAccount });

    const accountBtn = screen.getByRole("button", { name: "Tài khoản cá nhân" });
    await user.click(accountBtn);
    expect(handleAccount).toHaveBeenCalledTimes(1);
  });

  it("highlights active nav link based on currentType", () => {
    const { unmount } = renderHeader({ currentType: "photography" });
    const photoLink = screen.getByRole("link", { name: "Dịch vụ chụp" });
    expect(photoLink.className).toContain("text-burgundy");
    unmount();

    const { unmount: unmountCostume } = renderHeader({ currentType: "costume" });
    const costumeLink = screen.getByRole("link", { name: "Thuê trang phục" });
    expect(costumeLink.className).toContain("text-burgundy");
    unmountCostume();

    renderHeader({ currentType: "" });
    const lookbookLink = screen.getByRole("link", { name: "Lookbook" });
    expect(lookbookLink.className).toContain("text-burgundy");
  });

  it("highlights active nav link based on activeHref", () => {
    const { unmount } = renderHeader({ activeHref: "/products?type=camera" });
    const cameraLink = screen.getByRole("link", { name: "Thuê máy ảnh" });
    expect(cameraLink.className).toContain("text-burgundy");
    unmount();

    renderHeader({ activeHref: "/tra-cuu-don" });
    const trackingLink = screen.getByRole("link", { name: "Tra cứu đơn" });
    expect(trackingLink.className).toContain("text-burgundy");
  });

  it("shows pending state and triggers progress when a nav link is clicked", async () => {
    const user = userEvent.setup();
    renderHeader({ activeHref: "/" });

    const costumeLink = screen.getByRole("link", { name: "Thuê trang phục" });
    await user.click(costumeLink);

    // After clicking, the link should enter pending state (contains animate-pulse)
    expect(costumeLink.className).toContain("animate-pulse");
  });

  it("has no accessibility violations", async () => {
    const { container } = renderHeader({ onSearchClick: vi.fn() });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
