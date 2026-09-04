import type { State } from 'ts-fsrs'

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

/** A solution pattern, e.g. "sliding-window". */
export interface Pattern {
  id: string
  name: string
  /** Coarse grouping, e.g. the NeetCode category. Used to pick plausible distractors. */
  family: string
  /** One line: when to reach for this pattern. */
  blurb: string
  /** Patterns people commonly confuse with this one. Preferred distractors. */
  confusableWith: string[]
}

export interface Explanation {
  /** Key insight: why the primary pattern fits. */
  why: string
  /** patternId -> why that pattern does not fit (or is worse). */
  whyNot: Record<string, string>
  complexity: string
}

export interface Problem {
  id: string
  title: string
  leetcodeUrl: string
  neetcodeUrl?: string
  difficulty: Difficulty
  /** Curated lists this problem belongs to, e.g. ["blind75", "neetcode150"]. */
  lists: string[]
  /** Valid patterns. patterns[0] is the primary and the only one shown as correct. */
  patterns: string[]
  /** Distractors that must be offered when possible. */
  pinnedDistractors?: string[]
  /** Our own paraphrase of the task. Never LeetCode's text. */
  prompt: string
  explanation: Explanation
}

export type CardKind = 'pattern-mcq' | 'concept-mcq' | 'free-recall'

export interface Card {
  id: string
  deckId: string
  kind: CardKind
  /** Problem id or concept id. */
  ref: string
  /** Curriculum order for introducing new cards. */
  order: number
}

/** FSRS grade. 1 = Again, 2 = Hard, 3 = Good, 4 = Easy. */
export type Grade = 1 | 2 | 3 | 4

/** Per-card scheduling state. Times are epoch milliseconds so it serialises cleanly. */
export interface CardState {
  cardId: string
  due: number
  stability: number
  difficulty: number
  scheduledDays: number
  learningSteps: number
  reps: number
  lapses: number
  state: State
  lastReview: number | null
}

export interface StateSnapshot {
  state: State
  due: number
  stability: number
  difficulty: number
}

export interface ReviewLog {
  id: string
  cardId: string
  sessionId: string
  ts: number
  rating: Grade
  correct: boolean
  /** Option chosen, if multiple choice. */
  chosen: string | null
  elapsedMs: number
  /** True when this was a same-session re-ask of a missed card. */
  retry: boolean
  /** True when this review changed the FSRS state. Retries never do. */
  scheduled: boolean
  before: StateSnapshot | null
  after: StateSnapshot | null
}

export interface Session {
  id: string
  deckId: string
  startedAt: number
  endedAt: number | null
  plannedSize: number
  cardIds: string[]
}

export interface Settings {
  sessionSize: number
  newPerDay: number
  desiredRetention: number
  /** How many times a missed card is re-asked within the same session. */
  maxRetries: number
}

export const DEFAULT_SETTINGS: Settings = {
  sessionSize: 20,
  newPerDay: 10,
  desiredRetention: 0.9,
  maxRetries: 2,
}
