import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Header } from "./Header";

describe("Header component", () => {
  it("renders desktop nav items and action buttons", () => {
    render(<Header onSearchClick={vi.fn()} favoriteCount={3} />);
    expect(screen.getByRole("link", { name: /thuê trang phục/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tìm kiếm sản phẩm" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Danh sách yêu thích" })).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("opens and closes mobile drawer", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const openBtn = screen.getByRole("button", { name: "Mở menu di động" });
    await user.click(openBtn);

    expect(screen.getByRole("dialog", { name: "Menu điều hướng di động" })).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Đóng menu di động" });
    await user.click(closeBtn);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes mobile drawer on Escape key", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const openBtn = screen.getByRole("button", { name: "Mở menu di động" });
    await user.click(openBtn);
    expect(screen.getByRole("dialog", { name: "Menu điều hướng di động" })).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes mobile drawer when clicking a mobile nav link", async () => {
    const user = userEvent.setup();
    render(<Header />);

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
    render(<Header onAccountClick={handleAccount} />);

    await user.click(screen.getByRole("button", { name: "Tài khoản cá nhân" }));
    expect(handleAccount).toHaveBeenCalledTimes(1);
  });

  it("highlights active nav link based on currentType", () => {
    const { unmount } = render(<Header currentType="photography" />);
    const photoLink = screen.getByRole("link", { name: "Dịch vụ chụp" });
    expect(photoLink).toHaveClass("text-burgundy");
    expect(photoLink).toHaveClass("font-semibold");
    unmount();

    const { unmount: unmountCostume } = render(<Header currentType="costume" />);
    const costumeLink = screen.getByRole("link", { name: "Thuê trang phục" });
    expect(costumeLink).toHaveClass("text-burgundy");
    unmountCostume();

    render(<Header currentType="" />);
    const lookbookLink = screen.getByRole("link", { name: "Lookbook" });
    expect(lookbookLink).toHaveClass("text-burgundy");
  });

  it("highlights active nav link based on activeHref", () => {
    const { unmount } = render(<Header activeHref="/products?type=camera" />);
    const cameraLink = screen.getByRole("link", { name: "Thuê máy ảnh" });
    expect(cameraLink).toHaveClass("text-burgundy");
    unmount();

    render(<Header activeHref="/tra-cuu-don" />);
    const trackingLink = screen.getByRole("link", { name: "Tra cứu đơn" });
    expect(trackingLink).toHaveClass("text-burgundy");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Header onSearchClick={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
