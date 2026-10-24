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

  it("has no accessibility violations", async () => {
    const { container } = render(<Header onSearchClick={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
