/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        themeBlue: '#00acdd',
        themeDarkBlue: '#0d94c5',
        themeRed: '#e50b05',
        themeGreen: '#85db21',
        themeLightGray: '#d7d7d7',
        themeDarkGray: '#6b6b6b',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
  important: '.activities-admin-menu-root',
};
