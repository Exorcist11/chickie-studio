import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";

describe("Tabs Component (CRM)", () => {
  it("renders tabs and switches active tab on click", () => {
    const handleValueChange = vi.fn();
    render(
      <Tabs defaultValue="products" onValueChange={handleValueChange}>
        <TabsList>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
        </TabsList>
        <TabsContent value="products">Nội dung sản phẩm CRM</TabsContent>
        <TabsContent value="orders">Nội dung đơn hàng CRM</TabsContent>
      </Tabs>
    );

    expect(screen.getByText("Nội dung sản phẩm CRM")).toBeInTheDocument();
    expect(screen.queryByText("Nội dung đơn hàng CRM")).not.toBeInTheDocument();

    const ordersBtn = screen.getByRole("tab", { name: "Đơn hàng" });
    fireEvent.click(ordersBtn);

    expect(handleValueChange).toHaveBeenCalledWith("orders");
    expect(screen.getByText("Nội dung đơn hàng CRM")).toBeInTheDocument();
  });

  it("navigates tabs using keyboard arrow keys", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Nội dung 1</TabsContent>
        <TabsContent value="tab2">Nội dung 2</TabsContent>
      </Tabs>
    );

    const tab1 = screen.getByRole("tab", { name: "Tab 1" });
    tab1.focus();

    const list = screen.getByRole("tablist");
    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(screen.getByText("Nội dung 2")).toBeInTheDocument();
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
