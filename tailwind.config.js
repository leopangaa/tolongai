/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emergency: "#b00020",
        danger: "#ff3b30",
        darkbg: "#111111",
        card: "#1c1c1c",
      },
    },
  },
  plugins: [],
};