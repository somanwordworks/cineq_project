/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css,scss}', // <-- IMPORTANT: include styles folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
