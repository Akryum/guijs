module.exports = api => {
  require('./project-types')(api)

  if (process.env.GUIJS_DEBUG) {
    api.addClientAddon({
      id: 'org.vue.webpack.client-addon.dev',
      url: 'http://localhost:8096/index.js',
    })
  } else {
    api.addClientAddon({
      id: 'org.vue.webpack.client-addon',
      path: '@guijs/builtin-plugin/dist',
    })
  }

  require('./tasks')(api)
  require('./widgets')(api)
}
