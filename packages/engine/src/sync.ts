import { z } from 'zod'
import { createScheduler } from './scheduler.ts'
import { AVATAR_IDS, type CardState } from './types.ts'

const id = z.string().min(1).max(200)
const time = z.number().int().min(0).max(8640000000000000)
const grade = z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
const state = z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
export const settingsSchema = z.object({
  sessionSize: z.number().int().min(1).max(100),
  newPerDay: z.number().int().min(0).max(100),
  desiredRetention: z.number().min(0.7).max(0.97),
  maxRetries: z.number().int().min(0).max(5),
  avatar: z.enum(AVATAR_IDS).optional(),
})
const snapshotSchema = z.object({
  state,
  due: time,
  stability: z.number().nonnegative(),
  difficulty: z.number().min(0).max(10),
})
export const cardStateSchema = snapshotSchema.extend({
  cardId: id,
  scheduledDays: z.number().nonnegative(),
  learningSteps: z.number().int().nonnegative(),
  reps: z.number().int().nonnegative(),
  lapses: z.number().int().nonnegative(),
  lastReview: time.nullable(),
})
export const reviewSchema = z.object({
  id,
  cardId: id,
  sessionId: id,
  ts: time,
  rating: grade,
  correct: z.boolean(),
  chosen: id.nullable(),
  elapsedMs: z.number().nonnegative(),
  retry: z.boolean(),
  scheduled: z.boolean(),
  before: snapshotSchema.nullable(),
  after: snapshotSchema.nullable(),
})
export const sessionSchema = z.object({
  id,
  deckId: id,
  startedAt: time,
  endedAt: time.nullable(),
  plannedSize: z.number().int().min(1).max(100),
  cardIds: z.array(id).max(100),
})
export const explanationFeedbackSchema = z.object({
  id,
  problemId: id,
  title: z.string().max(300),
  contentVersion: id,
  chosen: id,
  vote: z.enum(['up', 'down']),
  reason: z.enum(['', 'unclear', 'wrong-answer', 'incorrect']),
  note: z.string().max(2000),
  ts: time,
})
export type ExplanationFeedback = z.infer<typeof explanationFeedbackSchema>
const envelope = { id, ts: time }
export const syncEventSchema = z.discriminatedUnion('kind', [
  z.object({
    ...envelope,
    kind: z.literal('review'),
    log: reviewSchema,
    retention: z.number().min(0.7).max(0.97),
    schedulerVersion: z.literal(1),
  }),
  z.object({ ...envelope, kind: z.literal('legacy-review'), log: reviewSchema }),
  z.object({ ...envelope, kind: z.literal('baseline'), value: cardStateSchema }),
  z.object({ ...envelope, kind: z.literal('session'), value: sessionSchema }),
  z.object({ ...envelope, kind: z.literal('settings'), value: settingsSchema }),
  z.object({ ...envelope, kind: z.literal('feedback'), value: explanationFeedbackSchema }),
])
export type SyncEvent = z.infer<typeof syncEventSchema>
export const syncRequestSchema = z.object({
  cursor: z.number().int().nonnegative(),
  events: z.array(syncEventSchema).max(40),
})
export const syncResponseSchema = z.object({
  cursor: z.number().int().nonnegative(),
  more: z.boolean(),
  acknowledged: z.array(id).max(40),
  events: z.array(syncEventSchema).max(100),
})
export const backupSchema = z.object({
  app: z.literal('recall'),
  version: z.literal(1),
  exportedAt: z.string(),
  cardStates: z.array(cardStateSchema),
  reviewLogs: z.array(reviewSchema),
  sessions: z.array(sessionSchema),
  settings: settingsSchema,
  feedback: z.array(explanationFeedbackSchema).default([]),
  events: z.array(syncEventSchema).optional(),
})

/** Stable event order, independent of upload arrival. Device clock corrections are not inferred. */
export function orderEvents(events: readonly SyncEvent[]): SyncEvent[] {
  return [...new Map(events.map((e) => [e.id, e])).values()].toSorted(
    (a, b) => a.ts - b.ts || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0),
  )
}

/** Legacy snapshots establish a baseline. New reviews are replayed deterministically without fuzz. */
export function replayStates(events: readonly SyncEvent[]): Map<string, CardState> {
  const ordered = orderEvents(events)
  const states = new Map<string, CardState>()
  const cutoffs = new Map<string, number>()
  for (const e of ordered) {
    if (e.kind !== 'baseline') continue
    const cutoff = e.value.lastReview ?? 0
    if (cutoff >= (cutoffs.get(e.value.cardId) ?? -1)) {
      states.set(e.value.cardId, e.value)
      cutoffs.set(e.value.cardId, cutoff)
    }
  }
  for (const e of ordered) {
    if (e.kind !== 'review' || !e.log.scheduled) continue
    if (e.log.ts <= (cutoffs.get(e.log.cardId) ?? -1)) continue
    const scheduler = createScheduler({ desiredRetention: e.retention, enableFuzz: false })
    const previous = states.get(e.log.cardId) ?? scheduler.newState(e.log.cardId, e.log.ts)
    states.set(
      e.log.cardId,
      scheduler.grade(previous, e.log.rating, Math.max(previous.lastReview ?? 0, e.log.ts)).state,
    )
  }
  return states
}

export const identitySchema = z.object({
  user: z.object({ id, email: z.string().email() }).nullable(),
  configured: z.boolean(),
})
