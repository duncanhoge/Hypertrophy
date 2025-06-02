/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        theme: {
          black: {
            DEFAULT: '#121212',
            light: '#1E1E1E',
            lighter: '#2D2D2D'
          },
          gold: {
            DEFAULT: '#FFD700',
            light: '#FFE55C',
            dark: '#B7A000'
          }
        }
      }
    },
  },
  plugins: [],
};