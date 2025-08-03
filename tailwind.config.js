﻿/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css}" // ✅ THIS LINE IS CRUCIAL
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
