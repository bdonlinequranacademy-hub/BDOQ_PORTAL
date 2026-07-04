import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B6B44",
          dark: "#0D4A2F",
          light: "#E8F5EE",
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
        /** Accent / links — aligned with public-site --brand-red */
        gold: {
          DEFAULT: "#E84B3A",
          light: "#FFDDD6",
          dark: "#C62828",
        },
        "bg-light": "#F0FBF6",
        "text-dark": "#1A1A2E",
        "text-gray": "#6B7280",
        /** @deprecated use primary-dark — kept for gradual migration */
        navy: {
          DEFAULT: "#0D4A2F",
          50: "#F0FBF6",
          100: "#E8F5EE",
          500: "#1B6B44",
          900: "#0D4A2F",
        },
        cream: {
          DEFAULT: "#FDF6E3",
        },
        surface: {
          DEFAULT: "#FFFFFF",
        },
        success: "#1B6B44",
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
        display: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        arabic: ["Amiri", "serif"],
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
