/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: "#15202B",
          light: "#E0E6F5",
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
