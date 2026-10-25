import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Menu, MenuItem, MenuHeader, MenuDivider } from "./Menu";

describe("Menu component (CRM)", () => {
  it("renders trigger and toggles menu on click", () => {
    render(
      <Menu trigger={<button>Thao tác</button>}>
        <MenuItem>Xem đơn hàng</MenuItem>
      </Menu>
    );

    const trigger = screen.getByRole("button", { name: "Thao tác" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Xem đơn hàng" })).toBeInTheDocument();
  });

  it("handles MenuItem click and closes menu", () => {
    const handleClick = vi.fn();
    render(
      <Menu trigger={<button>Thao tác</button>}>
        <MenuItem onClick={handleClick}>Chỉnh sửa</MenuItem>
      </Menu>
    );

    fireEvent.click(screen.getByRole("button", { name: "Thao tác" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Chỉnh sửa" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("does not trigger onClick when MenuItem is disabled", () => {
    const handleClick = vi.fn();
    render(
      <Menu trigger={<button>Thao tác</button>}>
        <MenuItem disabled onClick={handleClick}>Hủy đơn</MenuItem>
      </Menu>
    );

    fireEvent.click(screen.getByRole("button", { name: "Thao tác" }));
    const item = screen.getByRole("menuitem", { name: "Hủy đơn" });
    expect(item).toBeDisabled();

    fireEvent.click(item);
    expect(handleClick).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });

  it("renders MenuHeader, MenuDivider and danger item", () => {
    render(
      <Menu trigger={<button>Menu</button>}>
        <MenuHeader>Cài đặt</MenuHeader>
        <MenuDivider />
        <MenuItem danger>Xóa vĩnh viễn</MenuItem>
      </Menu>
    );

    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.getByText("Cài đặt")).toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Xóa vĩnh viễn" })).toHaveClass("text-danger");
  });

  it("closes on Escape key and restores focus to trigger", () => {
    render(
      <Menu trigger={<button>Trigger Btn</button>}>
        <MenuItem>Mục 1</MenuItem>
      </Menu>
    );

    const trigger = screen.getByRole("button", { name: "Trigger Btn" });
    fireEvent.click(trigger);
    expect(screen.getByRole("menu")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Menu trigger={<button>Mở menu CRM</button>}>
        <MenuItem>Hành động 1</MenuItem>
      </Menu>
    );
    fireEvent.click(screen.getByRole("button", { name: "Mở menu CRM" }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
