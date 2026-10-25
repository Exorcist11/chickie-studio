import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./Accordion";

describe("Accordion Component (CRM)", () => {
  it("renders accordion and expands/collapses items on click", () => {
    render(
      <Accordion type="single" collapsible defaultValue="q1">
        <AccordionItem value="q1">
          <AccordionTrigger>Chính sách đổi trả CRM</AccordionTrigger>
          <AccordionContent>Nội dung chính sách đổi trả</AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger>Quy định giặt là</AccordionTrigger>
          <AccordionContent>Nội dung quy định giặt là</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText("Nội dung chính sách đổi trả")).toBeInTheDocument();
    expect(screen.queryByText("Nội dung quy định giặt là")).not.toBeInTheDocument();

    const q2Trigger = screen.getByRole("button", { name: "Quy định giặt là" });
    fireEvent.click(q2Trigger);

    expect(screen.getByText("Nội dung quy định giặt là")).toBeInTheDocument();
    expect(screen.queryByText("Nội dung chính sách đổi trả")).not.toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Accordion type="single" collapsible defaultValue="q1">
        <AccordionItem value="q1">
          <AccordionTrigger>Mục 1</AccordionTrigger>
          <AccordionContent>Nội dung 1</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
