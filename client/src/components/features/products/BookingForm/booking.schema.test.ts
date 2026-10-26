import { describe, it, expect } from "vitest";
import { createBookingSchema } from "./booking.schema";

describe("createBookingSchema", () => {
  const minDate = "2026-10-26";
  const schema = createBookingSchema(minDate);

  const validData = {
    size: "M",
    color: "Burgundy",
    rentalStartDate: "2026-10-27",
    rentalEndDate: "2026-10-29",
    fullName: "Nguyễn Quỳnh Anh",
    phone: "0912345678",
    email: "quynhanh@gmail.com",
    deliveryMethod: "PICKUP_STORE" as const,
    address: "",
    note: "Ghi chú thử đồ",
  };

  it("validates successfully with correct PICKUP_STORE data", () => {
    const result = schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("validates successfully with +84 phone format and valid SHIP_TO_ADDRESS", () => {
    const result = schema.safeParse({
      ...validData,
      phone: "+84 912 345 678",
      deliveryMethod: "SHIP_TO_ADDRESS",
      address: "123 Đường Láng, Hà Nội",
    });
    expect(result.success).toBe(true);
  });

  it("fails when fullName is empty or too short", () => {
    const res1 = schema.safeParse({ ...validData, fullName: "" });
    expect(res1.success).toBe(false);
    if (!res1.success) {
      expect(res1.error.issues[0].message).toContain("Vui lòng nhập họ và tên");
    }

    const res2 = schema.safeParse({ ...validData, fullName: "A" });
    expect(res2.success).toBe(false);
  });

  it("fails when phone is invalid", () => {
    const res1 = schema.safeParse({ ...validData, phone: "12345" });
    expect(res1.success).toBe(false);
    if (!res1.success) {
      expect(res1.error.issues[0].message).toContain("Số điện thoại không hợp lệ");
    }

    const res2 = schema.safeParse({ ...validData, phone: "0912abcd89" });
    expect(res2.success).toBe(false);
  });

  it("fails when email is empty or invalid format", () => {
    const res1 = schema.safeParse({ ...validData, email: "" });
    expect(res1.success).toBe(false);
    if (!res1.success) {
      expect(res1.error.issues[0].message).toContain("Vui lòng nhập địa chỉ email");
    }

    const res2 = schema.safeParse({ ...validData, email: "not-an-email" });
    expect(res2.success).toBe(false);
    if (!res2.success) {
      expect(res2.error.issues[0].message).toContain("không đúng định dạng");
    }

    const res3 = schema.safeParse({ ...validData, email: "test@domain" });
    expect(res3.success).toBe(false);
  });

  it("fails when rentalStartDate is in the past", () => {
    const res = schema.safeParse({
      ...validData,
      rentalStartDate: "2026-10-20",
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toContain("quá khứ");
    }
  });

  it("fails when rentalEndDate is before rentalStartDate", () => {
    const res = schema.safeParse({
      ...validData,
      rentalStartDate: "2026-10-28",
      rentalEndDate: "2026-10-27",
    });
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].message).toContain("trước ngày nhận");
    }
  });

  it("fails when deliveryMethod is SHIP_TO_ADDRESS and address is empty or too short", () => {
    const res1 = schema.safeParse({
      ...validData,
      deliveryMethod: "SHIP_TO_ADDRESS",
      address: "",
    });
    expect(res1.success).toBe(false);
    if (!res1.success) {
      expect(res1.error.issues[0].message).toContain("Vui lòng nhập địa chỉ");
    }

    const res2 = schema.safeParse({
      ...validData,
      deliveryMethod: "SHIP_TO_ADDRESS",
      address: "HN",
    });
    expect(res2.success).toBe(false);
    if (!res2.success) {
      expect(res2.error.issues[0].message).toContain("quá ngắn");
    }
  });
});
