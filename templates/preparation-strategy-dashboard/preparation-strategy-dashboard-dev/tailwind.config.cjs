/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'theme-blue': '#00acdd',
        'theme-dark-blue': '#0d94c5',
        'theme-green': '#74d813',
        'theme-red': '#db214e',
        'theme-scrollbar': '#f7f7f7',
        'theme-border': '#e0e0e0',
        'theme-light-gray': '#c6c6c6',
        'theme-medium-gray': '#8e8e8e',
        'theme-dark-gray': '#6b6b6b',
        'theme-extra-dark-gray': '#3d3d3d',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      screens: {
        xs: '460px',
        '2md': '920px',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [require('tailwindcss-scrollbar')],
  important: '.preparation-strategy-dashboard-root',
};
