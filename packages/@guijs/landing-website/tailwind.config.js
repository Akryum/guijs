/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
  theme: {
    extend: {
      spacing: {
        '72p': '72px',
        128: '32rem',
        192: '48rem',
        256: '64rem',
      },
      maxWidth: theme => ({
        ...theme('width'),
      }),
    },
  },
  variants: {},
  plugins: [],
}
