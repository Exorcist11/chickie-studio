import "@testing-library/jest-dom";
import * as matchers from "vitest-axe/matchers";
import { expect } from "vitest";

expect.extend(matchers);

// Mock window.matchMedia if not available
if (typeof window !== "undefined") {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });

  if (typeof HTMLCanvasElement !== "undefined") {
    HTMLCanvasElement.prototype.getContext = () => null;
  }
}
