import * as React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./Card";

describe("Chickie Base Card Component", () => {
  it("renders card with all compound subcomponents", () => {
    render(
      <Card data-testid="test-card">
        <CardHeader>
          <CardTitle>Áo dài truyền thống gấm đỏ</CardTitle>
          <CardDescription>Mã sản phẩm: AD-2024-001</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Giá thuê: 350.000₫ / ngày</p>
        </CardContent>
        <CardFooter>
          <button type="button">Thuê ngay</button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByTestId("test-card")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Áo dài truyền thống gấm đỏ" })
    ).toBeInTheDocument();
    expect(screen.getByText("Mã sản phẩm: AD-2024-001")).toBeInTheDocument();
    expect(screen.getByText("Giá thuê: 350.000₫ / ngày")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Thuê ngay" })).toBeInTheDocument();
  });

  it("renders different heading levels with as prop on CardTitle", () => {
    const { rerender } = render(<CardTitle as="h1">Tiêu đề cấp 1</CardTitle>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Tiêu đề cấp 1"
    );

    rerender(<CardTitle as="h4">Tiêu đề cấp 4</CardTitle>);
    expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
      "Tiêu đề cấp 4"
    );
  });

  it("applies variant classes correctly", () => {
    const { rerender } = render(
      <Card data-testid="card-variant" variant="elevated">
        Nội dung
      </Card>
    );
    expect(screen.getByTestId("card-variant").className).toContain("shadow-md");

    rerender(
      <Card data-testid="card-variant" variant="outline">
        Nội dung
      </Card>
    );
    expect(screen.getByTestId("card-variant").className).toContain("shadow-none");

    rerender(
      <Card data-testid="card-variant" variant="ghost">
        Nội dung
      </Card>
    );
    expect(screen.getByTestId("card-variant").className).toContain("bg-transparent");
  });

  it("applies interactive styling and cursor pointer", () => {
    render(
      <Card data-testid="interactive-card" interactive>
        Nội dung tương tác
      </Card>
    );
    const card = screen.getByTestId("interactive-card");
    expect(card.className).toContain("cursor-pointer");
    expect(card.className).toContain("hover:shadow-lg");
  });

  it("forwards ref to the underlying card div", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Nội dung ref</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has no accessibility violations (a11y with vitest-axe)", async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Gói chụp ngoại cảnh</CardTitle>
          <CardDescription>Thời lượng: 4 giờ chụp ảnh</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Bao gồm 2 bộ trang phục và trang điểm trọn gói.</p>
        </CardContent>
        <CardFooter>
          <button type="button">Đặt lịch</button>
        </CardFooter>
      </Card>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
