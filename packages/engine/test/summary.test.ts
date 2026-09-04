import { describe, expect, it } from 'vitest'
import { seededRng } from '../src/rng.ts'
import { createScheduler } from '../src/scheduler.ts'
import { SessionRunner } from '../src/session.ts'
import { summarize, summaryToMarkdown } from '../src/summary.ts'
import type { Session } from '../src/types.ts'
import { T0, cardMap, counter, patternMap, problemMap } from './fixtures.ts'

describe('summarize', () => {
  const ids = ['lc:two-sum', 'lc:coin-change', 'lc:jump-game']
  const session: Session = {
    id: 's1',
    deckId: 'leetcode',
    startedAt: T0,
    endedAt: null,
    plannedSize: 3,
    cardIds: ids,
  }
  const runner = new SessionRunner(session, new Map(), {
    scheduler: createScheduler(),
    cards: cardMap,
    problems: problemMap,
    patterns: patternMap,
    rng: seededRng(3),
    now: () => T0,
    newId: counter(),
    maxRetries: 1,
  })
  // two-sum wrong then right on retry; coin-change right; jump-game wrong twice
  const plan: Record<string, boolean[]> = {
    'two-sum': [false, true],
    'coin-change': [true],
    'jump-game': [false, false],
  }
  while (!runner.isDone) {
    const q = runner.current()
    if (!q) break
    const answers = plan[q.problemId] as boolean[]
    const right = answers.shift() as boolean
    runner.answer(
      right ? q.correctId : (q.options.find((o) => o.id !== q.correctId)?.id as string),
      1000,
    )
    runner.commit()
  }
  const summary = summarize({
    session,
    logs: runner.logs,
    cards: cardMap,
    problems: problemMap,
    states: runner.states,
  })

  it('counts first-try accuracy and attempts per card', () => {
    expect(summary.total).toBe(3)
    expect(summary.firstTryCorrect).toBe(1)
    expect(summary.accuracy).toBeCloseTo(1 / 3)
    const byId = Object.fromEntries(summary.items.map((i) => [i.problemId, i]))
    expect(byId['two-sum']).toMatchObject({
      firstTryCorrect: false,
      finalCorrect: true,
      attempts: 2,
    })
    expect(byId['coin-change']).toMatchObject({
      firstTryCorrect: true,
      finalCorrect: true,
      attempts: 1,
      wrongPicks: [],
    })
    expect(byId['jump-game']).toMatchObject({
      firstTryCorrect: false,
      finalCorrect: false,
      attempts: 2,
    })
    expect(byId['jump-game']?.wrongPicks).toHaveLength(2)
    expect(byId['two-sum']?.nextDue).toBeGreaterThan(T0)
  })

  it('ranks weakest patterns by first-try accuracy', () => {
    expect(summary.patternStats).toEqual([
      { patternId: 'dp-1d', seen: 1, correct: 1 },
      { patternId: 'greedy', seen: 1, correct: 0 },
      { patternId: 'hash-map', seen: 1, correct: 0 },
    ])
    expect(summary.weakest).toEqual(['greedy', 'hash-map'])
  })

  it('renders markdown', () => {
    const md = summaryToMarkdown(summary, patternMap)
    expect(md).toContain('# Session 2026-09-04')
    expect(md).toContain('1/3 first try (33%)')
    expect(md).toContain('Weakest: Greedy, Hash Map')
    expect(md).toContain('✅ [coin change](https://leetcode.com/problems/coin-change/) — 1-D DP')
    expect(md).toContain('❌ [two sum]')
    expect(md).toContain('why two-sum')
  })

  it('ignores logs from other sessions', () => {
    const other = { ...session, id: 'other' }
    expect(
      summarize({
        session: other,
        logs: runner.logs,
        cards: cardMap,
        problems: problemMap,
        states: runner.states,
      }).total,
    ).toBe(0)
  })
})
