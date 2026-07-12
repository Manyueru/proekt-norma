import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "rgb(var(--bg) / <alpha-value>)",
          dark: "rgb(var(--bg) / <alpha-value>)"
        },
        ink: {
          DEFAULT: "rgb(var(--fg) / <alpha-value>)",
          dark: "rgb(var(--fg) / <alpha-value>)"
        },
        accent: {
          blue: "rgb(var(--accent) / <alpha-value>)",
          sage: "#748B78",
          violet: "rgb(var(--accent) / <alpha-value>)"
        },
        border: {
          DEFAULT: "rgb(var(--border-c) / <alpha-value>)",
          dark: "rgb(var(--border-c) / <alpha-value>)"
        }
      },
      fontFamily: {
        sans: ["Instrument Sans", "Manrope", "Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "Instrument Sans", "Inter", "system-ui", "sans-serif"]
      },
      borderRadius: {
        card: "16px"
      },
      boxShadow: {
        quiet: "0 16px 50px -42px rgba(28, 30, 35, 0.32)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
