import { describe, it, expect } from "vitest";
import { dispatchKeys } from "./dispatchKeys";

describe("dispatchKeys", () => {
  it("should generate correct query keys hierarchy", () => {
    expect(dispatchKeys.all).toEqual(["dispatch"]);
    expect(dispatchKeys.calendar()).toEqual(["dispatch", "calendar", undefined]);
    expect(dispatchKeys.calendar({ startDate: "2026-10-01", endDate: "2026-10-31" })).toEqual([
      "dispatch",
      "calendar",
      { startDate: "2026-10-01", endDate: "2026-10-31" },
    ]);
    expect(dispatchKeys.timeline()).toEqual(["dispatch", "timeline", undefined]);
    expect(dispatchKeys.timeline({ categoryId: 1 })).toEqual([
      "dispatch",
      "timeline",
      { categoryId: 1 },
    ]);
    expect(dispatchKeys.replacements(10)).toEqual(["dispatch", "replacements", 10]);
  });
});
