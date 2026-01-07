import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: colors.gray[200],
        input: colors.gray[200],
        ring: colors.blue[500],
        background: colors.white,
        foreground: colors.slate[950],
        primary: {
          DEFAULT: colors.slate[900],
          foreground: colors.slate[50],
        },
        secondary: {
          DEFAULT: colors.slate[100],
          foreground: colors.slate[900],
        },
        destructive: {
          DEFAULT: colors.red[500],
          foreground: colors.slate[50],
        },
        muted: {
          DEFAULT: colors.slate[100],
          foreground: colors.slate[500],
        },
        accent: {
          DEFAULT: colors.slate[100],
          foreground: colors.slate[900],
        },
        popover: {
          DEFAULT: colors.white,
          foreground: colors.slate[950],
        },
        card: {
          DEFAULT: colors.white,
          foreground: colors.slate[950],
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}
