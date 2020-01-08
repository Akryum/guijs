import { bootstrap, printReady } from '@nodepack/app'

bootstrap(() => {
  console.log(`Welcome to your new nodepack-powered app!`)
  console.log(`Getting started: https://nodepackjs.com/guide`)
  printReady()
})
