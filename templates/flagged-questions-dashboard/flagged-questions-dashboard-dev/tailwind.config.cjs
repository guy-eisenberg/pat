/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'theme-blue': '#00acdd',
        'theme-dark-blue': '#1b8ac0',
        'theme-green': '#74d813',
        'theme-light-gray': '#c6c6c6',
        'theme-medium-gray': '#8e8e8e',
        'theme-dark-gray': '#6b6b6b',
        'theme-extra-dark-gray': '#3d3d3d',
      },
      screens: {
        xs: '390px',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
  important: '.flagged-questions-dashboard-root',
};
