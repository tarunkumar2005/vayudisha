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
        // Official CPCB AQI Palette
        aqi: {
          good: '#00B050',
          satisfactory: '#92D050',
          moderate: '#FFD700',
          poor: '#FF8C00',
          veryPoor: '#FF0000',
          severe: '#8B0000',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
