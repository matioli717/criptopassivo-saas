/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#080b0f",
        bg2: "#0d1117",
        card: "#0e1520",
        border: "#1e2a38",
        ink: "#e8edf2",
        muted: "#6b7a8d",
        accent: "#00ff88",
        accent2: "#00c4ff",
        gold: "#c9a24a",
      },
      fontFamily: {
        display: ["Syne", "system-ui", "sans-serif"],
        mono: ["'Space Mono'", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
