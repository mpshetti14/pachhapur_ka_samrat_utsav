/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        kumkum: '#991b1b', saffron: '#e85d04', marigold: '#f6aa1c',
        cream: '#fff8e8', cocoa: '#2d160b', leaf: '#35643f',
      },
      fontFamily: { display: ['Yatra One', 'serif'], body: ['DM Sans', 'sans-serif'] },
      boxShadow: { ceremonial: '0 18px 50px -22px rgba(82, 28, 8, .45)' },
    },
  },
  plugins: [],
};