import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import tailwindConfig from "../../tailwind.config";

describe("Chickie Studio CRM - Design Tokens & Typography (P1)", () => {
  const stylesDir = path.resolve(__dirname);
  const scssTokens = fs.readFileSync(path.join(stylesDir, "_tokens.scss"), "utf-8");
  const shadcnTheme = fs.readFileSync(path.join(stylesDir, "shadcn-theme.css"), "utf-8");
  const indexHtml = fs.readFileSync(path.resolve(__dirname, "../../index.html"), "utf-8");

  describe("Typography Tokens", () => {
    it("configures Lora as the primary serif/heading font in _tokens.scss", () => {
      expect(scssTokens).toContain("--font-serif: 'Lora'");
      expect(scssTokens).toContain("--font-heading: var(--font-serif)");
    });

    it("configures Be Vietnam Pro as the primary sans/body font in _tokens.scss", () => {
      expect(scssTokens).toContain("--font-sans: 'Be Vietnam Pro'");
      expect(scssTokens).toContain("--font-body: var(--font-sans)");
    });

    it("configures unified Lora and Be Vietnam Pro in shadcn-theme.css", () => {
      expect(shadcnTheme).toContain("--font-serif: 'Lora'");
      expect(shadcnTheme).toContain("--font-sans: 'Be Vietnam Pro'");
    });

    it("loads Lora and Be Vietnam Pro with vietnamese subset in index.html", () => {
      expect(indexHtml).toContain("family=Be+Vietnam+Pro");
      expect(indexHtml).toContain("family=Lora");
      expect(indexHtml).toContain("subset=vietnamese");
    });

    it("configures Tailwind fontFamily with lora, be-vietnam and backward compatibility aliases", () => {
      const fonts = tailwindConfig.theme?.extend?.fontFamily as Record<string, string[]>;
      expect(fonts).toBeDefined();
      expect(fonts.serif).toEqual(["'Lora'", "Georgia", "serif"]);
      expect(fonts.sans).toEqual(["'Be Vietnam Pro'", "system-ui", "sans-serif"]);
      expect(fonts.lora).toEqual(["'Lora'", "Georgia", "serif"]);
      expect(fonts["be-vietnam"]).toEqual(["'Be Vietnam Pro'", "system-ui", "sans-serif"]);
      expect(fonts.playfair).toEqual(["'Lora'", "Georgia", "serif"]);
      expect(fonts.inter).toEqual(["'Be Vietnam Pro'", "system-ui", "sans-serif"]);
    });
  });

  describe("RGB Color Tokens with Alpha Channel Support", () => {
    it("defines --color-burgundy-rgb and --color-ink-rgb in _tokens.scss", () => {
      expect(scssTokens).toContain("--color-burgundy-rgb: 100 29 43;");
      expect(scssTokens).toContain("--color-ink-rgb: 48 37 40;");
    });

    it("defines --color-burgundy-rgb and --color-ink-rgb in shadcn-theme.css", () => {
      expect(shadcnTheme).toContain("--color-burgundy-rgb: 100 29 43;");
      expect(shadcnTheme).toContain("--color-ink-rgb: 48 37 40;");
    });

    it("configures Tailwind colors with <alpha-value> support for opacity modifiers", () => {
      const colors = tailwindConfig.theme?.extend?.colors as Record<string, any>;
      expect(colors).toBeDefined();
      expect(colors.burgundy.DEFAULT).toContain("<alpha-value>");
      expect(colors.burgundy.DEFAULT).toContain("--color-burgundy-rgb");
      expect(colors.ink.DEFAULT).toContain("<alpha-value>");
      expect(colors.ink.DEFAULT).toContain("--color-ink-rgb");
    });
  });

  describe("Semantic Status Feedback Tokens (P2)", () => {
    it("standardizes danger and destructive tokens in Tailwind configuration", () => {
      const colors = tailwindConfig.theme?.extend?.colors as Record<string, any>;
      expect(colors.danger).toBeDefined();
      expect(colors.danger.DEFAULT).toBe("var(--color-danger, #D9383A)");
      expect(colors.danger.foreground).toBe("#FFFFFF");

      expect(colors.destructive).toBeDefined();
      expect(colors.destructive.DEFAULT).toBe("var(--color-danger, #D9383A)");
      expect(colors.destructive.foreground).toBe("#FFFFFF");
    });

    it("verifies --color-danger and --color-destructive presence in scss tokens", () => {
      expect(scssTokens).toContain("--color-danger: #D9383A;");
      expect(shadcnTheme).toContain("--color-danger: #D9383A;");
      expect(shadcnTheme).toContain("--color-destructive: #D9383A;");
    });
  });
});
