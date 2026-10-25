import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Menu, MenuItem, MenuHeader, MenuDivider } from "./Menu";

describe("Menu component", () => {
  it("renders trigger and toggles menu on click", () => {
    render(
      <Menu trigger={<button>Tùy chọn</button>}>
        <MenuItem>Xem chi tiết</MenuItem>
      </Menu>
    );

    const trigger = screen.getByRole("button", { name: "Tùy chọn" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Xem chi tiết" })).toBeInTheDocument();
  });

  it("handles MenuItem click and closes the menu", () => {
    const handleClick = vi.fn();
    render(
      <Menu trigger={<button>Tùy chọn</button>}>
        <MenuItem onClick={handleClick}>Sửa sản phẩm</MenuItem>
      </Menu>
    );

    fireEvent.click(screen.getByRole("button", { name: "Tùy chọn" }));
    const item = screen.getByRole("menuitem", { name: "Sửa sản phẩm" });
    fireEvent.click(item);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("does not trigger onClick when MenuItem is disabled", () => {
    const handleClick = vi.fn();
    render(
      <Menu trigger={<button>Tùy chọn</button>}>
        <MenuItem disabled onClick={handleClick}>Xóa vĩnh viễn</MenuItem>
      </Menu>
    );

    fireEvent.click(screen.getByRole("button", { name: "Tùy chọn" }));
    const item = screen.getByRole("menuitem", { name: "Xóa vĩnh viễn" });
    expect(item).toBeDisabled();

    fireEvent.click(item);
    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("renders MenuHeader, MenuDivider, and danger MenuItem", () => {
    render(
      <Menu trigger={<button>Menu</button>}>
        <MenuHeader>Hành động</MenuHeader>
        <MenuDivider />
        <MenuItem danger>Xóa tài khoản</MenuItem>
      </Menu>
    );

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByText("Hành động")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
    const dangerItem = screen.getByRole("menuitem", { name: "Xóa tài khoản" });
    expect(dangerItem).toHaveClass("text-danger");
  });

  it("closes when clicking outside", () => {
    render(
      <div>
        <div data-testid="outside">Bên ngoài</div>
        <Menu trigger={<button>Menu</button>}>
          <MenuItem>Mục 1</MenuItem>
        </Menu>
      </div>
    );

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes on Escape key and restores focus to trigger", () => {
    render(
      <Menu trigger={<button>Trigger Button</button>}>
        <MenuItem>Mục 1</MenuItem>
      </Menu>
    );

    const trigger = screen.getByRole("button", { name: "Trigger Button" });
    fireEvent.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("navigates items with ArrowDown, ArrowUp, Home, End", async () => {
    render(
      <Menu trigger={<button>Menu</button>}>
        <MenuItem>Mục 1</MenuItem>
        <MenuItem>Mục 2</MenuItem>
        <MenuItem>Mục 3</MenuItem>
      </Menu>
    );

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    const items = screen.getAllByRole("menuitem");

    await waitFor(() => expect(document.activeElement).toBe(items[0]));

    // ArrowDown -> item 2
    fireEvent.keyDown(document, { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[1]);

    // ArrowDown -> item 3
    fireEvent.keyDown(document, { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[2]);

    // ArrowDown from last wraps to item 1
    fireEvent.keyDown(document, { key: "ArrowDown" });
    expect(document.activeElement).toBe(items[0]);

    // ArrowUp from first wraps to item 3
    fireEvent.keyDown(document, { key: "ArrowUp" });
    expect(document.activeElement).toBe(items[2]);

    // Home -> item 1
    fireEvent.keyDown(document, { key: "Home" });
    expect(document.activeElement).toBe(items[0]);

    // End -> item 3
    fireEvent.keyDown(document, { key: "End" });
    expect(document.activeElement).toBe(items[2]);
  });

  it("renders with icon, right alignment and supports trigger ref object", () => {
    const triggerRef = React.createRef<HTMLButtonElement>();
    render(
      <Menu
        align="right"
        trigger={<button ref={triggerRef}>Menu Phải</button>}
      >
        <MenuItem icon={<span>*</span>}>Mục có icon</MenuItem>
      </Menu>
    );

    const trigger = screen.getByRole("button", { name: "Menu Phải" });
    fireEvent.click(trigger);

    const menu = screen.getByRole("menu");
    expect(menu).toHaveClass("right-0");
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Menu trigger={<button>Mở menu</button>}>
        <MenuItem>Tùy chọn 1</MenuItem>
      </Menu>
    );
    fireEvent.click(screen.getByRole("button", { name: "Mở menu" }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
