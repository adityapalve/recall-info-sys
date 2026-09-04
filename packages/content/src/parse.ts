import { parse as parseYaml } from 'yaml'
import type { Difficulty, Pattern, Problem } from '@recall/engine'

const DIFFICULTIES = new Set<string>(['Easy', 'Medium', 'Hard'])

export interface ProblemFrontmatter {
  id: string
  title: string
  leetcode: string
  neetcode?: string
  difficulty: Difficulty
  family: string
  lists: string[]
  patterns: string[]
  pinnedDistractors?: string[]
}

export interface ParsedProblem extends Problem {
  family: string
  /** Position within the family, following the NeetCode list order. */
  order: number
}

export class ContentError extends Error {
  readonly file: string
  constructor(file: string, message: string) {
    super(`${file}: ${message}`)
    this.file = file
  }
}

export function parsePatterns(text: string): Pattern[] {
  const raw = parseYaml(text) as unknown
  if (!Array.isArray(raw)) throw new Error('patterns.yaml must be a list')
  return raw.map((p, i) => {
    const o = asRecord(p, `patterns[${i}]`)
    return {
      id: str(o, 'id', `patterns[${i}]`),
      name: str(o, 'name', `patterns[${i}]`),
      family: str(o, 'family', `patterns[${i}]`),
      blurb: str(o, 'blurb', `patterns[${i}]`),
      confusableWith: strList(o, 'confusableWith', `patterns[${i}]`),
    }
  })
}

/** Split `---\nyaml\n---\nbody` into its parts. */
export function splitFrontmatter(text: string, file: string): { front: string; body: string } {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text)
  if (!m) throw new ContentError(file, 'missing frontmatter')
  return { front: m[1] ?? '', body: m[2] ?? '' }
}

/** Split the markdown body on `## Heading` lines into a heading -> text map. */
export function splitSections(body: string): Map<string, string> {
  const out = new Map<string, string>()
  let current: string | null = null
  const buf: string[] = []
  const flush = () => {
    if (current !== null) out.set(current, buf.join('\n').trim())
    buf.length = 0
  }
  for (const line of body.split(/\r?\n/)) {
    const h = /^##\s+(.+?)\s*$/.exec(line)
    if (h) {
      flush()
      current = (h[1] ?? '').toLowerCase()
    } else {
      buf.push(line)
    }
  }
  flush()
  return out
}

/** `- pattern-id: text` bullets, possibly wrapping onto indented lines. */
export function parseWhyNot(text: string, file: string): Record<string, string> {
  const out: Record<string, string> = {}
  let key: string | null = null
  for (const line of text.split('\n')) {
    const m = /^-\s+([a-z0-9-]+):\s*(.*)$/.exec(line)
    if (m) {
      key = m[1] ?? null
      if (key) out[key] = (m[2] ?? '').trim()
    } else if (key && line.trim() !== '') {
      out[key] = `${out[key] ?? ''} ${line.trim()}`.trim()
    } else if (line.trim() !== '') {
      throw new ContentError(file, `unparseable "Why not" line: ${line}`)
    }
  }
  return out
}

export function parseProblem(text: string, file: string): ParsedProblem {
  const { front, body } = splitFrontmatter(text, file)
  const fm = asRecord(parseYaml(front), file)
  const sections = splitSections(body)
  const need = (name: string) => {
    const s = sections.get(name)
    if (s === undefined || s === '') throw new ContentError(file, `missing "## ${name}" section`)
    return s
  }

  const difficulty = str(fm, 'difficulty', file)
  if (!DIFFICULTIES.has(difficulty)) throw new ContentError(file, `bad difficulty ${difficulty}`)

  const problem: ParsedProblem = {
    id: str(fm, 'id', file),
    title: str(fm, 'title', file),
    leetcodeUrl: str(fm, 'leetcode', file),
    difficulty: difficulty as Difficulty,
    family: str(fm, 'family', file),
    order: typeof fm['order'] === 'number' ? fm['order'] : Number.MAX_SAFE_INTEGER,
    lists: strList(fm, 'lists', file),
    patterns: strList(fm, 'patterns', file),
    prompt: need('prompt'),
    explanation: {
      why: need('why'),
      whyNot: parseWhyNot(sections.get('why not') ?? '', file),
      complexity: need('complexity'),
    },
  }
  if (typeof fm['neetcode'] === 'string') problem.neetcodeUrl = fm['neetcode']
  if (fm['pinnedDistractors'] !== undefined) {
    problem.pinnedDistractors = strList(fm, 'pinnedDistractors', file)
  }
  return problem
}

function asRecord(v: unknown, where: string): Record<string, unknown> {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) {
    throw new Error(`${where}: expected a mapping`)
  }
  return v as Record<string, unknown>
}

function str(o: Record<string, unknown>, key: string, where: string): string {
  const v = o[key]
  if (typeof v !== 'string' || v === '')
    throw new Error(`${where}: "${key}" must be a non-empty string`)
  return v
}

function strList(o: Record<string, unknown>, key: string, where: string): string[] {
  const v = o[key]
  if (v === undefined || v === null) return []
  if (!Array.isArray(v) || !v.every((x) => typeof x === 'string')) {
    throw new Error(`${where}: "${key}" must be a list of strings`)
  }
  return v as string[]
}
