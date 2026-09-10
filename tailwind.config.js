/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Ocean / seafood inspired, commercial and trustworthy
        brand: {
          50: '#eef7f9',
          100: '#d3ebf0',
          200: '#a7d6e1',
          300: '#72bacd',
          400: '#4098b3',
          500: '#2b7d99',
          600: '#236580',
          700: '#1f5268',
          800: '#1d4457',
          900: '#1b3a4b',
          950: '#0f2733',
        },
        // Alias of brand — kept so existing `sea-*` classes resolve to the ocean palette
        sea: {
          50: '#eef7f9',
          100: '#d3ebf0',
          200: '#a7d6e1',
          300: '#72bacd',
          400: '#4098b3',
          500: '#2b7d99',
          600: '#236580',
          700: '#1f5268',
          800: '#1d4457',
          900: '#1b3a4b',
          950: '#0f2733',
        },
        ink: {
          50: '#f6f7f8',
          100: '#eceef1',
          200: '#d5dae0',
          300: '#b0bac5',
          400: '#8593a3',
          500: '#667689',
          600: '#525f71',
          700: '#434e5c',
          800: '#3a434e',
          900: '#343b44',
          950: '#22272d',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(16 39 51 / 0.04), 0 1px 3px 0 rgb(16 39 51 / 0.08)',
        panel: '0 4px 12px -2px rgb(16 39 51 / 0.10), 0 2px 6px -2px rgb(16 39 51 / 0.06)',
      },
    },
  },
  plugins: [],
};
