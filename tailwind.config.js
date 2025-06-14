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
        'sm': '8px',   // 2x-nested-container (deepest level)
        'md': '32px',  // nested-container (medium nesting)
        'lg': '64px',  // buttons (pill shape)
        'xl': '48px',  // top-level-container (outermost containers)
        
        // Semantic aliases for container hierarchy
        'top-level-container': '48px',      // Level 1: Main cards, primary containers
        'nested-container': '32px',         // Level 2: Containers inside main cards
        '2x-nested-container': '8px',       // Level 3: Items inside nested containers
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};