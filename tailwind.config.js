/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.{html,js,ejs}", // scan your views folder
    "./*.{html,js,ejs}",                     // root html if any exist
    "./views/*.{html,js,ejs}",
    "./views/**/*.{html,js,ejs}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
