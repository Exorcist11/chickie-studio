import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
        danger: "var(--color-danger)",
        info: "var(--color-info)",
      },
      fontFamily: {
        serif: ["var(--font-serif)"],
        sans: ["var(--font-sans)"],
        lora: ["var(--font-serif)"],
        "be-vietnam": ["var(--font-sans)"],
        playfair: ["var(--font-serif)"],
        inter: ["var(--font-sans)"],
      },
      borderRadius: {
        tag: "var(--radius-tag)",
        btn: "var(--radius-btn)",
        card: "var(--radius-card)",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        raised: "var(--shadow-raised)",
      },
      maxWidth: {
        container: "1200px",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
