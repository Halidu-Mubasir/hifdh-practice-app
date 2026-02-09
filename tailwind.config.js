module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#13ec92', // Emerald
        'primary-dark': '#10b981', // Darker Emerald for some UI elements
        gold: '#d4af37',
        'background-light': '#f8fafc',
        'background-dark': '#0a1a14', // Deep Islamic Green from Active Test design
        'card-dark': '#1c2722',
        'card-test-dark': '#122b21', // Specific card bg from active test HTML
        'surface-dark': '#283932',
      },
      fontFamily: {
        display: ['Lexend', 'sans-serif'],
        arabic: ['NotoNaskhArabic'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
