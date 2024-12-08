import {nextui} from '@nextui-org/theme';
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/(button|card|divider|image|link|scroll-shadow|skeleton|toggle|ripple|spinner).js"
  ],
  theme: {
    extend: {
      animation: {
        'shake': 'shake 3s linear infinite',
      },
      keyframes: {
        shake: {
          '0%': { transform: 'translate(1px, 1px) rotate(0deg)' },
          '10%': { transform: 'translate(-1px, -2px) rotate(-1deg)' },
          '20%': { transform: 'translate(-3px, 0px) rotate(1deg)' },
          '30%': { transform: 'translate(3px, 2px) rotate(0deg)' },
          '40%': { transform: 'translate(1px, -1px) rotate(1deg)' },
          '50%': { transform: 'translate(-1px, 2px) rotate(-1deg)' },
          '60%': { transform: 'translate(-3px, 1px) rotate(0deg)' },
          '70%': { transform: 'translate(3px, 1px) rotate(-1deg)' },
          '80%': { transform: 'translate(-1px, -1px) rotate(1deg)' },
          '90%': { transform: 'translate(1px, 2px) rotate(0deg)' },
          '100%': { transform: 'translate(1px, -2px) rotate(-1deg)' }
        }
      },
      fontFamily: {
        title: ["Syne", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        light: {
          background: '#F3EFF5', // Fondo principal
          secondary: '#C9C9CE', // Fondo secundario
          text: '#0D0A0B', // Texto principal
          heading: '#4A9B2D', // Títulos/destacados (tono verde ligeramente más claro que el highlight)
          highlight: '#72B01D', // Highlights/acciones
        },
        dark: {
          background: '#0D0A0B', // Fondo principal
          secondary: '#454955', // Fondo secundario
          text: '#F3EFF5', // Texto principal
          heading: '#5F9930', // Títulos/destacados (verde diferente para contraste en modo oscuro)
          highlight: '#72B01D', // Highlights/acciones
        },
      },
    },
  },
  plugins: [nextui()],
  
}

