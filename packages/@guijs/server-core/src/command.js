const portfinder = require('portfinder')
const shortid = require('shortid')
const apollo = require('./apollo')
const { log, error, openBrowser } = require('@vue/cli-shared-utils')

async function run (options = {}, context = process.cwd()) {
  const host = options.host || 'localhost'

  let port = options.port
  if (!port) {
    port = await portfinder.getPortPromise()
  }

  // Config
  process.env.VUE_APP_CLI_UI_URL = ''

  // Dev mode
  if (options.dev) {
    process.env.VUE_APP_CLI_UI_DEBUG = true
  }

  if (!process.env.VUE_CLI_IPC) {
    // Prevent IPC id conflicts
    process.env.VUE_CLI_IPC = `vue-cli-${shortid()}`
  }

  if (!options.quiet) log(`🚀  Starting GUI...`)

  const opts = {
    host,
    port,
    graphqlPath: '/graphql',
    subscriptionsPath: '/graphql',
    enableMocks: false,
    enableEngine: false,
    cors: '*',
    timeout: 1000000,
    quiet: true,
  }

  apollo(opts, () => {
    // Open browser
    const url = `http://${host}:${port}`
    if (!options.quiet) log(`🌠  Ready on ${url}`)
    if (options.headless) {
      console.log(port)
    } else {
      openBrowser(url)
    }
  })
}

module.exports = (...args) => {
  return run(...args).catch(err => {
    error(err)
    if (!process.env.VUE_CLI_TEST) {
      process.exit(1)
    }
  })
}
