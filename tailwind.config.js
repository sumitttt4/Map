/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'espresso-orange': '#E58A3C',
        'espresso-dark': '#333333',
        'espresso-brown': '#5F4339',
        'espresso-light': '#F8F6F4',
        'espresso-gray': '#F5F5F5',
        'espresso-red': '#D04A2F',
        'espresso-dark-brown': '#4A3429',
        'espresso-accent': '#FFD700',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}