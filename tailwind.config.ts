import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#03214F",
          50: "#E8EDF5",
          100: "#C5D0E6",
          500: "#1A4A8A",
          900: "#03214F",
        },
        gold: {
          DEFAULT: "#C4922B",
          light: "#D9A94A",
          dark: "#A57820",
        },
        cream: {
          DEFAULT: "#F8F9FF",
        },
        surface: {
          DEFAULT: "#FCFBFA",
        },
        success: "#1F9D63",
        warning: "#C4922B",
        danger: "#D14343",
        info: "#1A4A8A",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        brand: ["Allura", "cursive"],
        arabic: ["Amiri", "serif"],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
} satisfies Config;
