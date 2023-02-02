const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        'gray-750': '#414B5C',
        'gray-850': '#212935',
        'gray-950': '#11151C',
        primary: colors.teal,
        secondary: colors.purple,
        tertiary: colors.green,
      },
      spacing: {
        '72p': '72px',
        128: '32rem',
        192: '48rem',
        256: '64rem',
      },
      inset: theme => ({
        'full': '100%',
        ...theme('spacing'),
      }),
      maxWidth: theme => ({
        ...theme('width'),
      }),
      minWidth: theme => ({
        ...theme('width'),
      }),
      maxHeight: theme => ({
        ...theme('width'),
      }),
      minHeight: theme => ({
        ...theme('width'),
      }),
      opacity: {
        '10': '0.1',
        '90': '0.9',
      },
      cursor: {
        'ns-resize': 'ns-resize',
        'ew-resize': 'ew-resize',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '8px',
        lg: '12px',
      },
    },
  },
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx,md}',
    '../frontend-ui/components/**/*.{vue,js,ts,jsx,tsx,md}',
  ],
  darkMode: ['class', '.mode-dark'],
}
