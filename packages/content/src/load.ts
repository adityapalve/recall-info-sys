import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Card, Pattern } from '@recall/engine'
import { parsePatterns, parseProblem, type ParsedProblem } from './parse.ts'

export const CONTENT_ROOT = path.resolve(import.meta.dirname, '..')

export interface LoadedContent {
  patterns: Pattern[]
  problems: ParsedProblem[]
  cards: Card[]
}

/** Curriculum order for new cards follows the NeetCode category order, then file order within it. */
export const FAMILY_ORDER = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees',
  'Heap / Priority Queue',
  'Backtracking',
  'Tries',
  'Graphs',
  'Advanced Graphs',
  '1-D Dynamic Programming',
  '2-D Dynamic Programming',
  'Greedy',
  'Intervals',
  'Math & Geometry',
  'Bit Manipulation',
]

export async function loadContent(root = CONTENT_ROOT): Promise<LoadedContent> {
  const patterns = parsePatterns(await readFile(path.join(root, 'patterns.yaml'), 'utf8'))
  const dir = path.join(root, 'leetcode')
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md')).toSorted()
  const problems = await Promise.all(
    files.map(async (f) =>
      parseProblem(await readFile(path.join(dir, f), 'utf8'), `leetcode/${f}`),
    ),
  )
  const rank = (p: ParsedProblem) => {
    const i = FAMILY_ORDER.indexOf(p.family)
    return i === -1 ? FAMILY_ORDER.length : i
  }
  const ordered = problems.toSorted(
    (a, b) => rank(a) - rank(b) || a.order - b.order || a.id.localeCompare(b.id),
  )
  const cards: Card[] = ordered.map((p, i) => ({
    id: `lc:${p.id}`,
    deckId: 'leetcode',
    kind: 'pattern-mcq',
    ref: p.id,
    order: i,
  }))
  return { patterns, problems: ordered, cards }
}
