const IN_PRODUCTION = process.env.NODE_ENV === 'production'
const DISABLE_PURGECSS = process.env.DISABLE_PURGECSS === 'true'

module.exports = {
  plugins: [
    require('postcss-preset-env')({ stage: 0 }),
    require('tailwindcss')(),
    IN_PRODUCTION && !DISABLE_PURGECSS && require('@fullhuman/postcss-purgecss')({
      content: [ `./public/**/*.html`, `./src/**/*.vue` ],
      defaultExtractor (content) {
        const contentWithoutStyleBlocks = content.replace(/<style[^]+?<\/style>/gi, '')
        return contentWithoutStyleBlocks.match(/[A-Za-z0-9-_/:]*[A-Za-z0-9-_/]+/g) || []
      },
      whitelist: [
        'a',
        'mode-dark',
      ],
      whitelistPatterns: [
        /-(leave|enter|appear)(|-(to|from|active))$/,
        /^(?!(|.*?:)cursor-move).+-move$/,
        /^router-link(|-exact)-active$/,
        /^v-popper/,
      ],
    }),
    require('autoprefixer')(),
    require('postcss-nested')(),
  ],
}
