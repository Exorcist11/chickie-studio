import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "../../../../i18n";
import { ItemStatusBadge } from "./ItemStatusBadge";

describe("ItemStatusBadge", () => {
  it("renders AVAILABLE status with green style and proper label", () => {
    render(<ItemStatusBadge status="AVAILABLE" />);
    expect(screen.getByRole("status")).toHaveTextContent("Sẵn sàng");
  });

  it("renders RENTED status properly", () => {
    render(<ItemStatusBadge status="RENTED" />);
    expect(screen.getByRole("status")).toHaveTextContent("Đang cho thuê");
  });

  it("renders LAUNDRY status properly", () => {
    render(<ItemStatusBadge status="LAUNDRY" />);
    expect(screen.getByRole("status")).toHaveTextContent("Đang giặt ủi");
  });

  it("renders MAINTENANCE status properly", () => {
    render(<ItemStatusBadge status="MAINTENANCE" />);
    expect(screen.getByRole("status")).toHaveTextContent("Đang sửa chữa");
  });

  it("renders RETIRED status properly", () => {
    render(<ItemStatusBadge status="RETIRED" />);
    expect(screen.getByRole("status")).toHaveTextContent("Ngừng cho thuê");
  });
});
