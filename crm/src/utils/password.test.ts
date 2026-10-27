import { describe, it, expect } from "vitest";
import { generateRandomPassword } from "./password";

describe("generateRandomPassword", () => {
  it("generates a password of length 12 that satisfies complex criteria", () => {
    const password = generateRandomPassword();
    expect(password.length).toBe(12);
    // At least one uppercase letter
    expect(/[A-Z]/.test(password)).toBe(true);
    // At least one lowercase letter
    expect(/[a-z]/.test(password)).toBe(true);
    // At least one digit
    expect(/[0-9]/.test(password)).toBe(true);
    // At least one special symbol
    expect(/[@#$!]/.test(password)).toBe(true);
  });
});
