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
        "card-cta": "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
        stats: "0px 3px 1px rgba(0,0,0,0.09)",
        "neu-flat": "0 2px 6px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
        "neu-hover": "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
        "neu-pressed": "0 1px 2px rgba(0, 0, 0, 0.06)",
        "neu-red": "0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        "neu-red-hover": "0 4px 12px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(188, 12, 17, 0.15)",
        "neu-red-pressed": "0 2px 6px rgba(188, 12, 17, 0.3)",
        "neu-inset": "inset 0 1px 3px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
