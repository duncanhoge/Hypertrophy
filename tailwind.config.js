/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Archivo', 'sans-serif'],
      },
      colors: {
        theme: {
          black: {
            DEFAULT: '#000000',
            light: '#121212',
            lighter: '#1A1A1A'
          },
          white: {
            DEFAULT: '#FFFFFF',
            muted: 'rgba(255, 255, 255, 0.7)'
          },
          gold: {
            DEFAULT: '#FFD700',
            light: '#FFE55C',
            dark: '#B7A000'
          }
        }
      },
      borderRadius: {
        'sm': '8px',   // Small elements
        'md': '32px',  // Nested containers
        'lg': '64px'   // Buttons (pill shape)
      }
    },
  },
  plugins: [],
};