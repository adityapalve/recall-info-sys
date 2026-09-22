import { Dexie, type EntityTable } from 'dexie'
import {
  DEFAULT_SETTINGS,
  State,
  type CardState,
  type ReviewLog,
  type Session,
  type Settings,
} from '@recall/engine'
import { startOfDay } from './time.ts'
import { reviewStreak } from './activity.ts'
import {
  backupSchema,
  orderEvents,
  replayStates,
  type SyncEvent,
  type ExplanationFeedback,
} from '@recall/engine'

interface SettingsRow {
  key: 'settings'
  value: Settings
}

export interface EventRow {
  id: string
  event: SyncEvent
  pending: number
}
export interface SyncMeta {
  key: 'sync'
  owner: string | null
  cursor: number
  lastSync: number | null
  initialized: boolean
}
export class RecallDB extends Dexie {
  events!: EntityTable<EventRow, 'id'>
  feedback!: EntityTable<ExplanationFeedback, 'id'>
  syncMeta!: EntityTable<SyncMeta, 'key'>
  cardStates!: EntityTable<CardState, 'cardId'>
  reviewLogs!: EntityTable<ReviewLog, 'id'>
  sessions!: EntityTable<Session, 'id'>
  settings!: EntityTable<SettingsRow, 'key'>

  constructor() {
    super('recall')
    this.version(1).stores({
      cardStates: 'cardId, due, state',
      reviewLogs: 'id, cardId, sessionId, ts',
      sessions: 'id, startedAt',
      settings: 'key',
    })
    this.version(2).stores({
      events: 'id, pending',
      feedback: 'id, problemId, vote',
      syncMeta: 'key',
    })
  }
}

export const db = new RecallDB()

export async function loadSettings(): Promise<Settings> {
  const row = await db.settings.get('settings')
  return { ...DEFAULT_SETTINGS, ...row?.value }
}

export async function saveSettings(value: Settings): Promise<void> {
  await db.transaction('rw', db.settings, db.events, async () => {
    await db.settings.put({ key: 'settings', value })
    await queueEvent({ id: crypto.randomUUID(), ts: Date.now(), kind: 'settings', value })
  })
  changed()
}

export async function loadStates(): Promise<Map<string, CardState>> {
  const rows = await db.cardStates.toArray()
  return new Map(rows.map((r) => [r.cardId, r]))
}

/** New cards first graded today (the daily new-card cap counts these). */
export async function countNewSeenToday(now: number): Promise<number> {
  const logs = await db.reviewLogs.where('ts').aboveOrEqual(startOfDay(now)).toArray()
  return logs.filter((l) => l.scheduled && l.before?.state === State.New).length
}

/** Consecutive days (ending today or yesterday) with at least one review. */
export async function currentStreak(now: number): Promise<number> {
  return reviewStreak(await db.reviewLogs.toArray(), now)
}

export interface Backup {
  app: 'recall'
  version: 1
  exportedAt: string
  cardStates: CardState[]
  reviewLogs: ReviewLog[]
  sessions: Session[]
  settings: Settings
  feedback?: ExplanationFeedback[]
  events?: SyncEvent[]
}

export async function exportBackup(): Promise<Backup> {
  return {
    app: 'recall',
    version: 1,
    exportedAt: new Date().toISOString(),
    cardStates: await db.cardStates.toArray(),
    reviewLogs: await db.reviewLogs.toArray(),
    sessions: await db.sessions.toArray(),
    settings: await loadSettings(),
    feedback: await db.feedback.toArray(),
    events: (await db.events.toArray()).map((r) => r.event),
  }
}

