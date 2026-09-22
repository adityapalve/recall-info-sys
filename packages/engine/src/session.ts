import { makeQuestion, type Question } from './question.ts'
import type { Rng } from './rng.ts'
import type { Scheduler } from './scheduler.ts'
import type { Card, CardState, Grade, Pattern, Problem, ReviewLog, Session } from './types.ts'

export interface BuildSessionInput {
  cards: readonly Card[]
  states: ReadonlyMap<string, CardState>
  scheduler: Scheduler
  now: number
  /**
   * Cards due before this instant count as due. Pass the end of the local day
   * so a card reviewed at 9:05 yesterday is due at 9:00 today. Defaults to now.
   */
  horizon?: number
  /** Total cards wanted. */
  size: number
  /** Max new cards per day. */
  newCap: number
  /** New cards already introduced today. */
  newSeenToday: number
}

export interface BuildSessionResult {
  cardIds: string[]
  dueCount: number
  newCount: number
}

/**
 * Pick cards for a session: due cards first, least likely to be remembered
 * first; then new cards in curriculum order, subject to the daily cap.
 */
export function buildSession(input: BuildSessionInput): BuildSessionResult {
  const { cards, states, scheduler, now, size, newCap, newSeenToday } = input
  const horizon = input.horizon ?? now

  const due = cards
    .map((c) => ({ c, s: states.get(c.id) }))
    .filter(
      (x): x is { c: Card; s: CardState } => x.s !== undefined && scheduler.isDue(x.s, horizon),
    )
    .map((x) => ({ c: x.c, r: scheduler.retrievability(x.s, now), due: x.s.due }))
    .toSorted((a, b) => a.r - b.r || a.due - b.due)
    .slice(0, size)
    .map((x) => x.c.id)

  const newBudget = Math.max(0, Math.min(newCap - newSeenToday, size - due.length))
  const fresh = cards
    .filter((c) => !states.has(c.id))
    .toSorted((a, b) => a.order - b.order)
    .slice(0, newBudget)
    .map((c) => c.id)

  return { cardIds: [...due, ...fresh], dueCount: due.length, newCount: fresh.length }
}

export interface RunnerDeps {
  scheduler: Scheduler
  cards: ReadonlyMap<string, Card>
  problems: ReadonlyMap<string, Problem>
  patterns: ReadonlyMap<string, Pattern>
  rng: Rng
  now: () => number
  newId: () => string
  /** Same-session re-asks per missed card. */
  maxRetries: number
}

export interface Feedback {
  cardId: string
  question: Question
  problem: Problem
  chosen: string
  correct: boolean
  retry: boolean
  /** Why the chosen option is wrong, when we have text for it. */
  whyNotChosen: string | null
}

export interface Progress {
  /** Scheduled cards answered so far. */
  answered: number
  /** Scheduled cards in the session. */
  total: number
  /** Re-asks still queued. */
  retriesPending: number
}

interface QueueItem {
  cardId: string
  retry: boolean
}

/**
 * Drives one session card by card.
 *
 *   const q = runner.current()      // show question
 *   const fb = runner.answer(id, ms) // show feedback; if correct, ask Hard/Good/Easy
 *   runner.commit(rating)           // apply grade, advance
 *
 * The first time a card is shown in a session its grade updates FSRS. A miss
 * pushes the card to the back of the queue; those re-asks are logged but never
 * change scheduling, so one bad session doesn't compound.
 */
export class SessionRunner {
  readonly session: Session
  readonly states: Map<string, CardState>
  readonly logs: ReviewLog[] = []

  private readonly deps: RunnerDeps
  private readonly queue: QueueItem[]
  private readonly retries = new Map<string, number>()
  private readonly total: number
  private answeredCount = 0
  private currentQuestion: Question | null = null
  private pending: Feedback | null = null

  constructor(session: Session, states: ReadonlyMap<string, CardState>, deps: RunnerDeps) {
    this.deps = deps
    this.session = session
    this.states = new Map(states)
    this.queue = session.cardIds.map((cardId) => ({ cardId, retry: false }))
    this.total = session.cardIds.length
  }

