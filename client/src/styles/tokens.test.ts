import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import tailwindConfig from "../../tailwind.config";

describe("Chickie Studio Client - Design Tokens & Button Standardization (P2)", () => {
  const stylesDir = path.resolve(__dirname);
  const scssTokens = fs.readFileSync(path.join(stylesDir, "_tokens.scss"), "utf-8");
  const shadcnTheme = fs.readFileSync(path.join(stylesDir, "shadcn-theme.css"), "utf-8");

  describe("Typography & Semantic Font Aliases", () => {
    it("defines --font-serif, --font-sans, --font-heading, and --font-body in _tokens.scss", () => {
      expect(scssTokens).toContain("--font-serif: var(--font-lora)");
      expect(scssTokens).toContain("--font-sans: var(--font-vietnam)");
      expect(scssTokens).toContain("--font-heading: var(--font-serif);");
      expect(scssTokens).toContain("--font-body: var(--font-sans);");
    });

    it("defines --font-serif, --font-sans, --font-heading, and --font-body in shadcn-theme.css", () => {
      expect(shadcnTheme).toContain("--font-serif: var(--font-lora)");
      expect(shadcnTheme).toContain("--font-sans: var(--font-vietnam)");
      expect(shadcnTheme).toContain("--font-heading: var(--font-serif);");
      expect(shadcnTheme).toContain("--font-body: var(--font-sans);");
    });

    it("configures Tailwind fontFamily with lora, be-vietnam, playfair, and inter aliases", () => {
      const fonts = tailwindConfig.theme?.extend?.fontFamily as Record<string, any>;
      expect(fonts).toBeDefined();
      expect(fonts.lora).toEqual(["var(--font-serif)"]);
      expect(fonts["be-vietnam"]).toEqual(["var(--font-sans)"]);
      expect(fonts.playfair).toEqual(["var(--font-serif)"]);
      expect(fonts.inter).toEqual(["var(--font-sans)"]);
    });
  });

  describe("Status Feedback Tokens (P2: danger vs destructive)", () => {
    it("configures danger and destructive tokens symmetrically in Tailwind", () => {
      const colors = tailwindConfig.theme?.extend?.colors as Record<string, any>;
      expect(colors.danger).toBeDefined();
      expect(colors.danger.DEFAULT).toBe("var(--color-danger, #D9383A)");
      expect(colors.danger.foreground).toBe("#FFFFFF");

      expect(colors.destructive).toBeDefined();
      expect(colors.destructive.DEFAULT).toBe("var(--color-danger, #D9383A)");
      expect(colors.destructive.foreground).toBe("#FFFFFF");
    });

    it("defines status colors in scss tokens and theme css", () => {
      expect(scssTokens).toContain("--color-danger: #D9383A;");
      expect(shadcnTheme).toContain("--color-danger: #D9383A;");
      expect(shadcnTheme).toContain("--destructive: 359 68% 54%;");
    });
  });

  describe("RGB Color Tokens with Alpha Channel Support", () => {
    it("configures burgundy and ink with <alpha-value> in Tailwind", () => {
      const colors = tailwindConfig.theme?.extend?.colors as Record<string, any>;
      expect(colors.burgundy.DEFAULT).toContain("<alpha-value>");
      expect(colors.burgundy.DEFAULT).toContain("--color-burgundy-rgb");
      expect(colors.ink.DEFAULT).toContain("<alpha-value>");
      expect(colors.ink.DEFAULT).toContain("--color-ink-rgb");
    });
  });
});
