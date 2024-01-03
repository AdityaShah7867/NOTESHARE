/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {

        purple: {
          DEFAULT: '#8a2be2',
        },
        black: {
          DEFAULT: '#000000',
        },
      },
    },
  },


}
