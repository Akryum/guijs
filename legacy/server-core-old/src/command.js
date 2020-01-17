import portfinder from 'portfinder'
import shortid from 'shortid'
import apollo from './apollo'
import {
  log,
  error,
  openBrowser,
} from '@nodepack/utils'
import { chromeApp } from './util/chromeApp'
import { createSystrayMenu } from './util/systray'

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
    process.env.GUIJS_DEBUG = true
  }

  if (!process.env.VUE_CLI_IPC) {
    // Prevent IPC id conflicts
    process.env.VUE_CLI_IPC = `vue-cli-${shortid()}`
  }

  if (!options.quiet) log(`🚀  Starting GUI...`)

  const openApp = async () => {
    const url = process.env.GUIJS_URL
    if (options.chromeApp) {
      await chromeApp(url)
    } else {
      openBrowser(url)
    }
  }

  if (!options.hideSystray) {
    createSystrayMenu({
      openApp,
    })
  }

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

  apollo(opts, async () => {
    // Open browser
    if (process.env.GUIJS_DEV_CLIENT_PORT) {
      port = process.env.GUIJS_DEV_CLIENT_PORT
    }
    const url = process.env.GUIJS_URL = `http://${host}:${port}`
    if (!options.quiet) log(`🌠  Ready on ${url}`)
    if (options.headless) {
      console.log(port)
    } else {
      await openApp()
    }
  })
}

export default (...args) => {
  return run(...args).catch(err => {
    error(err)
    if (!process.env.VUE_CLI_TEST) {
      process.exit(1)
    }
  })
}
