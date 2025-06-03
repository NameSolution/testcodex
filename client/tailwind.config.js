export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      },
      screens: {
        '2xsm': '375px',
        xsm: '425px',
        '3xl': '2000px',
      },
    },
  },
  plugins: [],
};
