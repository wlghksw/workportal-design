/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#4f46e5',
        accent: '#10b981',
        background: '#f8fafc',
        'text-main': '#1e293b',
        'text-sub': '#64748b',
        border: '#e2e8f0',
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 40px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
