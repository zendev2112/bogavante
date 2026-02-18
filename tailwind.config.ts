import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#2B2E78',
        'lobster-red': '#E23C4B',
        teal: '#00B3A4',
        sky: '#4DA8DA',
        'app-bg': '#F8F9FB',
        'card-bg': '#FFFFFF',
        border: '#E5E7EB',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
