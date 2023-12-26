/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['"Fira Sans"', "sans-serif"],
      serif: ["Fira Sans"],
      display: ["Fira Sans"],
      body: ["Fira Sans"],
    },
  },
  plugins: [],
};
