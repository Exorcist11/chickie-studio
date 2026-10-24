import { describe, it, expect } from "vitest";
import { queryClient } from "./queryClient";

describe("queryClient", () => {
  it("initializes QueryClient with correct default options", () => {
    const defaultQueryOptions = queryClient.getDefaultOptions().queries;
    const defaultMutationOptions = queryClient.getDefaultOptions().mutations;

    expect(defaultQueryOptions?.retry).toBe(1);
    expect(defaultQueryOptions?.refetchOnWindowFocus).toBe(false);
    expect(defaultQueryOptions?.staleTime).toBe(300000);
    expect(defaultMutationOptions?.retry).toBe(0);
  });
});
