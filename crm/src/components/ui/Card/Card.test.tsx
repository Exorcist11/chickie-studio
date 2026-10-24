import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./Card";

describe("Card component (CRM UI Primitive)", () => {
  it("renders card and all subcomponents correctly", () => {
    render(
      <Card hoverEffect>
        <CardHeader>
          <CardTitle>Tiêu đề thẻ</CardTitle>
          <CardDescription>Mô tả chi tiết</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Nội dung chính</p>
        </CardContent>
        <CardFooter>
          <button>Hành động</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText("Tiêu đề thẻ")).toBeInTheDocument();
    expect(screen.getByText("Mô tả chi tiết")).toBeInTheDocument();
    expect(screen.getByText("Nội dung chính")).toBeInTheDocument();
    expect(screen.getByText("Hành động")).toBeInTheDocument();
  });
});
