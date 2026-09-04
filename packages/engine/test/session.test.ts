import { describe, expect, it } from 'vitest'
import { seededRng } from '../src/rng.ts'
import { createScheduler } from '../src/scheduler.ts'
import { buildSession, SessionRunner, type RunnerDeps } from '../src/session.ts'
import type { CardState, Session } from '../src/types.ts'
import { CARDS, DAY, T0, cardMap, counter, patternMap, problemMap } from './fixtures.ts'

const scheduler = createScheduler()

function deps(now: () => number, maxRetries = 2): RunnerDeps {
  return {
    scheduler,
    cards: cardMap,
    problems: problemMap,
    patterns: patternMap,
    rng: seededRng(42),
    now,
    newId: counter('log'),
    maxRetries,
  }
}

function session(cardIds: string[]): Session {
  return {
    id: 's1',
    deckId: 'leetcode',
    startedAt: T0,
    endedAt: null,
    plannedSize: cardIds.length,
    cardIds,
  }
}

describe('buildSession', () => {
  it('introduces new cards in curriculum order up to the daily cap', () => {
    const r = buildSession({
      cards: CARDS,
      states: new Map(),
      scheduler,
      now: T0,
      size: 20,
      newCap: 3,
      newSeenToday: 1,
    })
    expect(r.cardIds).toEqual(['lc:two-sum', 'lc:trapping-rain-water'])
    expect(r).toMatchObject({ dueCount: 0, newCount: 2 })
  })

  it('puts due cards first, least retrievable first, then fills with new cards', () => {
    const states = new Map<string, CardState>()
    // reviewed 1 day ago vs 20 days ago: the older one is more forgotten
    states.set(
      'lc:coin-change',
      scheduler.grade(scheduler.newState('lc:coin-change', T0 - 20 * DAY), 3, T0 - 20 * DAY).state,
    )
    states.set(
      'lc:jump-game',
      scheduler.grade(scheduler.newState('lc:jump-game', T0 - DAY), 1, T0 - DAY).state,
    )
    states.set(
      'lc:daily-temperatures',
      scheduler.grade(scheduler.newState('lc:daily-temperatures', T0), 4, T0).state,
    ) // not due
    const now = T0 + DAY
    const r = buildSession({
      cards: CARDS,
      states,
      scheduler,
      now,
      size: 4,
      newCap: 10,
      newSeenToday: 0,
    })
    expect(r.dueCount).toBe(2)
    expect(r.newCount).toBe(2)
    const [first, second] = r.cardIds
    expect(new Set([first, second])).toEqual(new Set(['lc:coin-change', 'lc:jump-game']))
    const rFirst = scheduler.retrievability(states.get(first as string) as CardState, now)
    const rSecond = scheduler.retrievability(states.get(second as string) as CardState, now)
    expect(rFirst).toBeLessThanOrEqual(rSecond)
    expect(r.cardIds.slice(2)).toEqual(['lc:two-sum', 'lc:trapping-rain-water'])
  })

  it('counts cards due before the horizon as due', () => {
    const st = scheduler.grade(
      scheduler.newState('lc:two-sum', T0 + 3_600_000),
      3,
      T0 + 3_600_000,
    ).state
    const states = new Map([['lc:two-sum', st]])
    const args = { cards: CARDS, states, scheduler, size: 1, newCap: 0, newSeenToday: 0 }
    expect(buildSession({ ...args, now: st.due - 60_000 }).dueCount).toBe(0)
    expect(buildSession({ ...args, now: st.due - 60_000, horizon: st.due + 1 }).dueCount).toBe(1)
  })

  it('truncates due cards to the session size and adds no new cards when full', () => {
    const states = new Map<string, CardState>()
    for (const c of CARDS)
      states.set(
        c.id,
        scheduler.grade(scheduler.newState(c.id, T0 - 30 * DAY), 3, T0 - 30 * DAY).state,
      )
    const r = buildSession({
      cards: CARDS,
      states,
      scheduler,
      now: T0,
      size: 3,
      newCap: 10,
      newSeenToday: 0,
    })
    expect(r.cardIds).toHaveLength(3)
    expect(r.newCount).toBe(0)
  })
})

