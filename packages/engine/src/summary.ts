import type { Card, CardState, Pattern, Problem, ReviewLog, Session } from './types.ts'

export interface SummaryItem {
  cardId: string
  problemId: string
  title: string
  difficulty: string
  leetcodeUrl: string
  primaryPattern: string
  firstTryCorrect: boolean
  /** Presentations in this session, including re-asks. */
  attempts: number
  finalCorrect: boolean
  /** Wrong options picked, in order. */
  wrongPicks: string[]
  nextDue: number | null
  intervalDays: number | null
  why: string
}

export interface PatternStat {
  patternId: string
  seen: number
  correct: number
}

export interface Summary {
  sessionId: string
  startedAt: number
  endedAt: number | null
  items: SummaryItem[]
  total: number
  firstTryCorrect: number
  /** firstTryCorrect / total, 0–1. */
  accuracy: number
  patternStats: PatternStat[]
  /** Pattern ids with the lowest first-try accuracy, worst first. */
  weakest: string[]
}

export interface SummaryInput {
  session: Session
  logs: readonly ReviewLog[]
  cards: ReadonlyMap<string, Card>
  problems: ReadonlyMap<string, Problem>
  states: ReadonlyMap<string, CardState>
}

export function summarize(input: SummaryInput): Summary {
  const { session, logs, cards, problems, states } = input
  const byCard = new Map<string, ReviewLog[]>()
  for (const l of logs) {
    if (l.sessionId !== session.id) continue
    const arr = byCard.get(l.cardId) ?? []
    arr.push(l)
    byCard.set(l.cardId, arr)
  }

  const items: SummaryItem[] = []
  for (const cardId of session.cardIds) {
    const card = cards.get(cardId)
    const problem = card ? problems.get(card.ref) : undefined
    const attempts = (byCard.get(cardId) ?? []).toSorted((a, b) => a.ts - b.ts)
    const first = attempts[0]
    const last = attempts[attempts.length - 1]
    if (!card || !problem || !first || !last) continue
    const st = states.get(cardId)
    items.push({
      cardId,
      problemId: problem.id,
      title: problem.title,
      difficulty: problem.difficulty,
      leetcodeUrl: problem.leetcodeUrl,
      primaryPattern: problem.patterns[0] ?? '',
      firstTryCorrect: first.correct,
      attempts: attempts.length,
      finalCorrect: last.correct,
      wrongPicks: attempts
        .filter((a) => !a.correct && a.chosen !== null)
        .map((a) => a.chosen as string),
      nextDue: st?.due ?? null,
      intervalDays: st?.scheduledDays ?? null,
      why: problem.explanation.why,
    })
  }

  const stats = new Map<string, PatternStat>()
  for (const it of items) {
    const s = stats.get(it.primaryPattern) ?? { patternId: it.primaryPattern, seen: 0, correct: 0 }
    s.seen++
    if (it.firstTryCorrect) s.correct++
    stats.set(it.primaryPattern, s)
  }
  const patternStats = [...stats.values()].toSorted((a, b) =>
    a.patternId.localeCompare(b.patternId),
  )
  const weakest = patternStats
    .filter((s) => s.correct < s.seen)
    .toSorted((a, b) => a.correct / a.seen - b.correct / b.seen || b.seen - a.seen)
    .map((s) => s.patternId)

  const firstTryCorrect = items.filter((i) => i.firstTryCorrect).length
  return {
    sessionId: session.id,
    startedAt: session.startedAt,
    endedAt: session.endedAt,
    items,
    total: items.length,
    firstTryCorrect,
    accuracy: items.length === 0 ? 0 : firstTryCorrect / items.length,
    patternStats,
    weakest,
  }
}

export function summaryToMarkdown(s: Summary, patterns: ReadonlyMap<string, Pattern>): string {
  const name = (id: string) => patterns.get(id)?.name ?? id
  const date = new Date(s.startedAt).toISOString().slice(0, 10)
  const lines: string[] = []
  lines.push(`# Session ${date}`, '')
  lines.push(`${s.firstTryCorrect}/${s.total} first try (${Math.round(s.accuracy * 100)}%)`, '')
  if (s.weakest.length) {
    lines.push(`Weakest: ${s.weakest.map(name).join(', ')}`, '')
  }
  for (const it of s.items) {
    const mark = it.firstTryCorrect ? '✅' : '❌'
    const due =
      it.nextDue === null ? '' : ` · next ${new Date(it.nextDue).toISOString().slice(0, 10)}`
    lines.push(`- ${mark} [${it.title}](${it.leetcodeUrl}) — ${name(it.primaryPattern)}${due}`)
    if (!it.firstTryCorrect) {
      lines.push(`  - picked: ${it.wrongPicks.map(name).join(', ')}`)
      lines.push(`  - ${it.why}`)
    }
  }
  return lines.join('\n') + '\n'
}
