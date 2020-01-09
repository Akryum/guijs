import { bootstrap, printReady } from '@nodepack/app'
import { hook } from '@nodepack/app-context'
import { spawn } from 'child_process'

bootstrap(() => {
  console.log(`Welcome to your new nodepack-powered app!`)
  console.log(`Getting started: https://nodepackjs.com/guide`)
  printReady()
})

// Auto-generate shcema code
hook('apolloListen', () => {
  spawn('yarn', ['schema-gen'], {
    cwd: process.cwd(),
    stdio: ['inherit', 'inherit', 'inherit'],
  })
})
