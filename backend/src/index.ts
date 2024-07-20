import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'

import { addFunctionHandler, functionHandler } from '@/routes/handlers'

const app = new Hono()

app.use('/*', serveStatic({ root: './ui' }))

app.get('/function', functionHandler)
app.post('/add-function', addFunctionHandler)

serve({
  fetch: app.fetch,
  port: 3000
})
