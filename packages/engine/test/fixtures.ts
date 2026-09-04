import type { Card, Pattern, Problem } from '../src/types.ts'

export const PATTERNS: Pattern[] = [
  {
    id: 'hash-map',
    name: 'Hash Map',
    family: 'Arrays & Hashing',
    blurb: '',
    confusableWith: ['two-pointers'],
  },
  {
    id: 'prefix-sum',
    name: 'Prefix Sum',
    family: 'Arrays & Hashing',
    blurb: '',
    confusableWith: ['sliding-window'],
  },
  { id: 'sorting', name: 'Sorting', family: 'Arrays & Hashing', blurb: '', confusableWith: [] },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    family: 'Two Pointers',
    blurb: '',
    confusableWith: ['sliding-window', 'hash-map'],
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    family: 'Sliding Window',
    blurb: '',
    confusableWith: ['two-pointers', 'prefix-sum'],
  },
  {
    id: 'monotonic-stack',
    name: 'Monotonic Stack',
    family: 'Stack',
    blurb: '',
    confusableWith: ['stack'],
  },
  { id: 'stack', name: 'Stack', family: 'Stack', blurb: '', confusableWith: ['monotonic-stack'] },
  {
    id: 'binary-search',
    name: 'Binary Search',
    family: 'Binary Search',
    blurb: '',
    confusableWith: ['two-pointers'],
  },
  { id: 'dp-1d', name: '1-D DP', family: 'DP', blurb: '', confusableWith: ['greedy'] },
  { id: 'greedy', name: 'Greedy', family: 'Greedy', blurb: '', confusableWith: ['dp-1d'] },
]

export const patternMap = new Map(PATTERNS.map((p) => [p.id, p]))

function problem(id: string, patterns: string[], extra: Partial<Problem> = {}): Problem {
  return {
    id,
    title: id.replace(/-/g, ' '),
    leetcodeUrl: `https://leetcode.com/problems/${id}/`,
    difficulty: 'Medium',
    lists: ['neetcode150'],
    patterns,
    prompt: `prompt for ${id}`,
    explanation: {
      why: `why ${id}`,
      whyNot: Object.fromEntries(
        PATTERNS.filter((p) => !patterns.includes(p.id)).map((p) => [
          p.id,
          `not ${p.id} for ${id}`,
        ]),
      ),
      complexity: 'O(n)',
    },
    ...extra,
  }
}

export const PROBLEMS: Problem[] = [
  problem('two-sum', ['hash-map']),
  problem('trapping-rain-water', ['two-pointers', 'monotonic-stack'], {
    pinnedDistractors: ['sliding-window'],
  }),
  problem('longest-substring', ['sliding-window']),
  problem('daily-temperatures', ['monotonic-stack']),
  problem('coin-change', ['dp-1d']),
  problem('jump-game', ['greedy', 'dp-1d']),
]

export const problemMap = new Map(PROBLEMS.map((p) => [p.id, p]))

export const CARDS: Card[] = PROBLEMS.map((p, i) => ({
  id: `lc:${p.id}`,
  deckId: 'leetcode',
  kind: 'pattern-mcq',
  ref: p.id,
  order: i,
}))

export const cardMap = new Map(CARDS.map((c) => [c.id, c]))

export const DAY = 24 * 60 * 60 * 1000
export const T0 = Date.UTC(2026, 8, 4, 9, 0, 0)

export function counter(prefix = 'id'): () => string {
  let n = 0
  return () => `${prefix}-${++n}`
}
