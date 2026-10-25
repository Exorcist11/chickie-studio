import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./Accordion";

describe("Accordion", () => {
  it("renders closed items by default and expands on click", async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Câu hỏi 1</AccordionTrigger>
          <AccordionContent>Nội dung câu trả lời 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Câu hỏi 2</AccordionTrigger>
          <AccordionContent>Nội dung câu trả lời 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByRole("button", { name: /Câu hỏi 1/i });
    expect(trigger1).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Nội dung câu trả lời 1")).not.toBeInTheDocument();

    await user.click(trigger1);
    expect(trigger1).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Nội dung câu trả lời 1")).toBeInTheDocument();

    // Click again to collapse
    await user.click(trigger1);
    expect(trigger1).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Nội dung câu trả lời 1")).not.toBeInTheDocument();
  });

  it("handles defaultValue in single mode", () => {
    render(
      <Accordion type="single" defaultValue="item-2">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
    expect(screen.getByText("Content 2")).toBeInTheDocument();
  });

  it("supports multiple mode allowing multiple items open simultaneously", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Accordion type="multiple" onValueChange={onValueChange}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    await user.click(screen.getByRole("button", { name: /Item 1/i }));
    await user.click(screen.getByRole("button", { name: /Item 2/i }));

    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.getByText("Content 2")).toBeInTheDocument();
    expect(onValueChange).toHaveBeenCalledWith(["item-1", "item-2"]);
  });

  it("prevents expanding disabled item", async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="single">
        <AccordionItem value="disabled-item" disabled>
          <AccordionTrigger>Disabled Trigger</AccordionTrigger>
          <AccordionContent>Disabled Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button", { name: /Disabled Trigger/i });
    await user.click(trigger);
    expect(screen.queryByText("Disabled Content")).not.toBeInTheDocument();
  });
});
