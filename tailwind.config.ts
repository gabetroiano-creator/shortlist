import type { Config } from "tailwindcss";

// Palette + type from DESIGN.md (calm editorial). Tier colors are the only
// saturated colors in the system, by design.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAF8F3",
        surface: "#FFFDFA",
        hairline: "#E7E2D8",
        ink: { DEFAULT: "#211E1A", muted: "#5C574E", faint: "#908A7E" },
        accent: { DEFAULT: "#2B3A67", hover: "#3A4C82", tint: "#ECEFF6" },
        reach: { fill: "#FAECE7", text: "#712B13", dot: "#F0997B" },
        target: { fill: "#FAEEDA", text: "#633806", dot: "#EF9F27" },
        likely: { fill: "#E6F1FB", text: "#0C447C", dot: "#85B7EB" },
        safety: { fill: "#E1F5EE", text: "#085041", dot: "#5DCAA5" },
        verdict: "#993C1D",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
      },
      borderRadius: { sm: "4px", md: "6px", lg: "10px" },
      maxWidth: { app: "1080px", reading: "720px" },
    },
  },
  plugins: [],
};

export default config;
