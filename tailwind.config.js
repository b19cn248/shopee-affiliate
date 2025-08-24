/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff0f0',
          100: '#ffdede',
          200: '#ffc2c2',
          300: '#ff9898',
          400: '#ff5c5c',
          500: '#ff2929',
          600: '#ee0a0a',
          700: '#c70606',
          800: '#a30909',
          900: '#871010',
          950: '#4a0303',
        },
        shopee: '#ee4d2d',
        lazada: '#0f146d',
        tiktok: '#ff0050',
        tiki: '#1a94ff',
      }
    },
  },
  plugins: [],
}