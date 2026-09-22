import { describe, expect, it } from 'vitest'
import { createScheduler } from '../src/scheduler.ts'
import { replayStates, backupSchema, type SyncEvent } from '../src/sync.ts'
import { SessionRunner } from '../src/session.ts'
import { seededRng } from '../src/rng.ts'
import { T0, cardMap, patternMap, problemMap, counter } from './fixtures.ts'

function review(id: string, ts: number, rating: 1 | 2 | 3 | 4 = 3): SyncEvent {
  return {
    id,
    ts,
    kind: 'review',
    retention: 0.9,
    schedulerVersion: 1,
    log: {
      id,
      ts,
      cardId: 'lc:two-sum',
      sessionId: 'session',
      rating,
      correct: rating !== 1,
      chosen: 'hash-map',
      elapsedMs: 1000,
      retry: false,
      scheduled: true,
      before: null,
      after: null,
    },
  }
}
describe('sync reconciliation', () => {
  it('keeps both offline reviews, independent of arrival order and duplicate deliveries', () => {
    const a = review('a', T0),
      b = review('b', T0 + 86400000, 2)
    const expected = replayStates([a, b])
    expect(replayStates([b, a, a])).toEqual(expected)
    expect(expected.get('lc:two-sum')?.reps).toBe(2)
  })
  it('uses a stable tie break for concurrent review times', () => {
    const a = review('a', T0, 1),
      b = review('b', T0, 4)
    expect(replayStates([a, b])).toEqual(replayStates([b, a]))
  })
  it('does not reschedule retries', () => {
    const a = review('a', T0),
      b = review('b', T0 + 10000)
    if (b.kind === 'review') {
      b.log.retry = true
      b.log.scheduled = false
    }
    expect(replayStates([a, b])).toEqual(replayStates([a]))
  })
  it('does not replay legacy history on top of an imported baseline', () => {
    const scheduler = createScheduler()
    const value = scheduler.grade(scheduler.newState('lc:two-sum', T0), 3, T0).state
    const baseline: SyncEvent = { id: 'seed', ts: T0 + 1, kind: 'baseline', value }
    const result = replayStates([baseline, review('old', T0), review('new', T0 + 86400000)])
    expect(result.get('lc:two-sum')?.reps).toBe(2)
  })
  it('rejects invalid backups instead of trusting JSON casts', () => {
    expect(
      backupSchema.safeParse({ app: 'recall', version: 1, settings: { desiredRetention: 'yes' } })
        .success,
    ).toBe(false)
  })
  it('staging a review leaves the live runner unchanged until persisted', () => {
    const runner = new SessionRunner(
      {
        id: 's',
        deckId: 'leetcode',
        startedAt: T0,
        endedAt: null,
        plannedSize: 1,
        cardIds: ['lc:two-sum'],
      },
      new Map(),
      {
        scheduler: createScheduler(),
        cards: cardMap,
        patterns: patternMap,
        problems: problemMap,
        rng: seededRng(1),
        now: () => T0,
        newId: counter(),
        maxRetries: 0,
      },
    )
    const q = runner.current()
    if (!q) throw new Error('missing question')
    runner.answer(q.correctId, 1000)
    const staged = runner.fork()
    staged.commit(3)
    expect(staged.isDone).toBe(true)
    expect(runner.logs).toHaveLength(0)
    expect(runner.states.size).toBe(0)
    expect(runner.isDone).toBe(false)
    expect(runner.commit(3).correct).toBe(true)
  })
})
