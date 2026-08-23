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
        emerald: {
          400: "#34D399",
          500: "#10B981",
          900: "#064E3B",
          950: "#022C22",
        },
        zinc: {
          850: "#141417",
          900: "#18181B",
          950: "#09090B",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "'Noto Sans Devanagari'", "sans-serif"],
        display: ["'Inter'", "'Noto Sans Devanagari'", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem", // 40px standard section wrapper radius
      },
      letterSpacing: {
        tighter: "-0.05em",
        widestLabel: "0.2em",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "emerald-glow": "0 0 35px rgba(52, 211, 153, 0.35)",
        "pill-btn": "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
      },
    },
  },
  plugins: [],
};
