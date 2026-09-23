// Migration statements and upload batches are deliberately ordered.
/* oxlint-disable no-await-in-loop */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { Miniflare, convertV4MiniflareOptions } from 'miniflare'
import { syncResponseSchema } from '@recall/engine'
import { URL } from 'node:url'
import { readFile } from 'node:fs/promises'
import { handle } from '../src/handler.ts'
import { hash, type ApiEnv } from '../src/auth.ts'

const origin = 'https://recall.palve.dev'
const pagesOrigin = 'https://recall-1sh.pages.dev'
const mf = new Miniflare(
  convertV4MiniflareOptions({
    workers: [
      {
        modules: true,
        script: 'export default {fetch(){return new Response("ok")}}',
        d1Databases: ['DB'],
        compatibilityDate: '2026-09-22',
      },
    ],
  }),
)
let env: ApiEnv
beforeAll(async () => {
  env = {
    DB: await mf.getD1Database('DB'),
    APP_ORIGIN: origin,
    PAGES_ORIGIN: pagesOrigin,
    ALLOWED_EMAIL: 'aditya4palve@gmail.com',
  }
  const sql = await readFile(new URL('../../../migrations/0001_sync.sql', import.meta.url), 'utf8')
  for (const statement of sql
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean))
    await env.DB.prepare(statement).run()
  await env.DB.prepare('INSERT INTO users VALUES (?,?)').bind('u1', 'one@example.com').run()
  await env.DB.prepare('INSERT INTO users VALUES (?,?)').bind('u2', 'two@example.com').run()
  for (const id of ['u1', 'u2'])
    await env.DB.prepare('INSERT INTO auth_sessions VALUES (?,?,?)')
      .bind(await hash(id), id, Date.now() + 60000)
      .run()
})
afterAll(() => mf.dispose())
function request(body: unknown, token = 'u1', requestOrigin = origin, host = origin) {
  return new Request(host + '/api/sync', {
    method: 'POST',
    headers: {
      Origin: requestOrigin,
      'Content-Type': 'application/json',
      Cookie: `__Host-recall=${token}`,
    },
    body: JSON.stringify(body),
  })
}
const event = {
  id: 'e',
  ts: 1,
  kind: 'settings',
  value: { sessionSize: 20, newPerDay: 10, desiredRetention: 0.9, maxRetries: 2 },
}
describe('authenticated sync API', () => {
  it('rejects unauthenticated requests and foreign origins', async () => {
    expect((await handle(request({ cursor: 0, events: [] }, 'bad'), env)).status).toBe(401)
    expect(
      (await handle(request({ cursor: 0, events: [] }, 'u1', 'https://evil.example'), env)).status,
    ).toBe(403)
    expect(
      (await handle(request({ cursor: 0, events: [] }, 'u1', origin, pagesOrigin), env)).status,
    ).toBe(403)
    expect((await handle(new Request('https://evil.example/api/auth/me'), env)).status).toBe(403)
    expect(
      (await handle(request({ cursor: 0, events: [] }, 'u1', pagesOrigin, pagesOrigin), env))
        .status,
    ).toBe(200)
  })
  it('deduplicates retried uploads and keeps accounts isolated', async () => {
    const first = await handle(request({ cursor: 0, events: [event] }), env)
    expect(first.status).toBe(200)
    expect(first.headers.get('Cache-Control')).toBe('no-store')
    const again = await handle(request({ cursor: 0, events: [event] }), env)
    expect(syncResponseSchema.parse(await again.json()).events).toHaveLength(1)
    const other = await handle(request({ cursor: 0, events: [] }, 'u2'), env)
    expect(syncResponseSchema.parse(await other.json()).events).toHaveLength(0)
  })
  it('rejects attempts to rewrite immutable events', async () => {
    await handle(request({ cursor: 0, events: [{ ...event, id: 'immutable' }] }), env)
    const response = await handle(
      request({ cursor: 0, events: [{ ...event, id: 'immutable', ts: 2 }] }),
      env,
    )
    expect(response.status).toBe(409)
  })
  it('rejects malformed/oversized requests', async () => {
    expect(
      (await handle(request({ cursor: 0, events: [{ ...event, value: {} }] }), env)).status,
    ).toBe(400)
    expect((await handle(request({ padding: 'x'.repeat(260000) }), env)).status).toBe(400)
  })
  it('paginates without dropping events', async () => {
    for (let start = 0; start < 120; start += 40)
      await handle(
        request({
          cursor: 0,
          events: Array.from({ length: 40 }, (_, i) => ({ ...event, id: `page-${start + i}` })),
        }),
        env,
      )
    const first = syncResponseSchema.parse(
      await (await handle(request({ cursor: 0, events: [] }), env)).json(),
    )
    expect(first.events).toHaveLength(100)
    expect(first.more).toBe(true)
    const second = syncResponseSchema.parse(
      await (await handle(request({ cursor: first.cursor, events: [] }), env)).json(),
    )
    expect(second.events).toHaveLength(22)
    expect(second.more).toBe(false)
  })
  it('fails closed when OAuth is missing and rejects forged callbacks', async () => {
    expect((await handle(new Request(origin + '/api/auth/login'), env)).status).toBe(503)
    expect(
      (
        await handle(new Request(origin + '/api/auth/callback?state=bad&code=x'), {
          ...env,
          GOOGLE_CLIENT_ID: 'test',
          GOOGLE_CLIENT_SECRET: 'test',
        })
      ).status,
    ).toBe(400)
  })
  it('uses a callback on the same allowed host that started sign-in', async () => {
    const configured = { ...env, GOOGLE_CLIENT_ID: 'test', GOOGLE_CLIENT_SECRET: 'test' }
    for (const host of [origin, pagesOrigin]) {
      const response = await handle(new Request(host + '/api/auth/login'), configured)
      expect(response.status).toBe(302)
      const location = new URL(response.headers.get('Location') ?? '')
      expect(location.searchParams.get('redirect_uri')).toBe(`${host}/api/auth/callback`)
    }
  })
})
