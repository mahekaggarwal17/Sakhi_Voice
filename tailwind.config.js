/** @type {import('tailwindcss').Config} */
module.exports = {
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
        terracotta: {
          50: "#FCF5F0",
          100: "#F8E7DC",
          200: "#F2CEB9",
          300: "#E8A888",
          400: "#DB7B53",
          500: "#C85228", // Primary Deep Warm Terracotta
          600: "#B03E19",
          700: "#8F2C0E",
          800: "#6F200A",
          900: "#501506",
          DEFAULT: "#C85228",
        },
        marigold: {
          50: "#FEF9EC",
          100: "#FCF0CF",
          200: "#F8E09D",
          300: "#F4CC66",
          400: "#EEB333",
          500: "#E8891D", // Saffron / Marigold Active
          600: "#CB6C12",
          700: "#A44F0C",
          800: "#803B0B",
          900: "#612B09",
          DEFAULT: "#E8891D",
        },
        indigoCraft: {
          50: "#F0F4F8",
          100: "#D9E3ED",
          200: "#B3C7DB",
          500: "#2B4764",
          700: "#1B2F45",
          800: "#142232",
          900: "#0D1722",
          DEFAULT: "#1B2F45",
        },
        parchment: {
          50: "#FFFDF9",
          100: "#FAF6F0",
          200: "#F3ECE1",
          300: "#EBE0D0",
          400: "#DECBB5",
          500: "#CFB499",
          DEFAULT: "#FAF6F0",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "'Noto Sans Devanagari'", "sans-serif"],
        display: ["'Outfit'", "'Noto Sans Devanagari'", "sans-serif"],
        serif: ["'Rozha One'", "serif"],
      },
      boxShadow: {
        tactile: "0 4px 0 0 rgba(70, 35, 15, 0.18), 0 8px 20px -2px rgba(120, 50, 20, 0.12)",
        "tactile-hover": "0 6px 0 0 rgba(70, 35, 15, 0.18), 0 12px 28px -2px rgba(120, 50, 20, 0.18)",
        "tactile-active": "0 1px 0 0 rgba(70, 35, 15, 0.18), 0 2px 8px rgba(120, 50, 20, 0.1)",
        card: "0 4px 18px -2px rgba(60, 40, 20, 0.06), 0 1px 3px rgba(60, 40, 20, 0.04)",
      },
    },
  },
  plugins: [],
};
