const {nextui} = require('@nextui-org/theme');
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/components/toggle.js"
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: '#F9D07F', // Fondo principal
          secondary: '#97B8AF', // Fondo secundario
          text: '#2E292A', // Texto principal
          heading: '#AE184A', // Títulos/destacados
          highlight: '#E52D1F', // Highlights/acciones
        },
        dark: {
          background: '#2E292A', // Fondo principal
          secondary: '#1C1A1B', // Fondo secundario
          text: '#F9D07F', // Texto principal
          heading: '#E52D1F', // Títulos/destacados
          highlight: '#AE184A', // Highlights/acciones
        },
      },
    },
  },
  plugins: [nextui()],
  
}

