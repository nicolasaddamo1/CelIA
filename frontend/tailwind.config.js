/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        primaryDark: '#1a1a3d', // Azul oscuro violáceo
        primaryGradientStart: '#2e026d',
        primaryGradientMid: '#3b0b8c',
        primaryGradientEnd: '#1a1a3d',
      },
    },
  },
  plugins: [],
}

