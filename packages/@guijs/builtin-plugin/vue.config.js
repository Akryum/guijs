const { clientAddonConfig } = require('@guijs/plugin-utils/config')
const path = require('path')

module.exports = {
  ...clientAddonConfig({
    id: 'org.vue.webpack.client-addon',
    port: 8096
  }, {
    css: {
      loaderOptions: {
        postcss: {
          config: {
            path: path.resolve(__dirname, 'postcss.config.js')
          }
        },
        stylus: {
          import: ['~@guijs/app-core/src/style/imports']
        }
      }
    }
  })
}
