import { syncRequestSchema, syncEventSchema } from '@recall/engine'
import {
  callback,
  configured,
  cookie,
  currentUser,
  hash,
  login,
  sessionCookie,
  type ApiEnv,
} from './auth.ts'

export async function limitedJson(request: Request) {
  const reader = request.body?.getReader()
  if (!reader) throw new Error('Missing request body')
  const chunks: Uint8Array[] = []
  let length = 0
  // Stream reads must be sequential to enforce the body limit before consuming more.
  /* oxlint-disable no-await-in-loop */
  for (;;) {
    const part = await reader.read()
    if (part.done) break
    length += part.value.byteLength
    if (length > 256000) {
      await reader.cancel()
      throw new Error('Request too large')
    }
    chunks.push(part.value)
  }
  /* oxlint-enable no-await-in-loop */
  const bytes = new Uint8Array(length)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.length
  }
  return JSON.parse(new TextDecoder().decode(bytes)) as unknown
}
export async function handle(request: Request, env: ApiEnv): Promise<Response> {
  let response: Response
  try {
    response = await route(request, env)
  } catch {
    console.error(JSON.stringify({ event: 'api_error', path: new URL(request.url).pathname }))
    response = Response.json({ error: 'Request failed. Please retry.' }, { status: 500 })
  }
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'no-referrer')
  return response
}
async function route(request: Request, env: ApiEnv): Promise<Response> {
  const url = new URL(request.url)
  if (url.origin !== env.APP_ORIGIN)
    return Response.json({ error: 'Use the production site to sign in and sync.' }, { status: 403 })
  if (request.method === 'POST' && request.headers.get('Origin') !== env.APP_ORIGIN)
    return Response.json({ error: 'Invalid origin' }, { status: 403 })
  if (url.pathname === '/api/auth/me' && request.method === 'GET')
    return Response.json({ user: await currentUser(request, env), configured: configured(env) })
  if (url.pathname === '/api/auth/login' && request.method === 'GET') return login(env)
  if (url.pathname === '/api/auth/callback' && request.method === 'GET')
    return callback(request, env)
  if (url.pathname === '/api/auth/logout' && request.method === 'POST') {
    await env.DB.prepare('DELETE FROM auth_sessions WHERE token_hash=?')
      .bind(await hash(cookie(request, '__Host-recall')))
      .run()
    return Response.json({ ok: true }, { headers: { 'Set-Cookie': sessionCookie('', 0) } })
  }
  if (url.pathname !== '/api/sync' || request.method !== 'POST')
    return Response.json({ error: 'Not found' }, { status: 404 })
  const user = await currentUser(request, env)
  if (!user) return Response.json({ error: 'Sign in required' }, { status: 401 })
  if (!request.headers.get('Content-Type')?.startsWith('application/json'))
    return Response.json({ error: 'JSON required' }, { status: 415 })
  let input
  try {
    input = syncRequestSchema.parse(await limitedJson(request))
  } catch {
    return Response.json({ error: 'Invalid or oversized sync request' }, { status: 400 })
  }
  if (
    input.events.some(
      (e) =>
        e.ts > Date.now() + 300000 ||
        (e.kind === 'review' && (e.id !== e.log.id || e.ts !== e.log.ts)),
    )
  )
    return Response.json(
      { error: 'Invalid review or device clock is ahead. Correct the device clock.' },
      { status: 400 },
    )
  if (input.events.length) {
    const results = await env.DB.batch<{ payload: string }>(
      input.events.map((e) =>
        env.DB.prepare(
          'INSERT INTO events (user_id,event_id,payload) VALUES (?,?,?) ON CONFLICT(user_id,event_id) DO UPDATE SET payload=events.payload RETURNING payload',
        ).bind(user.id, e.id, JSON.stringify(e)),
      ),
    )
    for (let i = 0; i < results.length; i++) {
      const stored = results[i]?.results[0]
      if (!stored || stored['payload'] !== JSON.stringify(input.events[i]))
        return Response.json(
          { error: 'An event ID was reused with different data' },
          { status: 409 },
        )
    }
  }
  const page = await env.DB.prepare(
    'SELECT seq,payload FROM events WHERE user_id=? AND seq>? ORDER BY seq LIMIT 101',
  )
    .bind(user.id, input.cursor)
    .all<{ seq: number; payload: string }>()
  const rows = page.results.slice(0, 100)
  return Response.json({
    acknowledged: input.events.map((e) => e.id),
    cursor: rows.at(-1)?.seq ?? input.cursor,
    more: page.results.length > 100,
    events: rows.map((r) => syncEventSchema.parse(JSON.parse(r.payload))),
  })
}
