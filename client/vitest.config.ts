import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    testTimeout: 15000,
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
      exclude: [
        "e2e/**",
        "playwright.config.ts",
        "node_modules/**",
        ".next/**",
        "**/*.d.ts",
        "**/index.ts",
        "**/dev/**",
        "src/app/**",
        "vitest.config.ts",
        "vitest.setup.ts",
        "tailwind.config.ts",
        "postcss.config.mjs",
        "next.config.mjs",
        "src/lib/fonts.ts",
        "src/components/ui/primitives/**",
        "src/types/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
