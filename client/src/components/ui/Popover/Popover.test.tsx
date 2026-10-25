import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Popover } from "./Popover";

describe("Popover component", () => {
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

  it("supports controlled open and onOpenChange callback", () => {
    const handleOpenChange = vi.fn();
    const { rerender } = render(
      <Popover
        open={false}
        onOpenChange={handleOpenChange}
        trigger={<button>Mở Popover</button>}
      >
        <p>Nội dung controlled</p>
      </Popover>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Mở Popover" }));
    expect(handleOpenChange).toHaveBeenCalledWith(true);

    rerender(
      <Popover
        open={true}
        onOpenChange={handleOpenChange}
        trigger={<button>Mở Popover</button>}
      >
        <p>Nội dung controlled</p>
      </Popover>
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on click outside when closeOnClickOutside is true", () => {
    render(
      <div>
        <div data-testid="outside">Bên ngoài</div>
        <Popover defaultOpen={true} trigger={<button>Trigger</button>}>
          <p>Nội dung</p>
        </Popover>
      </div>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.mouseDown(screen.getByTestId("outside"));
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

  it("renders with different placements", () => {
    const { rerender } = render(
      <Popover
        defaultOpen={true}
        placement="top"
        align="center"
        trigger={<button>Trigger</button>}
      >
        <p>Top Popover</p>
      </Popover>
    );
    expect(screen.getByRole("dialog")).toHaveClass("bottom-full");

    rerender(
      <Popover
        defaultOpen={true}
        placement="right"
        align="start"
        trigger={<button>Trigger</button>}
      >
        <p>Right Popover</p>
      </Popover>
    );
    expect(screen.getByRole("dialog")).toHaveClass("left-full");
  });

  it("supports trigger ref and closeOnEsc=false", () => {
    const triggerRef = React.createRef<HTMLButtonElement>();
    render(
      <Popover
        defaultOpen={true}
        closeOnEsc={false}
        trigger={<button ref={triggerRef}>Trigger With Ref</button>}
      >
        <p>No Esc Close</p>
      </Popover>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Popover defaultOpen={true} trigger={<button>Xem popover</button>}>
        <p>Thông tin trợ năng</p>
      </Popover>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
