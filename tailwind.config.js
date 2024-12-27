/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'bounce-slow': 'bounce 1.5s infinite',
        'pulse-slow': 'pulse 2s infinite',
      },
    },
  },
  plugins: [],
}