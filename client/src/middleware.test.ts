import { describe, it, expect, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import middleware from "./middleware";

// Mock next-intl/middleware
vi.mock("next-intl/middleware", () => {
  return {
    default: () => {
      return (req: NextRequest) => {
        return NextResponse.next();
      };
    },
  };
});

describe("Client middleware", () => {
  it("redirects unsupported 2-letter locale prefix to default locale vi", () => {
    const req = new NextRequest("http://localhost:3000/fr/products");
    const res = middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/vi/products");
  });

  it("redirects unsupported 2-letter root locale /ja to /vi", () => {
    const req = new NextRequest("http://localhost:3000/ja");
    const res = middleware(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/vi");
  });

  it("passes valid locale /vi/products to intlMiddleware", () => {
    const req = new NextRequest("http://localhost:3000/vi/products");
    const res = middleware(req);

    expect(res.status).toBe(200);
  });

  it("passes valid locale /en/products to intlMiddleware", () => {
    const req = new NextRequest("http://localhost:3000/en/products");
    const res = middleware(req);

    expect(res.status).toBe(200);
  });
});
