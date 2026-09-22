// Install IndexedDB's browser API in Node; Dexie itself is exercised unmodified.
// oxlint-disable-next-line import/no-unassigned-import
import 'fake-indexeddb/auto'
import { afterEach, expect, it, vi } from 'vitest'
import { db, initializeEvents, queueEvent } from '../src/lib/db.ts'
import { checkIdentity, connectCloud, getCloudStatus, syncNow } from '../src/lib/sync.ts'
import { DEFAULT_SETTINGS, syncRequestSchema } from '@recall/engine'

vi.stubGlobal('window', new EventTarget())
vi.stubGlobal('navigator', { onLine: true })
afterEach(async () => {
  await db.transaction('rw', db.tables, () => Promise.all(db.tables.map((t) => t.clear())))
})
it('retains an outbox after a lost response, retries the same ID, and restores remote settings', async () => {
  await initializeEvents()
  await queueEvent({ id: 'local', ts: 1, kind: 'settings', value: DEFAULT_SETTINGS })
  let loseResponse = true
  const uploaded: string[] = []
  vi.stubGlobal('fetch', async (url: string, options?: RequestInit) => {
    if (url === '/api/auth/me')
      return Response.json({ user: { id: 'owner', email: 'owner@example.com' }, configured: true })
    const input = syncRequestSchema.parse(JSON.parse(String(options?.body)))
    uploaded.push(...input.events.map((e) => e.id))
    if (loseResponse) throw new Error('connection lost after upload')
    return Response.json({
      acknowledged: input.events.map((e) => e.id),
      cursor: 2,
      more: false,
      events: [
        ...input.events,
        { id: 'remote', ts: 2, kind: 'settings', value: { ...DEFAULT_SETTINGS, newPerDay: 7 } },
      ],
    })
  })
  await checkIdentity()
  await connectCloud()
  expect((await db.events.get('local'))?.pending).toBe(1)
  expect((await db.syncMeta.get('sync'))?.cursor).toBe(0)
  loseResponse = false
  await syncNow()
  expect(uploaded).toEqual(['local', 'local'])
  expect((await db.events.get('local'))?.pending).toBe(0)
  expect((await db.syncMeta.get('sync'))?.cursor).toBe(2)
  expect((await db.settings.get('settings'))?.value.newPerDay).toBe(7)
  expect(getCloudStatus().pending).toBe(0)
})
it('will not connect another account to an owned device', async () => {
  await initializeEvents()
  await db.syncMeta.update('sync', { owner: 'original' })
  vi.stubGlobal('fetch', async () =>
    Response.json({ user: { id: 'other', email: 'other@example.com' }, configured: true }),
  )
  await checkIdentity()
  await expect(connectCloud()).rejects.toThrow('another account')
  expect((await db.syncMeta.get('sync'))?.owner).toBe('original')
})
