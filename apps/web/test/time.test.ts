import { describe, expect, it } from 'vitest'
import { endOfDay, formatDays, formatDue, startOfDay } from '../src/lib/time.ts'

describe('time helpers', () => {
  const t = new Date(2026, 8, 4, 9, 5).getTime()

  it('startOfDay / endOfDay bracket the local day', () => {
    expect(new Date(startOfDay(t)).getHours()).toBe(0)
    expect(endOfDay(t) - startOfDay(t)).toBe(24 * 60 * 60 * 1000)
    expect(endOfDay(t)).toBeGreaterThan(t)
  })

  it('formats intervals', () => {
    expect(formatDays(1)).toBe('1d')
    expect(formatDays(13)).toBe('13d')
    expect(formatDays(21)).toBe('3w')
    expect(formatDays(90)).toBe('3mo')
    expect(formatDays(400)).toBe('1.1y')
  })

  it('formats due dates relative to now', () => {
    expect(formatDue(t, t)).toBe('today')
    expect(formatDue(t + 24 * 60 * 60 * 1000, t)).toBe('tomorrow')
    expect(formatDue(t + 5 * 24 * 60 * 60 * 1000, t)).toBe('in 5d')
  })
})
