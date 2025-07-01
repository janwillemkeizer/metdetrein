/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'ns-blue': '#003082',
        'ns-yellow': '#FFC917'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}