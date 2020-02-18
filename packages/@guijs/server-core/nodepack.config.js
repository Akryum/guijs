const webpack = require('webpack')

/** @type {import('@nodepack/service').ProjectOptions} */
module.exports = {
  externals: true,
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugin('banner-plugin')
        .use(webpack.BannerPlugin, [{
          banner: "#!/usr/bin/env node",
          raw: true,
        }])
    }
  }
}
