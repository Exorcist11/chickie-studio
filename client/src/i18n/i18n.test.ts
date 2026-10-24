import { describe, it, expect } from "vitest";
import vi from "./messages/vi.json";
import en from "./messages/en.json";

function getNestedKeys(obj: Record<string, any>, prefix = ""): string[] {
  return Object.keys(obj).reduce((res: string[], el: string) => {
    const key = prefix ? `${prefix}.${el}` : el;
    if (typeof obj[el] === "object" && obj[el] !== null && !Array.isArray(obj[el])) {
      return [...res, ...getNestedKeys(obj[el], key)];
    }
    return [...res, key];
  }, []);
}

describe("Client i18n messages parity", () => {
  it("vi.json and en.json should have identical keys", () => {
    const viKeys = getNestedKeys(vi).sort();
    const enKeys = getNestedKeys(en).sort();

    expect(viKeys).toEqual(enKeys);
  });
});
