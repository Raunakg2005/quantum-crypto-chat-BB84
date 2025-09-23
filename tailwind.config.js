/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // removed './pages' because this project uses the app/ router
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

