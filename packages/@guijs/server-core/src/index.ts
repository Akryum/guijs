import { bootstrap, printReady } from '@nodepack/app'
import { hook } from '@nodepack/app-context'
import { spawn } from 'child_process'
import portfinder from 'portfinder'
import './express'

bootstrap(() => {
  if (process.env.NODE_ENV !== 'production') {
    printReady()
  } else {
    console.log(process.env.PORT)
  }
})

if (process.env.NODE_ENV !== 'production') {
  // Auto-generate schema code
  hook('apolloListen', () => {
    spawn('yarn', ['schema-gen'], {
      cwd: process.cwd(),
      stdio: ['inherit', 'inherit', 'inherit'],
    })
  })
} else {
  hook('expressHttp', async () => {
    if (!process.env.PORT) {
      const port = await portfinder.getPortPromise({
        port: 5910,
      })
      process.env.PORT = port.toString()
    }

    // @TODO dynamic terminal socket port should be sent to client
    if (!process.env.GUIJS_TERMINAL_WS_PORT) {
      process.env.GUIJS_TERMINAL_WS_PORT = (parseInt(process.env.PORT) + 1).toString()
    }
  })
}
