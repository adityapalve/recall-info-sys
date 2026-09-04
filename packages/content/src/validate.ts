import { makeQuestion, seededRng, type Pattern } from '@recall/engine'
import type { ParsedProblem } from './parse.ts'

/** Returns a list of human-readable problems; empty means valid. */
export function validate(patterns: Pattern[], problems: ParsedProblem[]): string[] {
  const errors: string[] = []
  const pmap = new Map(patterns.map((p) => [p.id, p]))

  const seenPattern = new Set<string>()
  for (const p of patterns) {
    if (seenPattern.has(p.id)) errors.push(`duplicate pattern id ${p.id}`)
    seenPattern.add(p.id)
    for (const c of p.confusableWith) {
      if (!pmap.has(c)) errors.push(`pattern ${p.id}: unknown confusableWith ${c}`)
      if (c === p.id) errors.push(`pattern ${p.id}: confusable with itself`)
    }
  }

  const seenProblem = new Set<string>()
  const families = new Set(patterns.map((p) => p.family))
  for (const pr of problems) {
    const at = `problem ${pr.id}`
    if (seenProblem.has(pr.id)) errors.push(`${at}: duplicate id`)
    seenProblem.add(pr.id)
    if (pr.patterns.length === 0) errors.push(`${at}: no patterns`)
    for (const id of pr.patterns) if (!pmap.has(id)) errors.push(`${at}: unknown pattern ${id}`)
    if (new Set(pr.patterns).size !== pr.patterns.length) errors.push(`${at}: repeated pattern`)
    for (const id of pr.pinnedDistractors ?? []) {
      if (!pmap.has(id)) errors.push(`${at}: unknown pinned distractor ${id}`)
      if (pr.patterns.includes(id)) errors.push(`${at}: pinned distractor ${id} is a valid pattern`)
    }
    // whyNot may cover secondary valid patterns (shown as "also works, but…"),
    // never the primary.
    for (const id of Object.keys(pr.explanation.whyNot)) {
      if (!pmap.has(id)) errors.push(`${at}: whyNot for unknown pattern ${id}`)
      if (id === pr.patterns[0]) errors.push(`${at}: whyNot for the primary pattern ${id}`)
    }
    if (!families.has(pr.family)) errors.push(`${at}: family "${pr.family}" has no patterns`)
    if (!/^https:\/\/leetcode\.com\/problems\/[a-z0-9-]+\/$/.test(pr.leetcodeUrl)) {
      errors.push(`${at}: odd leetcode url ${pr.leetcodeUrl}`)
    }
    if (pr.prompt.length < 40) errors.push(`${at}: prompt too short`)
    if (pr.explanation.why.length < 40) errors.push(`${at}: "why" too short`)
    if (Object.keys(pr.explanation.whyNot).length < 2)
      errors.push(`${at}: fewer than 2 "why not" entries`)
    if (pr.patterns.every((id) => pmap.has(id))) {
      try {
        makeQuestion(pr, pmap, seededRng(1))
      } catch (e) {
        errors.push(`${at}: ${(e as Error).message}`)
      }
    }
  }
  return errors
}
