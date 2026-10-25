import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Popover } from "./Popover";

describe("Popover component (CRM)", () => {
  it("renders trigger and toggles popover on click", () => {
    render(
      <Popover trigger={<button>Thông tin</button>}>
        <p>Chi tiết thông tin bổ sung</p>
      </Popover>
    );

    const trigger = screen.getByRole("button", { name: "Thông tin" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Chi tiết thông tin bổ sung")).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on click outside when closeOnClickOutside is true", () => {
    render(
      <div>
        <div data-testid="outside-crm">Bên ngoài</div>
        <Popover defaultOpen={true} trigger={<button>Trigger</button>}>
          <p>Nội dung</p>
        </Popover>
      </div>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId("outside-crm"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape key and restores focus to trigger", () => {
    render(
      <Popover trigger={<button>Trigger Btn</button>}>
        <p>Popover Content</p>
      </Popover>
    );

    const trigger = screen.getByRole("button", { name: "Trigger Btn" });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.activeElement).toBe(trigger);
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Popover defaultOpen={true} trigger={<button>Xem popover CRM</button>}>
        <p>Thông tin trợ năng</p>
      </Popover>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
