module.exports = {
  darkMode: 'class',
  purge: ['./**/*.tsx', './public/index.html'],
  theme: {
    fontFamily: {
      sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      roboto: ['roboto', 'sans-serif'],
    },
    fontSize: {
      tiny: '0.625rem',
      xs: '.75rem',
      sm: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    spacing: {
      0: '0px',
      1: '5px',
      2: '10px',
      3: '15px',
      4: '20px',
      5: '25px',
      6: '30px',
      7: '35px',
      8: '40px',
      9: '45px',
      80: '80px',
      10: '50px',
      11: '60px',
      24: '24rem',
      100: '100px',
      120: '120px',
      170: '170px',
      200: '200px',
      250: '250px',
      300: '350px',
      400: '400px',
      'toggle-h': 'var(--toggle-height)',
      'toggle-h-2': 'calc(var(--toggle-height) - var(--toggle-border) * 2)',
      'toggle-w': 'var(--toggle-width)',
      'toggle-w-2': 'calc(var(--toggle-width) - calc(var(--toggle-height) - var(--toggle-border) * 2) - calc(var(--toggle-border) * 2))',
    },
    borderWidth: {
      DEFAULT: '1px',
      0: '0px',
      2: '2px',
    },
    boxShadow: {
      accent: 'var(--shadow-accent)',
      1: '0px 4px 14px rgba(0, 0, 0, 0.4)',
      toggle: 'inset 0px 0px 0px 2px var(--color-primary-700)',
    },
    extend: {
      colors: {
        button: 'var(--color-button-text)',
        transparent: 'transparent',
        default: 'red',
        white: 'white',
        primary: {
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          disabled: 'var(--color-accent-disabled)',
        },
      },
      borderRadius: {
        DEFAULT: '50%',
        0: '0px',
        3: '3px',
        5: '5px',
        8: '8px',
        15: '12px',
        25: '25px',
        40: '40px',
      },
      outline: {
        'no-chrome': 'none',
      },
      maxWidth: {
        xxs: '225px',
      },
      screens: { fmd: '860px', flg: '1125px', fxl: '1350px', f2xl: '1720px', '2xl': '1440px' },
    },
  },
  variants: {
    backgroundColor: ({ after }) => after(['disabled']),
    textColor: ({ after }) => after(['disabled']),
    extend: {
      borderWidth: ['last'],
      margin: ['first', 'last'],
    },
  },
  plugins: [require('tailwindcss-important')()],
};
