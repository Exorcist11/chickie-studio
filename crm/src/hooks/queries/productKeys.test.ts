import { describe, it, expect } from "vitest";
import { productKeys } from "./productKeys";

describe("productKeys", () => {
  it("generates correct query keys hierarchy", () => {
    expect(productKeys.all).toEqual(["products"]);
    expect(productKeys.lists()).toEqual(["products", "list"]);
    expect(productKeys.list({ search: "dam" })).toEqual([
      "products",
      "list",
      { search: "dam" },
    ]);
    expect(productKeys.details()).toEqual(["products", "detail"]);
    expect(productKeys.detail(10)).toEqual(["products", "detail", 10]);
  });
});
