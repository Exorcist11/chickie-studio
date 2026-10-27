import { describe, it, expect } from "vitest";
import { staffKeys } from "./staffKeys";

describe("staffKeys", () => {
  it("generates correct query keys", () => {
    expect(staffKeys.all).toEqual(["staffs"]);
    expect(staffKeys.lists()).toEqual(["staffs", "list"]);
    expect(staffKeys.list({ role: "ROLE_STAFF" })).toEqual([
      "staffs",
      "list",
      { role: "ROLE_STAFF" },
    ]);
    expect(staffKeys.details()).toEqual(["staffs", "detail"]);
    expect(staffKeys.detail(5)).toEqual(["staffs", "detail", 5]);
  });
});
