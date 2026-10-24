import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
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
        "dist/**",
        "**/*.d.ts",
        "**/index.ts",
        "**/dev/**",
        "**/DevComponentsPage.tsx",
        "src/main.tsx",
        "src/App.tsx",
        "src/pages/**",
        "src/components/ui/primitives/**",
        "vite.config.ts",
        "vitest.config.ts",
        "vitest.setup.ts",
        "postcss.config.js",
        "tailwind.config.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@chickie/ui": fileURLToPath(new URL("./src/components/ui", import.meta.url)),
    },
  },
});
