import { describe, it, expect } from "vitest";
import { bookingKeys } from "./bookingKeys";

describe("bookingKeys", () => {
  it("generates correct key hierarchy", () => {
    expect(bookingKeys.all).toEqual(["bookings"]);
    expect(bookingKeys.lists()).toEqual(["bookings", "list"]);
    expect(bookingKeys.list({ status: "PENDING" })).toEqual([
      "bookings",
      "list",
      { status: "PENDING" },
    ]);
    expect(bookingKeys.details()).toEqual(["bookings", "detail"]);
    expect(bookingKeys.detail(10)).toEqual(["bookings", "detail", 10]);
  });
});
