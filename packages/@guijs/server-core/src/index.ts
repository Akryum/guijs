import { bootstrap, printReady } from '@nodepack/app'
import { hook } from '@nodepack/app-context'
import { spawn } from 'child_process'

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
