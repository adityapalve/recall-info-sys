// Install the browser IndexedDB API for integration tests.
// oxlint-disable-next-line import/no-unassigned-import
import 'fake-indexeddb/auto'
import { afterEach, expect, it } from 'vitest'
import {
  db,
  initializeEvents,
  queueEvent,
  materialize,
  exportBackup,
  importBackup,
} from '../src/lib/db.ts'
import { createScheduler, type SyncEvent } from '@recall/engine'
// Browser notification seam only; IndexedDB below is exercised through Dexie.
Object.defineProperty(globalThis, 'window', { value: new EventTarget(), configurable: true })
afterEach(async () => {
  await db.transaction('rw', db.tables, async () => {
    await Promise.all(db.tables.map((t) => t.clear()))
  })
})
it('migrates existing local progress once without losing data', async () => {
  const scheduler = createScheduler(),
    now = Date.now()
  const value = scheduler.grade(scheduler.newState('c', now), 3, now).state
  await db.cardStates.put(value)
  await initializeEvents()
  await initializeEvents()
  expect(await db.events.count()).toBe(1)
  await materialize()
  expect(await db.cardStates.get('c')).toEqual(value)
})
it('queues a review atomically and rolls back both records on storage failure', async () => {
  const event: SyncEvent = {
    id: 'e',
    ts: 1,
    kind: 'settings',
    value: { sessionSize: 20, newPerDay: 10, desiredRetention: 0.9, maxRetries: 2 },
  }
  await expect(
    db.transaction('rw', db.events, db.settings, async () => {
      await db.settings.put({ key: 'settings', value: event.value })
      await queueEvent(event)
      throw new Error('disk full')
    }),
  ).rejects.toThrow('disk full')
  expect(await db.events.count()).toBe(0)
  expect(await db.settings.count()).toBe(0)
})
it('backs up and restores feedback and sync history idempotently', async () => {
  await initializeEvents()
  const value = {
    id: 'f',
    problemId: 'p',
    title: 'Problem',
    contentVersion: 'v1',
    chosen: 'wrong',
    vote: 'down' as const,
    reason: 'unclear' as const,
    note: 'why?',
    ts: 1,
  }
  await queueEvent({ id: 'f-event', ts: 1, kind: 'feedback', value })
  await materialize()
  const backup = await exportBackup()
  await importBackup(backup)
  await importBackup(backup)
  expect(await db.feedback.count()).toBe(1)
  expect((await db.feedback.get('f'))?.note).toBe('why?')
})
