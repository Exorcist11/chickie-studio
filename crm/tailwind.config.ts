import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          DEFAULT: "var(--color-burgundy)",
          light: "var(--color-burgundy-light)",
          dark: "var(--color-burgundy-dark)",
        },
        gold: "var(--color-gold)",
        rose: "var(--color-rose)",
        ivory: "var(--color-ivory)",
        "warm-white": "var(--color-warm-white)",
        ink: {
          DEFAULT: "var(--color-ink)",
          muted: "var(--color-ink-muted)",
        },
        line: "var(--color-line)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: {
          DEFAULT: "#D9383A",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#D9383A",
          foreground: "#FFFFFF",
        },
        info: "var(--color-info)",
      },
      fontFamily: {
        playfair: ["'Playfair Display'", "Georgia", "serif"],
        inter: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        tag: "var(--radius-tag)",
        btn: "var(--radius-btn)",
        card: "var(--radius-card)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "var(--shadow-card)",
        raised: "var(--shadow-raised)",
      },
    },
  },
  plugins: [],
};

export default config;