describe('SessionRunner', () => {
  it('walks a session: correct answers take the given rating, misses are re-asked unscheduled', () => {
    let t = T0
    const runner = new SessionRunner(
      session(['lc:two-sum', 'lc:coin-change']),
      new Map(),
      deps(() => t),
    )

    // card 1: wrong
    const q1 = runner.current()
    expect(q1?.problemId).toBe('two-sum')
    const wrong = q1?.options.find((o) => o.id !== q1.correctId)?.id as string
    const fb1 = runner.answer(wrong, 4000)
    expect(fb1.correct).toBe(false)
    expect(fb1.whyNotChosen).toBe(`not ${wrong} for two-sum`)
    expect(runner.current()).toBe(q1) // still pending
    const log1 = runner.commit(4) // rating ignored on a miss
    expect(log1).toMatchObject({
      rating: 1,
      correct: false,
      retry: false,
      scheduled: true,
      chosen: wrong,
    })
    expect(runner.states.get('lc:two-sum')?.reps).toBe(1)
    expect(runner.progress()).toEqual({ answered: 1, total: 2, retriesPending: 1 })

    // card 2: right, Easy
    t += 60_000
    const q2 = runner.current()
    expect(q2?.problemId).toBe('coin-change')
    runner.answer(q2?.correctId as string, 1500)
    const log2 = runner.commit(4)
    expect(log2).toMatchObject({ rating: 4, correct: true, scheduled: true })
    expect(runner.progress()).toEqual({ answered: 2, total: 2, retriesPending: 1 })
    expect(runner.isDone).toBe(false)

    // retry of card 1: right this time, must not touch FSRS state
    t += 60_000
    const before = runner.states.get('lc:two-sum')
    const q3 = runner.current()
    expect(q3?.problemId).toBe('two-sum')
    runner.answer(q3?.correctId as string, 2000)
    const log3 = runner.commit()
    expect(log3).toMatchObject({
      rating: 3,
      correct: true,
      retry: true,
      scheduled: false,
      before: null,
      after: null,
    })
    expect(runner.states.get('lc:two-sum')).toEqual(before)
    expect(runner.isDone).toBe(true)
    expect(runner.session.endedAt).toBe(t)
    expect(runner.logs).toHaveLength(3)
  })

  it('stops re-asking after maxRetries', () => {
    const runner = new SessionRunner(
      session(['lc:two-sum']),
      new Map(),
      deps(() => T0, 2),
    )
    let shown = 0
    while (!runner.isDone) {
      const q = runner.current()
      if (!q) break
      shown++
      runner.answer(q.options.find((o) => o.id !== q.correctId)?.id as string, 1000)
      runner.commit()
    }
    expect(shown).toBe(3)
    expect(runner.logs.filter((l) => l.scheduled)).toHaveLength(1)
    expect(runner.states.get('lc:two-sum')?.lapses).toBe(0) // first-ever review, not a lapse
  })

  it('a due card graded Again records a lapse and comes back before a Good one', () => {
    const prior = scheduler.grade(
      scheduler.newState('lc:two-sum', T0 - 10 * DAY),
      3,
      T0 - 10 * DAY,
    ).state
    const runner = new SessionRunner(
      session(['lc:two-sum', 'lc:coin-change']),
      new Map([['lc:two-sum', prior]]),
      deps(() => T0, 0),
    )
    const q1 = runner.current()
    runner.answer(q1?.options.find((o) => o.id !== q1.correctId)?.id as string, 1000)
    runner.commit()
    const q2 = runner.current()
    runner.answer(q2?.correctId as string, 1000)
    runner.commit(3)
    expect(runner.states.get('lc:two-sum')?.lapses).toBe(1)
    expect(runner.states.get('lc:two-sum')?.due).toBeLessThan(
      runner.states.get('lc:coin-change')?.due as number,
    )
  })

  it('guards against misuse', () => {
    const runner = new SessionRunner(
      session(['lc:two-sum']),
      new Map(),
      deps(() => T0),
    )
    expect(() => runner.commit()).toThrow(/nothing to commit/)
    const q = runner.current()
    runner.answer(q?.correctId as string, 1)
    expect(() => runner.answer('x', 1)).toThrow(/already given/)
    runner.commit()
    expect(runner.current()).toBeNull()
    expect(() => runner.answer('x', 1)).toThrow(/over/)
  })
})
