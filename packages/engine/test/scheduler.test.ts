import { describe, expect, it } from 'vitest'
import { State } from 'ts-fsrs'
import { createScheduler } from '../src/scheduler.ts'
import { DAY, T0 } from './fixtures.ts'

describe('scheduler', () => {
  const s = createScheduler()

  it('new card graded Good graduates straight to Review with a multi-day interval', () => {
    const r = s.grade(s.newState('c', T0), 3, T0)
    expect(r.state.state).toBe(State.Review)
    expect(r.state.reps).toBe(1)
    expect(r.intervalDays).toBeGreaterThanOrEqual(1)
    expect(r.state.due).toBeGreaterThanOrEqual(T0 + DAY)
  })

  it('Easy schedules further out than Good, Good further than Hard', () => {
    const fresh = s.newState('c', T0)
    const hard = s.grade(fresh, 2, T0).intervalDays
    const good = s.grade(fresh, 3, T0).intervalDays
    const easy = s.grade(fresh, 4, T0).intervalDays
    expect(hard).toBeLessThanOrEqual(good)
    expect(good).toBeLessThan(easy)
  })

  it('new card graded Again comes back soon and is due at the next session', () => {
    const r = s.grade(s.newState('c', T0), 1, T0)
    expect(r.state.due - T0).toBeLessThanOrEqual(DAY)
    expect(s.isDue(r.state, T0 + DAY)).toBe(true)
  })

  it('a lapse on a Review card increments lapses and shortens the interval', () => {
    const good = s.grade(s.newState('c', T0), 3, T0).state
    const later = good.due + DAY
    const lapsed = s.grade(good, 1, later)
    expect(lapsed.state.lapses).toBe(1)
    expect(lapsed.state.stability).toBeLessThan(good.stability)
  })

  it('retrievability decays over time and is 0 for never-seen cards', () => {
    expect(s.retrievability(s.newState('c', T0), T0)).toBe(0)
    const st = s.grade(s.newState('c', T0), 3, T0).state
    const r1 = s.retrievability(st, T0 + DAY)
    const r30 = s.retrievability(st, T0 + 30 * DAY)
    expect(r1).toBeGreaterThan(r30)
    expect(r1).toBeLessThanOrEqual(1)
    expect(r30).toBeGreaterThan(0)
  })

  it('isDue is false for new cards and true once due passes', () => {
    const st = s.grade(s.newState('c', T0), 3, T0).state
    expect(s.isDue(s.newState('x', T0), T0 + 100 * DAY)).toBe(false)
    expect(s.isDue(st, st.due - 1)).toBe(false)
    expect(s.isDue(st, st.due)).toBe(true)
  })

  it('preview matches grade for every rating', () => {
    const st = s.grade(s.newState('c', T0), 3, T0).state
    const now = st.due
    const pv = s.preview(st, now)
    for (const g of [1, 2, 3, 4] as const) {
      expect(pv[g]).toBe(s.grade(st, g, now).intervalDays)
    }
  })

  it('state survives a JSON round trip', () => {
    const st = s.grade(s.newState('c', T0), 3, T0).state
    const back = JSON.parse(JSON.stringify(st))
    expect(s.grade(back, 3, st.due)).toEqual(s.grade(st, 3, st.due))
  })

  it('higher desired retention means shorter intervals', () => {
    const loose = createScheduler({ desiredRetention: 0.8 })
    const tight = createScheduler({ desiredRetention: 0.95 })
    const a = loose.grade(loose.newState('c', T0), 3, T0).intervalDays
    const b = tight.grade(tight.newState('c', T0), 3, T0).intervalDays
    expect(b).toBeLessThan(a)
  })
})
