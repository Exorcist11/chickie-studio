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
          DEFAULT: "rgb(var(--color-burgundy-rgb, 100 29 43) / <alpha-value>)",
          light: "var(--color-burgundy-light)",
          dark: "var(--color-burgundy-dark)",
          50: "#FDF8F8",
          100: "#F8ECEE",
          200: "#F0D5D9",
          300: "#E3B3BB",
        },
        gold: "var(--color-gold)",
        rose: "var(--color-rose)",
        ivory: "var(--color-ivory)",
        "warm-white": "var(--color-warm-white)",
        ink: {
          DEFAULT: "rgb(var(--color-ink-rgb, 48 37 40) / <alpha-value>)",
          muted: "var(--color-ink-muted)",
        },
        line: "var(--color-line)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: {
          DEFAULT: "var(--color-danger, #D9383A)",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "var(--color-danger, #D9383A)",
          foreground: "#FFFFFF",
        },
        info: "var(--color-info)",
      },
      fontFamily: {
        serif: ["'Lora'", "Georgia", "serif"],
        sans: ["'Be Vietnam Pro'", "system-ui", "sans-serif"],
        lora: ["'Lora'", "Georgia", "serif"],
        "be-vietnam": ["'Be Vietnam Pro'", "system-ui", "sans-serif"],
        playfair: ["'Lora'", "Georgia", "serif"],
        inter: ["'Be Vietnam Pro'", "system-ui", "sans-serif"],
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
