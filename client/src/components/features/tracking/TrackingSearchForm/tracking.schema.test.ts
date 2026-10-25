import { describe, it, expect } from "vitest";
import { trackingSearchSchema } from "./tracking.schema";

describe("trackingSearchSchema", () => {
  it("passes validation with valid bookingCode and 0-prefixed phone", () => {
    const validData = {
      bookingCode: "BK20261025-ABCD",
      phone: "0912345678",
    };
    const result = trackingSearchSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("passes validation with valid +84-prefixed phone", () => {
    const validData = {
      bookingCode: "BK20261025-ABCD",
      phone: "+84912345678",
    };
    const result = trackingSearchSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails when bookingCode is empty or too short", () => {
    const emptyCode = {
      bookingCode: "   ",
      phone: "0912345678",
    };
    const res1 = trackingSearchSchema.safeParse(emptyCode);
    expect(res1.success).toBe(false);

    const shortCode = {
      bookingCode: "BK1",
      phone: "0912345678",
    };
    const res2 = trackingSearchSchema.safeParse(shortCode);
    expect(res2.success).toBe(false);
  });

  it("fails when phone number is invalid format", () => {
    const invalidPhone = {
      bookingCode: "BK20261025-ABCD",
      phone: "123456",
    };
    const result = trackingSearchSchema.safeParse(invalidPhone);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("phone");
    }
  });
});
