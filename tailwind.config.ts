import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#edfff6",
          100: "#d3fde7",
          200: "#abf8d2",
          300: "#70f1b5",
          400: "#31df93",
          500: "#10e883", // Signature vibrant green from logo
          600: "#05b865",
          700: "#069052",
          800: "#0b7143",
          900: "#0b5d38",
          950: "#01351e",
        },
        brand: {
          navy: "#1c275d", // Light mode navy from logo
          green: "#17ff91", // Logo neon green
          dark: "#15192e", // Dark mode background from screenshot 2
          ice: "#c0e1ff", // Dark mode light bracket icy blue
        },
        navy: {
          50: "#f3f6fc",
          100: "#e5ecf8",
          200: "#cfddf3",
          300: "#abc6eb",
          400: "#7ea8e0",
          500: "#5c8cd3",
          600: "#4470c1",
          700: "#3759a8",
          800: "#304b89",
          900: "#1c275d", // Logo Navy
          950: "#15192e", // Dark mode midnight navy
        },
        coral: {
          // Aliased to vibrant green to ensure complete brand consistency across legacy classes
          50: "#edfff6",
          100: "#d3fde7",
          200: "#abf8d2",
          300: "#70f1b5",
          400: "#31df93",
          500: "#10e883",
          600: "#05b865",
          700: "#069052",
          800: "#0b7143",
          900: "#0b5d38",
          950: "#01351e",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cream: {
          50: "#ffffff",
          100: "#f8fafd",
          200: "#f1f5fa",
          300: "#e4ecf6",
          400: "#ccd8ea",
        },
        darkbg: {
          DEFAULT: "#15192e",
          card: "#1b213b",
          surface: "#1f2644",
          border: "#283256",
        }
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["var(--font-geist-sans)", "-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Segoe UI", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SF Mono", "monospace"],
      },
      borderRadius: {
        "3xl": "1.75rem",
        "4xl": "2.25rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        ios: "0 4px 20px -2px rgba(28, 39, 93, 0.05), 0 2px 6px -1px rgba(28, 39, 93, 0.03)",
        "ios-lg": "0 12px 36px -4px rgba(28, 39, 93, 0.08), 0 4px 12px -2px rgba(28, 39, 93, 0.04)",
        "coral-glow": "0 8px 24px -4px rgba(23, 255, 145, 0.35)",
        "coral-lg": "0 14px 36px -6px rgba(23, 255, 145, 0.45)",
        "brand-glow": "0 8px 24px -4px rgba(23, 255, 145, 0.35)",
        "brand-lg": "0 14px 36px -6px rgba(23, 255, 145, 0.45)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.96)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
