import { createEmptyCard, fsrs, generatorParameters, State, type Card as FsrsCard } from 'ts-fsrs'
import type { CardState, Grade, StateSnapshot } from './types.ts'

export interface SchedulerOptions {
  /** Target probability of recall at review time. Default 0.9. */
  desiredRetention?: number
  /** Cap on scheduled interval, in days. */
  maximumIntervalDays?: number
  /** Randomise long intervals slightly so cards don't clump. */
  enableFuzz?: boolean
  /** Optimised FSRS weights, once you have enough reviews to fit them. */
  weights?: readonly number[]
}

export interface GradeResult {
  state: CardState
  before: StateSnapshot
  after: StateSnapshot
  /** Days until the next review, as scheduled. */
  intervalDays: number
}

export interface Scheduler {
  /** Fresh state for a card that has never been reviewed. */
  newState(cardId: string, now: number): CardState
  grade(state: CardState, rating: Grade, now: number): GradeResult
  /** Probability (0–1) that the card is recalled right now. */
  retrievability(state: CardState, now: number): number
  isDue(state: CardState, now: number): boolean
  /** Interval in days for each possible grade, without committing. */
  preview(state: CardState, now: number): Record<Grade, number>
}

const GRADES: readonly Grade[] = [1, 2, 3, 4]

export function createScheduler(opts: SchedulerOptions = {}): Scheduler {
  const params = generatorParameters({
    request_retention: opts.desiredRetention ?? 0.9,
    maximum_interval: opts.maximumIntervalDays ?? 365,
    enable_fuzz: opts.enableFuzz ?? false,
    // No learning steps: one correct answer graduates a card. Misses are
    // re-asked inside the session by the runner, not by the scheduler.
    enable_short_term: true,
    learning_steps: [],
    relearning_steps: [],
    ...(opts.weights ? { w: opts.weights } : {}),
  })
  const f = fsrs(params)

  return {
    newState(cardId, now) {
      return fromFsrs(cardId, createEmptyCard(new Date(now)))
    },
    grade(state, rating, now) {
      const { card } = f.next(toFsrs(state), new Date(now), rating)
      const next = fromFsrs(state.cardId, card)
      return {
        state: next,
        before: snapshot(state),
        after: snapshot(next),
        intervalDays: card.scheduled_days,
      }
    },
    retrievability(state, now) {
      if (state.state === State.New) return 0
      return f.get_retrievability(toFsrs(state), new Date(now), false)
    },
    isDue(state, now) {
      return state.state !== State.New && state.due <= now
    },
    preview(state, now) {
      const rec = f.repeat(toFsrs(state), new Date(now))
      const out = {} as Record<Grade, number>
      for (const g of GRADES) out[g] = rec[g].card.scheduled_days
      return out
    },
  }
}

export function snapshot(s: CardState): StateSnapshot {
  return { state: s.state, due: s.due, stability: s.stability, difficulty: s.difficulty }
}

function toFsrs(s: CardState): FsrsCard {
  const card: FsrsCard = {
    due: new Date(s.due),
    stability: s.stability,
    difficulty: s.difficulty,
    elapsed_days: 0,
    scheduled_days: s.scheduledDays,
    learning_steps: s.learningSteps,
    reps: s.reps,
    lapses: s.lapses,
    state: s.state,
  }
  if (s.lastReview !== null) card.last_review = new Date(s.lastReview)
  return card
}

function fromFsrs(cardId: string, c: FsrsCard): CardState {
  return {
    cardId,
    due: c.due.getTime(),
    stability: c.stability,
    difficulty: c.difficulty,
    scheduledDays: c.scheduled_days,
    learningSteps: c.learning_steps,
    reps: c.reps,
    lapses: c.lapses,
    state: c.state,
    lastReview: c.last_review ? c.last_review.getTime() : null,
  }
}
