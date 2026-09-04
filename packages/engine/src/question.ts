import { shuffle, type Rng } from './rng.ts'
import type { Difficulty, Pattern, Problem } from './types.ts'

export interface Question {
  problemId: string
  title: string
  difficulty: Difficulty
  prompt: string
  /** Shuffled options; exactly one is the primary pattern. */
  options: Pattern[]
  /** The primary pattern id — the one that counts as correct. */
  correctId: string
  /** Other patterns that also work; shown in feedback, never offered as options. */
  alsoValid: string[]
}

export const OPTION_COUNT = 4

/**
 * Build a multiple-choice question for a problem.
 *
 * Distractors are chosen in tiers so wrong options are plausible:
 *   1. pinnedDistractors on the problem
 *   2. confusableWith of each valid pattern
 *   3. same family as the primary pattern
 *   4. anything else
 * A pattern listed as valid for the problem is never a distractor.
 */
export function makeQuestion(
  problem: Problem,
  patterns: ReadonlyMap<string, Pattern>,
  rng: Rng,
  optionCount = OPTION_COUNT,
): Question {
  const primaryId = problem.patterns[0]
  if (primaryId === undefined) throw new Error(`problem ${problem.id} has no patterns`)
  const primary = patterns.get(primaryId)
  if (!primary) throw new Error(`problem ${problem.id}: unknown pattern ${primaryId}`)

  const valid = new Set(problem.patterns)
  const chosen: Pattern[] = []
  const taken = new Set<string>(valid)

  const take = (ids: Iterable<string>) => {
    for (const id of ids) {
      if (chosen.length >= optionCount - 1) return
      if (taken.has(id)) continue
      const p = patterns.get(id)
      if (!p) continue
      taken.add(id)
      chosen.push(p)
    }
  }

  take(shuffle(problem.pinnedDistractors ?? [], rng))
  take(
    shuffle(
      problem.patterns.flatMap((id) => patterns.get(id)?.confusableWith ?? []),
      rng,
    ),
  )
  take(
    shuffle(
      [...patterns.values()].filter((p) => p.family === primary.family).map((p) => p.id),
      rng,
    ),
  )
  take(shuffle([...patterns.keys()], rng))

  if (chosen.length < optionCount - 1) {
    throw new Error(`not enough patterns to build ${optionCount} options for ${problem.id}`)
  }

  return {
    problemId: problem.id,
    title: problem.title,
    difficulty: problem.difficulty,
    prompt: problem.prompt,
    options: shuffle([primary, ...chosen], rng),
    correctId: primary.id,
    alsoValid: problem.patterns.slice(1),
  }
}
