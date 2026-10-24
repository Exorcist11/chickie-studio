import { describe, it, expect } from "vitest";
import { authKeys } from "./authKeys";

describe("authKeys", () => {
  it("generates correct query keys", () => {
    expect(authKeys.all).toEqual(["auth"]);
    expect(authKeys.user()).toEqual(["auth", "user"]);
    expect(authKeys.profile()).toEqual(["auth", "profile"]);
  });
});
