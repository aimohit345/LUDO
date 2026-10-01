import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070913",
        foreground: "#f8fafc",
        card: {
          DEFAULT: "rgba(15, 23, 42, 0.65)",
          foreground: "#f8fafc",
        },
        popover: {
          DEFAULT: "#0f172a",
          foreground: "#f8fafc",
        },
        primary: {
          DEFAULT: "#8b5cf6", // Electric Violet
          foreground: "#ffffff",
          glow: "rgba(139, 92, 246, 0.4)",
        },
        secondary: {
          DEFAULT: "#06b6d4", // Electric Cyan
          foreground: "#000000",
        },
        accent: {
          DEFAULT: "#ec4899", // Hot Pink
          foreground: "#ffffff",
        },
        neon: {
          violet: "#a855f7",
          cyan: "#06b6d4",
          pink: "#f43f5e",
          green: "#10b981",
          gold: "#f59e0b",
        },
        surface: {
          50: "#0b0f19",
          100: "#111827",
          200: "#1e293b",
          300: "#334155",
        },
        muted: {
          DEFAULT: "#1e293b",
          foreground: "#94a3b8",
        },
        border: "rgba(255, 255, 255, 0.1)",
        ring: "#8b5cf6",
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        "neon-violet": "0 0 25px -5px rgba(139, 92, 246, 0.5)",
        "neon-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.5)",
        "neon-pink": "0 0 25px -5px rgba(244, 63, 94, 0.5)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 4s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 15px rgba(139, 92, 246, 0.6))" },
          "50%": { opacity: "0.7", filter: "drop-shadow(0 0 5px rgba(139, 92, 246, 0.2))" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
