import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "brand-red": "#bc0c11",
        "brand-red-dark": "#990a0e",
        "brand-red-light": "#e7000b",
        "brand-dark": "#101828",
        "brand-charcoal": "#364153",
        "brand-gray": "#4a5565",
        "brand-muted": "#787878",
        "brand-subtle": "#515151",
        "brand-bg": "#f3f4f6",
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        "8xl": "1280px",
      },
      spacing: {
        "30": "7.5rem",
      },
      boxShadow: {
        header: "0px 20px 25px -5px rgba(0,0,0,0.1), 0px 10px 10px -5px rgba(0,0,0,0.04)",
        "card-cta": "5px 5px 14px rgba(188, 12, 17, 0.35), -5px -5px 12px rgba(255, 255, 255, 0.9), inset 1px 1px 1px rgba(255, 255, 255, 0.25)",
        stats: "0px 3px 1px rgba(0,0,0,0.09)",
        "neu-flat": "6px 6px 14px rgba(166, 175, 195, 0.45), -6px -6px 14px rgba(255, 255, 255, 0.95)",
        "neu-hover": "8px 8px 18px rgba(166, 175, 195, 0.55), -8px -8px 18px rgba(255, 255, 255, 1)",
        "neu-pressed": "inset 3px 3px 6px rgba(166, 175, 195, 0.45), inset -3px -3px 6px rgba(255, 255, 255, 0.95)",
        "neu-red": "5px 5px 14px rgba(188, 12, 17, 0.35), -5px -5px 12px rgba(255, 255, 255, 0.9), inset 1px 1px 1px rgba(255, 255, 255, 0.25)",
        "neu-red-hover": "7px 7px 18px rgba(188, 12, 17, 0.45), -6px -6px 14px rgba(255, 255, 255, 1)",
        "neu-red-pressed": "inset 3px 3px 7px rgba(70, 4, 7, 0.6), inset -2px -2px 5px rgba(255, 255, 255, 0.25)",
        "neu-inset": "inset 4px 4px 8px rgba(166, 175, 195, 0.4), inset -4px -4px 8px rgba(255, 255, 255, 0.9)",
      },
    },
  },
  plugins: [],
};

export default config;
