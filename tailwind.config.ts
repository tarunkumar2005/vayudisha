import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // VayuDisha Brand Palette (Inspired by environmental intelligence / warm natural tones)
        brand: {
          forest: '#174B36',
          teal: '#159C89',
          sage: '#A7C5A0',
          saffron: '#EBA347',
          cream: '#F6F4EB',
          sand: '#ECE7D8',
          border: '#E2DDD1',
          muted: '#587668',
          dark: '#0E291D',
        },
        // Official CPCB AQI Palette (Exact regulatory brackets)
        aqi: {
          good: '#00B050',
          satisfactory: '#92D050',
          moderate: '#FFD700',
          poor: '#FF8C00',
          veryPoor: '#FF0000',
          severe: '#8B0000',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        devanagari: [
          '"Noto Sans Devanagari"',
          '"Kohinoor Devanagari"',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
