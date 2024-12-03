/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        orangeBlur: '1px 4px 46.1px 0 rgba(255, 151, 65, 0.5)', // Custom shadow with your parameters
        greenBlur:'0px 0px 35px 0  rgba(60, 200, 161, 0.5)'
      },
    },
  },
  plugins: [],
};
