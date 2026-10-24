import { describe, it, expect } from "vitest";
import viMessages from "./locales/vi.json";
import enMessages from "./locales/en.json";

function getDeepKeys(obj: Record<string, unknown>, prefix = ""): string[] {
  return Object.keys(obj).reduce((res: string[], el: string) => {
    const val = obj[el];
    const newPrefix = prefix ? `${prefix}.${el}` : el;
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      res.push(...getDeepKeys(val as Record<string, unknown>, newPrefix));
    } else {
      res.push(newPrefix);
    }
    return res;
  }, []);
}

describe("CRM i18n key consistency", () => {
  it("should have identical keys in vi.json and en.json", () => {
    const viKeys = getDeepKeys(viMessages).sort();
    const enKeys = getDeepKeys(enMessages).sort();

    const missingInEn = viKeys.filter((k) => !enKeys.includes(k));
    const missingInVi = enKeys.filter((k) => !viKeys.includes(k));

    expect(missingInEn, "Keys present in vi.json but missing in en.json").toEqual([]);
    expect(missingInVi, "Keys present in en.json but missing in vi.json").toEqual([]);
    expect(viKeys).toEqual(enKeys);
  });
});
