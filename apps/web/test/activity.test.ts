import { expect, it } from 'vitest'
import { activityDays, dayKey, reviewStreak } from '../src/lib/activity.ts'
import type { ReviewLog } from '@recall/engine'
function log(ts: number, scheduled = true): ReviewLog {
  return {
    id: String(ts),
    cardId: 'c',
    sessionId: 's',
    ts,
    rating: 3,
    correct: true,
    chosen: null,
    elapsedMs: 1,
    retry: !scheduled,
    scheduled,
    before: null,
    after: null,
  }
}
it('counts committed scheduled reviews rather than retries', () => {
  const now = new Date(2026, 8, 22, 12).getTime()
  const days = activityDays([log(now), log(now + 1, false)], now)
  expect(days).toHaveLength(56)
  expect(days.find((d) => d.key === dayKey(now))?.count).toBe(1)
})
it('walks calendar days across daylight saving changes', () => {
  process.env.TZ = 'Europe/London'
  const dates = [new Date(2026, 2, 28, 12), new Date(2026, 2, 29, 12), new Date(2026, 2, 30, 12)]
  expect(
    reviewStreak(
      dates.map((d) => log(d.getTime())),
      new Date(2026, 2, 31, 8).getTime(),
    ),
  ).toBe(3)
  expect(reviewStreak([], Date.now())).toBe(0)
})
