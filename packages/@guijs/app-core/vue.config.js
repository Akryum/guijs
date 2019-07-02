const path = require('path')

module.exports = {
  pluginOptions: {
    apollo: {
      enableMocks: false,
      enableEngine: false
    }
  },

  configureWebpack: {
    resolve: {
      symlinks: false
    }
  },

  css: {
    loaderOptions: {
      postcss: {
        config: {
          path: path.resolve(__dirname, 'postcss.config.js')
        }
      },
      stylus: {
        import: ['~@/style/imports']
      }
    }
  }
}
