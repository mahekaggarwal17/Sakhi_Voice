import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        terracotta: {
          DEFAULT: "#D35400",
          50: "#FDF4E7",
          100: "#FCE7CF",
          200: "#FACD9E",
          300: "#F7B06C",
          400: "#F5953C",
          500: "#D35400",
          600: "#BD4A00",
          700: "#9A3C00",
          800: "#782E00",
          900: "#572100",
        },
        sage: {
          50: "#f4f7f4",
          100: "#e5ece5",
          500: "#5b8c5a",
          600: "#446e43",
          700: "#325231",
          800: "#223822",
          900: "#162516",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ripple": "ripple 2s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        ripple: {
          "0%": { transform: "scale(0.95)", opacity: "0.8" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        glow: {
          "0%": { boxShadow: "0 0 15px rgba(234, 88, 12, 0.4)" },
          "100%": { boxShadow: "0 0 35px rgba(234, 88, 12, 0.85)" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
