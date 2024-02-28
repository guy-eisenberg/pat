/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        sans: ['Open Sans', 'sans-serif'],
      },
      boxShadow: {
        'menu-box': 'rgba(50, 50, 50, 0.15) 0px 0px 6px 1px',
      },
      screens: {
        '3xl': '1780px',
        '2lg': '1180px',
        '2md': '850px',
      },
      fontSize: {
        '3xs': '0.5rem',
        '2xs': '0.625rem',
      },
      colors: {
        'theme-blue': '#00acdd',
        'theme-dark-blue': '#0d94c5',
        'theme-green': '#74d813',
        'theme-yellow': '#f4da21',
        'theme-red': '#db214e',
        'theme-scrollbar': '#f7f7f7',
        'theme-border': '#e0e0e0',
        'theme-light-gray': '#c6c6c6',
        'theme-medium-gray': '#8e8e8e',
        'theme-dark-gray': '#6b6b6b',
        'theme-extra-dark-gray': '#3d3d3d',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [require('tailwind-scrollbar')],
  important: '.performance-element',
};
