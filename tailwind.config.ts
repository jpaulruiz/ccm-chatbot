import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#2d9d6f',
          dark: '#1f7a55',
        },
        blue: {
          brand: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
};

export default config;