/** Merge a backup in: logs/sessions by id, card states by most recent review. */
// Each lookup must precede its conditional insert inside the same transaction.
/* oxlint-disable no-await-in-loop */
export async function importBackup(input: unknown): Promise<{ states: number; logs: number }> {
  const b = backupSchema.parse(input)
  await initializeEvents()
  let states = 0
  await db.transaction(
    'rw',
    [db.cardStates, db.reviewLogs, db.sessions, db.settings, db.events, db.feedback],
    async () => {
      const existing = await db.cardStates.bulkGet(b.cardStates.map((s) => s.cardId))
      const newer = b.cardStates.filter((s, i) => {
        const cur = existing[i]
        return !cur || (s.lastReview ?? 0) > (cur.lastReview ?? 0)
      })
      if (b.events?.length) {
        for (const event of b.events) if (!(await db.events.get(event.id))) await queueEvent(event)
      } else {
        for (const value of newer)
          await queueEvent({ id: crypto.randomUUID(), ts: Date.now(), kind: 'baseline', value })
        for (const log of b.reviewLogs)
          if (!(await db.reviewLogs.get(log.id)))
            await queueEvent({ id: `legacy:${log.id}`, ts: log.ts, kind: 'legacy-review', log })
      }
      for (const value of b.sessions)
        await queueEvent({
          id: crypto.randomUUID(),
          ts: value.endedAt ?? value.startedAt,
          kind: 'session',
          value,
        })
      for (const value of b.feedback)
        await queueEvent({ id: crypto.randomUUID(), ts: value.ts, kind: 'feedback', value })
      await db.feedback.bulkPut(b.feedback)
      await queueEvent({
        id: crypto.randomUUID(),
        ts: Date.now(),
        kind: 'settings',
        value: b.settings,
      })
      await db.cardStates.bulkPut(newer)
      states = newer.length
      await db.reviewLogs.bulkPut(b.reviewLogs)
      await db.sessions.bulkPut(b.sessions)
      await db.settings.put({ key: 'settings', value: { ...DEFAULT_SETTINGS, ...b.settings } })
    },
  )
  await materialize()
  changed()
  return { states, logs: b.reviewLogs.length }
}

/** Clear only this device, including its sync ownership. Cloud data is retained. */
export async function wipeAll(): Promise<void> {
  await db.transaction('rw', db.tables, async () => {
    await Promise.all(db.tables.map((table) => table.clear()))
  })
  changed()
}

export function changed() {
  window.dispatchEvent(new Event('recall-data'))
}
export async function queueEvent(event: SyncEvent) {
  await db.events.put({ id: event.id, event, pending: 1 })
}
export async function initializeEvents() {
  await db.transaction('rw', db.tables, async () => {
    if ((await db.syncMeta.get('sync'))?.initialized) return
    for (const value of await db.cardStates.toArray())
      await queueEvent({ id: crypto.randomUUID(), ts: Date.now(), kind: 'baseline', value })
    for (const log of await db.reviewLogs.toArray())
      await queueEvent({ id: `legacy:${log.id}`, ts: log.ts, kind: 'legacy-review', log })
    for (const value of await db.sessions.toArray())
      await queueEvent({
        id: crypto.randomUUID(),
        ts: value.endedAt ?? value.startedAt,
        kind: 'session',
        value,
      })
    const row = await db.settings.get('settings')
    if (row)
      await queueEvent({
        id: crypto.randomUUID(),
        ts: Date.now(),
        kind: 'settings',
        value: row.value,
      })
    await db.syncMeta.put({
      key: 'sync',
      owner: null,
      cursor: 0,
      lastSync: null,
      initialized: true,
    })
  })
}

/* oxlint-enable no-await-in-loop */

/** Must run between study sessions; replay keeps both devices' scheduled reviews. */
export async function materialize() {
  await db.transaction('rw', db.tables, async () => {
    const events = orderEvents((await db.events.toArray()).map((r) => r.event))
    await db.cardStates.bulkPut([...replayStates(events).values()])
    const logs = new Map<string, ReviewLog>()
    const sessions = new Map<string, Session>()
    const feedback = new Map<string, ExplanationFeedback>()
    let settings: Settings | undefined
    for (const e of events) {
      if (e.kind === 'review' || e.kind === 'legacy-review') logs.set(e.log.id, e.log)
      if (e.kind === 'session') {
        const previous = sessions.get(e.value.id)
        if (!previous?.endedAt || e.value.endedAt) sessions.set(e.value.id, e.value)
      }
      if (e.kind === 'settings') settings = e.value
      if (e.kind === 'feedback') feedback.set(e.value.id, e.value)
    }
    await db.reviewLogs.bulkPut([...logs.values()])
    await db.sessions.bulkPut([...sessions.values()])
    await db.feedback.bulkPut([...feedback.values()])
    if (settings) await db.settings.put({ key: 'settings', value: settings })
  })
}
export async function saveFeedback(value: ExplanationFeedback) {
  await db.transaction('rw', db.feedback, db.events, async () => {
    await db.feedback.put(value)
    await queueEvent({ id: crypto.randomUUID(), ts: value.ts, kind: 'feedback', value })
  })
  changed()
}
