import { Context } from 'hono'
import { addFunction, runFunction } from '@/lib/functions'

export async function addFunctionHandler(c: Context) {
  const body = await c.req.json()
  const res = await addFunction(body.id, body.code, body.type, body.params)

  return c.json(res)
}

export async function functionHandler(c: Context) {
  const id = c.req.query('id')
  const args = c.req.query('args')

  const res = await runFunction(id, args)

  

  if (res.type === 'json') {
    return c.json(res.result)
  } else if (res.type === 'html') {
    return c.html(res.result as string)
  }

  return c.json(res)
}
