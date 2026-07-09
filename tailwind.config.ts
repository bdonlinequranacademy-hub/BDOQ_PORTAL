import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#32C991",
          dark: "#269B6F",
          light: "#E8FAF2",
          mint: "#ADEBB3",
        },
        "brand-red": {
          DEFAULT: "#E84B3A",
          light: "#FFDDD6",
          dark: "#C62828",
        },
        teal: {
          DEFAULT: "#0D9488",
          accent: "#2DD4BF",
        },
        /** BOQ gold accent — highlights, nav active, borders */
        gold: {
          DEFAULT: "#D4A853",
          light: "#E8C97A",
          dark: "#B8923F",
        },
        "bg-light": "#E8FAF2",
        "text-dark": "#1A1A2E",
        "text-gray": "#6B7280",
        /** @deprecated use primary-dark — kept for gradual migration */
        navy: {
          DEFAULT: "#269B6F",
          50: "#E8FAF2",
          100: "#E8FAF2",
          500: "#32C991",
          900: "#269B6F",
        },
        cream: {
          DEFAULT: "#FDF6E3",
        },
        surface: {
          DEFAULT: "#FFFFFF",
        },
        success: "#32C991",
        warning: "#D4A853",
        danger: "#D14343",
        info: "#0D9488",
        portal: {
          bg: "var(--portal-bg)",
          surface: "var(--portal-surface)",
          /** Background tint — use bg-portal-surface-muted, NOT text-portal-muted */
          "surface-muted": "var(--portal-surface-muted)",
          heading: "var(--portal-heading)",
          text: "var(--portal-text)",
          border: "var(--portal-border)",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Amiri", "Georgia", "Times New Roman", "serif"],
        arabic: ["Amiri", "Noto Naskh Arabic", "serif"],
        certificate: ["Cinzel", "Times New Roman", "serif"],
        bengali: ["Noto Sans Bengali", "Inter", "sans-serif"],
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
