import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";

describe("Tabs Component (Client)", () => {
  it("renders tabs and switches active tab on click", () => {
    const handleValueChange = vi.fn();
    render(
      <Tabs defaultValue="tab1" onValueChange={handleValueChange}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Nội dung tab 1</TabsContent>
        <TabsContent value="tab2">Nội dung tab 2</TabsContent>
      </Tabs>
    );

    expect(screen.getByText("Nội dung tab 1")).toBeInTheDocument();
    expect(screen.queryByText("Nội dung tab 2")).not.toBeInTheDocument();

    const tab2Btn = screen.getByRole("tab", { name: "Tab 2" });
    fireEvent.click(tab2Btn);

    expect(handleValueChange).toHaveBeenCalledWith("tab2");
    expect(screen.getByText("Nội dung tab 2")).toBeInTheDocument();
    expect(screen.queryByText("Nội dung tab 1")).not.toBeInTheDocument();
  });

  it("supports keyboard navigation with arrow keys", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Nội dung 1</TabsContent>
        <TabsContent value="tab2">Nội dung 2</TabsContent>
        <TabsContent value="tab3">Nội dung 3</TabsContent>
      </Tabs>
    );

    const tab1 = screen.getByRole("tab", { name: "Tab 1" });
    tab1.focus();

    const list = screen.getByRole("tablist");
    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(screen.getByText("Nội dung 2")).toBeInTheDocument();

    fireEvent.keyDown(list, { key: "ArrowLeft" });
    expect(screen.getByText("Nội dung 1")).toBeInTheDocument();

    fireEvent.keyDown(list, { key: "End" });
    expect(screen.getByText("Nội dung 3")).toBeInTheDocument();

    fireEvent.keyDown(list, { key: "Home" });
    expect(screen.getByText("Nội dung 1")).toBeInTheDocument();
  });

  it("renders underline variant and vertical orientation properly", () => {
    render(
      <Tabs defaultValue="overview" variant="underline" orientation="vertical">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Nội dung tổng quan</TabsContent>
      </Tabs>
    );

    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
    expect(screen.getByText("Nội dung tổng quan")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Nội dung hợp lệ</TabsContent>
        <TabsContent value="tab2">Nội dung khác</TabsContent>
      </Tabs>
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
