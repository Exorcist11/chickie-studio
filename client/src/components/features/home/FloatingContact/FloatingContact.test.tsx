import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FloatingContact } from "./FloatingContact";

describe("FloatingContact Component", () => {
  it("renders hotline and zalo links with default props", () => {
    render(<FloatingContact />);

    const hotlineLink = screen.getByRole("link", {
      name: /Gọi hotline tư vấn trực tiếp: 0987.654.321/i,
    });
    expect(hotlineLink).toHaveAttribute("href", "tel:0987654321");

    const zaloLink = screen.getByRole("link", {
      name: /Nhắn tin tư vấn trực tiếp qua Zalo/i,
    });
    expect(zaloLink).toHaveAttribute("href", "https://zalo.me/0987654321");
    expect(zaloLink).toHaveAttribute("target", "_blank");
    expect(zaloLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders with custom hotline and zalo url", () => {
    render(
      <FloatingContact
        hotline="0123456789"
        hotlineDisplay="0123.456.789"
        zaloUrl="https://zalo.me/0123456789"
      />
    );

    const hotlineLink = screen.getByRole("link", {
      name: /Gọi hotline tư vấn trực tiếp: 0123.456.789/i,
    });
    expect(hotlineLink).toHaveAttribute("href", "tel:0123456789");

    const zaloLink = screen.getByRole("link", {
      name: /Nhắn tin tư vấn trực tiếp qua Zalo/i,
    });
    expect(zaloLink).toHaveAttribute("href", "https://zalo.me/0123456789");
  });
});
