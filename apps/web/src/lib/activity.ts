import type { ReviewLog } from '@recall/engine'

export function dayKey(t: number): string {
  const d = new Date(t)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export function activityDays(logs: readonly ReviewLog[], now: number) {
  const totals = new Map<string, { count: number; correct: number }>()
  for (const log of logs) {
    if (!log.scheduled) continue
    const key = dayKey(log.ts)
    const value = totals.get(key) ?? { count: 0, correct: 0 }
    value.count++
    if (log.correct) value.correct++
    totals.set(key, value)
  }
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - start.getDay() - 11 * 7)
  return Array.from({ length: 84 }, (_, i) => {
    const d = new Date(start)
    d.setDate(d.getDate() + i)
    const key = dayKey(d.getTime())
    return {
      key,
      ts: d.getTime(),
      future: key > dayKey(now),
      ...(totals.get(key) ?? { count: 0, correct: 0 }),
    }
  })
}
export function reviewStreak(logs: readonly ReviewLog[], now: number): number {
  const active = new Set(logs.filter((l) => l.scheduled).map((l) => dayKey(l.ts)))
  const d = new Date(now)
  d.setHours(0, 0, 0, 0)
  if (!active.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1)
  let count = 0
  while (active.has(dayKey(d.getTime()))) {
    count++
    d.setDate(d.getDate() - 1)
  }
  return count
}
