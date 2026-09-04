export const DAY_MS = 24 * 60 * 60 * 1000

/** Local midnight at the start of the day containing `t`. */
export function startOfDay(t: number): number {
  const d = new Date(t)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/** First instant of the next local day — the "due horizon" for today's session. */
export function endOfDay(t: number): number {
  const d = new Date(t)
  d.setHours(24, 0, 0, 0)
  return d.getTime()
}

/** "1d", "12d", "3w", "2mo", "1y" — for interval previews. */
export function formatDays(days: number): string {
  if (days < 1) return '<1d'
  if (days < 14) return `${Math.round(days)}d`
  if (days < 60) return `${Math.round(days / 7)}w`
  if (days < 365) return `${Math.round(days / 30)}mo`
  return `${(days / 365).toFixed(1)}y`
}

/** "today", "tomorrow", "in 5d", "Sep 12" — for next-due labels. */
export function formatDue(due: number, now: number): string {
  const days = Math.round((startOfDay(due) - startOfDay(now)) / DAY_MS)
  if (days <= 0) return 'today'
  if (days === 1) return 'tomorrow'
  if (days < 14) return `in ${days}d`
  return new Date(due).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
