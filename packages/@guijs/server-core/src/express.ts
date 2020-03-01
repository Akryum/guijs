import { hook } from '@nodepack/app-context'
import { resolveModule } from '@nodepack/module'
import express from 'express'
import fallback from 'express-history-api-fallback'
import path from 'path'
import request from 'request'
import Context from './generated/context'

const CACHE_CONTROL = 'no-store, no-cache, must-revalidate, private'

// eslint-disable-next-line no-eval
let distPath = resolveModule('@guijs/frontend-core/package.json', eval('__dirname'))
distPath = path.join(path.dirname(distPath), 'dist')

hook('expressHttp', (ctx: Context) => {
  const app = ctx.express

  // Proxy
  app.get('/_proxy/:url', async (req, res) => {
    const url = req.params.url
    request(url).pipe(res)
  })

  // Assets
  app.use(express.static(distPath, { setHeaders }))
  app.use(fallback(path.join(distPath, 'index.html'), {
    headers: {
      'Cache-Control': CACHE_CONTROL,
    },
  }))
})

function setHeaders (res) {
  res.set('Cache-Control', CACHE_CONTROL)
}
