/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class", // This enables class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: "#3D8BFF",
        secondary: "#2B2F77",
        dark: {
          bg: "#111827",
          card: "#1F2937",
        },
      },
    },
  },
  plugins: [],
};
