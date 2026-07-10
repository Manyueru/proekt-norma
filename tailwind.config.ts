import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FAF8F3",
          dark: "#171613"
        },
        ink: {
          DEFAULT: "#2E2C28",
          dark: "#EDEAE2"
        },
        accent: {
          blue: "#5B7FA6",
          sage: "#7A9186",
          violet: "#9A87B8"
        },
        border: {
          DEFAULT: "#E4E0D6",
          dark: "#33312B"
        }
      },
      fontFamily: {
        sans: ["Inter", "Manrope", "system-ui", "sans-serif"]
      },
      borderRadius: {
        card: "12px"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
