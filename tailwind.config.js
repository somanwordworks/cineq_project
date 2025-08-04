﻿/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{js,ts,jsx,tsx}", // If styles include JSX-based components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
