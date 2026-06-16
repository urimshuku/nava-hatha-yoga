import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sanity/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        cream: "#FAF6EE",
        ivory: "#FDFBF6",
        sand: "#E9DFCE",
        // Text
        charcoal: "#211C16",
        brown: "#6B5D4C",
        // Accents
        saffron: {
          DEFAULT: "#C45A1B",
          hover: "#A8480F",
          soft: "#E8A06B",
        },
        clay: "#C9A86A",
        gold: "#B08D57",
        // Lines
        border: "#E6DCCB",
        "border-strong": "#D8CCB6",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Cormorant Garamond", "serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Fluid display sizes for a spacious, premium feel
        display: ["clamp(2.75rem, 6vw, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "display-sm": ["clamp(2.25rem, 4.5vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.005em" }],
      },
      letterSpacing: {
        widest: "0.25em",
      },
      borderRadius: {
        sm: "0.5rem",
        DEFAULT: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        full: "9999px",
      },
      maxWidth: {
        container: "76rem",
        prose: "42rem",
      },
      spacing: {
        section: "clamp(4rem, 9vw, 8rem)",
        "section-sm": "clamp(3rem, 6vw, 5rem)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(33, 28, 22, 0.04), 0 8px 24px rgba(33, 28, 22, 0.05)",
        card: "0 1px 2px rgba(33, 28, 22, 0.03), 0 12px 32px rgba(33, 28, 22, 0.06)",
      },
      transitionTimingFunction: {
        calm: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      typography: () => ({
        nava: {
          css: {
            "--tw-prose-body": "#3a322a",
            "--tw-prose-headings": "#211C16",
            "--tw-prose-links": "#C45A1B",
            "--tw-prose-bold": "#211C16",
            "--tw-prose-quotes": "#6B5D4C",
            "--tw-prose-quote-borders": "#C9A86A",
            "--tw-prose-bullets": "#C9A86A",
            "--tw-prose-counters": "#6B5D4C",
            "--tw-prose-hr": "#E6DCCB",
            maxWidth: "42rem",
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
