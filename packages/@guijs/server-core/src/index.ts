import { bootstrap, printReady } from '@nodepack/app'
import { hook } from '@nodepack/app-context'
import { spawn } from 'child_process'
import portfinder from 'portfinder'
import './express'
import { version } from '../package.json'
import os from 'os'

if (process.argv.length === 3 && process.argv[2] === '--version') {
  console.log(version)
} else {
  bootstrap(() => {
    if (process.env.NODE_ENV !== 'production') {
      printReady()
    } else {
      console.log(process.env.PORT)
    }
  })

  if (process.env.NODE_ENV !== 'production' && os.platform() !== 'win32') {
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
}
