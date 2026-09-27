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
        "card-cta": "0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1), inset 0px -4px 2px 0px rgba(0,0,0,0.25)",
        stats: "0px 3px 1px rgba(0,0,0,0.09)",
      },
    },
  },
  plugins: [],
};

export default config;
