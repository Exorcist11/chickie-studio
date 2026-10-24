import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
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
        "node_modules/**",
        "dist/**",
        "**/*.d.ts",
        "**/index.ts",
        "**/dev/**",
        "**/DevComponentsPage.tsx",
        "src/main.tsx",
        "src/App.tsx",
        "src/pages/**",
        "src/components/ui/**",
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
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
