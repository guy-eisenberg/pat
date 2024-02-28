const colors = require('tailwindcss/colors');

deleteDeprecatedColors(colors);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      ...colors,
      themeBlue: '#00acdd',
      themeDarkBlue: '#0d94c5',
      themeRed: '#e50b05',
      themeGreen: '#85db21',
      themeLightGray: '#d7d7d7',
      themeDarkGray: '#6b6b6b',
    },
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
  important: '.exams-admin-menu-root',
};

function deleteDeprecatedColors(colors) {
  ['lightBlue', 'warmGray', 'trueGray', 'coolGray', 'blueGray'].forEach(
    function deleteColor(color) {
      delete colors[color];
    }
  );
}
