const colors = require('tailwindcss/colors');

deleteDeprecatedColors(colors);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      ...colors,
      'theme-blue': '#00acdd',
      'theme-dark-blue': '#0d94c5',
      'theme-red': '#e50b05',
      'theme-green': '#74d813',
      'theme-light-gray': '#c6c6c6',
      'theme-medium-gray': '#8e8e8e',
      'theme-dark-gray': '#6b6b6b',
      'theme-extra-dark-gray': '#3d3d3d',
    },
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
  important: '.assessors-admin-menu-root',
};

function deleteDeprecatedColors(colors) {
  ['lightBlue', 'warmGray', 'trueGray', 'coolGray', 'blueGray'].forEach(
    function deleteColor(color) {
      delete colors[color];
    }
  );
}
