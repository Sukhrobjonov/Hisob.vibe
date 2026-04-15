/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        background: '#ffffff',
        border: '#F2F2F7',
        text: '#000000',
        textMuted: '#8E8E93',
      },
    },
  },
  plugins: [],
}