  /** Stage changes without advancing the live runner until persistence succeeds. */
  fork(): SessionRunner {
    const copy = new SessionRunner(structuredClone(this.session), this.states, this.deps)
    copy.queue.splice(0, copy.queue.length, ...this.queue.map((item) => ({ ...item })))
    for (const [id, count] of this.retries) copy.retries.set(id, count)
    copy.logs.push(...this.logs)
    copy.answeredCount = this.answeredCount
    copy.currentQuestion = this.currentQuestion
    copy.pending = this.pending
    copy.pendingElapsed = this.pendingElapsed
    return copy
  }

  get isDone(): boolean {
    return this.queue.length === 0 && this.pending === null
  }

  progress(): Progress {
    return {
      answered: this.answeredCount,
      total: this.total,
      retriesPending: this.queue.filter((q) => q.retry).length,
    }
  }

  /** The question to show now, or null when the session is over. */
  current(): Question | null {
    if (this.pending) return this.pending.question
    const head = this.queue[0]
    if (!head) return null
    if (!this.currentQuestion) {
      const card = this.mustCard(head.cardId)
      const problem = this.deps.problems.get(card.ref)
      if (!problem) throw new Error(`no problem for card ${card.id}`)
      this.currentQuestion = makeQuestion(problem, this.deps.patterns, this.deps.rng)
    }
    return this.currentQuestion
  }

  answer(chosen: string, elapsedMs: number): Feedback {
    if (this.pending) throw new Error('answer already given; call commit()')
    const question = this.current()
    const head = this.queue[0]
    if (!question || !head) throw new Error('session is over')
    const problem = this.deps.problems.get(question.problemId)
    if (!problem) throw new Error(`no problem ${question.problemId}`)
    const correct = chosen === question.correctId
    this.pending = {
      cardId: head.cardId,
      question,
      problem,
      chosen,
      correct,
      retry: head.retry,
      whyNotChosen: correct ? null : (problem.explanation.whyNot[chosen] ?? null),
    }
    this.pendingElapsed = elapsedMs
    return this.pending
  }
  private pendingElapsed = 0

  /**
   * Apply the grade for the pending answer and advance.
   * A wrong answer is always Again; `rating` is ignored. A right answer needs
   * Hard/Good/Easy and defaults to Good.
   */
  commit(rating?: Grade): ReviewLog {
    const fb = this.pending
    if (!fb) throw new Error('nothing to commit; call answer() first')
    const head = this.queue.shift()
    if (!head) throw new Error('queue empty with a pending answer')
    const grade: Grade = fb.correct ? (rating ?? 3) : 1
    const now = this.deps.now()
    const scheduled = !head.retry

    let before = null
    let after = null
    if (scheduled) {
      const prev = this.states.get(head.cardId) ?? this.deps.scheduler.newState(head.cardId, now)
      const res = this.deps.scheduler.grade(prev, grade, now)
      this.states.set(head.cardId, res.state)
      before = res.before
      after = res.after
      this.answeredCount++
    }

    const log: ReviewLog = {
      id: this.deps.newId(),
      cardId: head.cardId,
      sessionId: this.session.id,
      ts: now,
      rating: grade,
      correct: fb.correct,
      chosen: fb.chosen,
      elapsedMs: this.pendingElapsed,
      retry: head.retry,
      scheduled,
      before,
      after,
    }
    this.logs.push(log)

    if (!fb.correct) {
      const n = this.retries.get(head.cardId) ?? 0
      if (n < this.deps.maxRetries) {
        this.retries.set(head.cardId, n + 1)
        this.queue.push({ cardId: head.cardId, retry: true })
      }
    }

    this.pending = null
    this.currentQuestion = null
    if (this.isDone) this.session.endedAt = now
    return log
  }

  private mustCard(id: string): Card {
    const c = this.deps.cards.get(id)
    if (!c) throw new Error(`unknown card ${id}`)
    return c
  }
}
