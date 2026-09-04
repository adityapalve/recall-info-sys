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

interface SettingsRow {
  key: 'settings'
  value: Settings
}

export class RecallDB extends Dexie {
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
  }
}

export const db = new RecallDB()

export async function loadSettings(): Promise<Settings> {
  const row = await db.settings.get('settings')
  return { ...DEFAULT_SETTINGS, ...row?.value }
}

export async function saveSettings(value: Settings): Promise<void> {
  await db.settings.put({ key: 'settings', value })
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
  const sessions = await db.sessions.toArray()
  const days = new Set(sessions.map((s) => startOfDay(s.startedAt)))
  let day = startOfDay(now)
  if (!days.has(day)) day -= 24 * 60 * 60 * 1000
  let streak = 0
  while (days.has(day)) {
    streak++
    day -= 24 * 60 * 60 * 1000
  }
  return streak
}

export interface Backup {
  app: 'recall'
  version: 1
  exportedAt: string
  cardStates: CardState[]
  reviewLogs: ReviewLog[]
  sessions: Session[]
  settings: Settings
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
  }
}

/** Merge a backup in: logs/sessions by id, card states by most recent review. */
export async function importBackup(b: Backup): Promise<{ states: number; logs: number }> {
  if (b.app !== 'recall' || b.version !== 1) throw new Error('not a Recall backup')
  let states = 0
  await db.transaction('rw', db.cardStates, db.reviewLogs, db.sessions, db.settings, async () => {
    const existing = await db.cardStates.bulkGet(b.cardStates.map((s) => s.cardId))
    const newer = b.cardStates.filter((s, i) => {
      const cur = existing[i]
      return !cur || (s.lastReview ?? 0) > (cur.lastReview ?? 0)
    })
    await db.cardStates.bulkPut(newer)
    states = newer.length
    await db.reviewLogs.bulkPut(b.reviewLogs)
    await db.sessions.bulkPut(b.sessions)
    await db.settings.put({ key: 'settings', value: { ...DEFAULT_SETTINGS, ...b.settings } })
  })
  return { states, logs: b.reviewLogs.length }
}

export async function wipeAll(): Promise<void> {
  await db.transaction('rw', db.cardStates, db.reviewLogs, db.sessions, async () => {
    await db.cardStates.clear()
    await db.reviewLogs.clear()
    await db.sessions.clear()
  })
}
