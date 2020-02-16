import { bootstrap, printReady } from '@nodepack/app'
import { hook } from '@nodepack/app-context'
import { spawn } from 'child_process'
import { version } from '../package.json'

if (process.argv.length === 3 && process.argv[2] === '--version') {
  console.log(version)
} else {
  bootstrap(() => {
    // @TODO remove printReady
    printReady()
  })

  if (process.env.NODE_ENV !== 'production') {
    // Auto-generate shcema code
    hook('apolloListen', () => {
      spawn('yarn', ['schema-gen'], {
        cwd: process.cwd(),
        stdio: ['inherit', 'inherit', 'inherit'],
      })
    })
  }
}
