/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6B1F7B',
          50: '#F3E8F5',
          100: '#E7D1EB',
          200: '#CFA3D7',
          300: '#B775C3',
          400: '#9F47AF',
          500: '#6B1F7B',
          600: '#561965',
          700: '#41134E',
          800: '#2C0D34',
          900: '#17061A',
        },
        secondary: {
          DEFAULT: '#1E1B4B',
          50: '#F0F0F9',
          100: '#E1E1F3',
          200: '#C3C3E7',
          300: '#A5A5DB',
          400: '#8787CF',
          500: '#1E1B4B',
          600: '#18163C',
          700: '#12102D',
          800: '#0C0B1E',
          900: '#06050F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}