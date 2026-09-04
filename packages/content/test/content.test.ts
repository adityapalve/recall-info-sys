import { describe, expect, it } from 'vitest'
import { makeQuestion, seededRng } from '@recall/engine'
import { loadContent } from '../src/load.ts'
import { parseProblem, parseWhyNot, splitSections } from '../src/parse.ts'
import { validate } from '../src/validate.ts'

const content = await loadContent()
const pmap = new Map(content.patterns.map((p) => [p.id, p]))

describe('real content', () => {
  it('has 150 NeetCode problems and 75 Blind 75 problems', () => {
    expect(content.problems).toHaveLength(150)
    expect(content.problems.filter((p) => p.lists.includes('blind75'))).toHaveLength(75)
    expect(content.problems.every((p) => p.lists.includes('neetcode150'))).toBe(true)
  })

  it('passes validation', () => {
    expect(validate(content.patterns, content.problems)).toEqual([])
  })

  it('every pattern is valid for at least one problem (no dead taxonomy entries)', () => {
    const used = new Set(content.problems.flatMap((p) => p.patterns))
    const unused = content.patterns.map((p) => p.id).filter((id) => !used.has(id))
    expect(unused).toEqual([])
  })

  it('builds a 4-option question for every problem under many seeds', () => {
    for (const p of content.problems) {
      for (let seed = 0; seed < 5; seed++) {
        const q = makeQuestion(p, pmap, seededRng(seed))
        expect(q.options).toHaveLength(4)
        expect(q.options.filter((o) => o.id === q.correctId)).toHaveLength(1)
        for (const o of q.options) expect(p.patterns.slice(1)).not.toContain(o.id)
      }
    }
  })

  it('has a "why not" for every pinned distractor', () => {
    for (const p of content.problems) {
      for (const d of p.pinnedDistractors ?? []) {
        expect(p.explanation.whyNot, `${p.id} / ${d}`).toHaveProperty(d)
      }
    }
  })

  it('orders cards by NeetCode family, then NeetCode list order', () => {
    expect(content.cards.slice(0, 4).map((c) => c.ref)).toEqual([
      'contains-duplicate',
      'valid-anagram',
      'two-sum',
      'group-anagrams',
    ])
    expect(content.cards.at(-1)?.ref).toBe('reverse-integer')
    expect(content.cards.map((c) => c.order)).toEqual(content.cards.map((_, i) => i))
  })
})

describe('parser', () => {
  const sample = `---
id: two-sum
title: "Two Sum"
leetcode: https://leetcode.com/problems/two-sum/
difficulty: Easy
family: "Arrays & Hashing"
lists: [blind75, neetcode150]
patterns: [hash-map, sorting]
pinnedDistractors: [two-pointers]
---

## Prompt

Find two indices whose values sum to a target in an unsorted array of integers.

## Why

Complement lookup in a map makes each step O(1), so a single pass over the array is enough.

## Why not

- two-pointers: needs sorted input,
  which loses indices.
- binary-search: O(n log n).

## Complexity

O(n) time.
`

  it('parses frontmatter and sections', () => {
    const p = parseProblem(sample, 'x.md')
    expect(p).toMatchObject({
      id: 'two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      family: 'Arrays & Hashing',
      lists: ['blind75', 'neetcode150'],
      patterns: ['hash-map', 'sorting'],
      pinnedDistractors: ['two-pointers'],
    })
    expect(p.neetcodeUrl).toBeUndefined()
    expect(p.explanation.whyNot).toEqual({
      'two-pointers': 'needs sorted input, which loses indices.',
      'binary-search': 'O(n log n).',
    })
    expect(p.explanation.complexity).toBe('O(n) time.')
  })

  it('rejects missing sections and bad difficulty', () => {
    expect(() => parseProblem(sample.replace('## Why\n', '## Whatever\n'), 'x.md')).toThrow(
      /missing "## why"/,
    )
    expect(() => parseProblem(sample.replace('Easy', 'Trivial'), 'x.md')).toThrow(/bad difficulty/)
    expect(() => parseProblem('no frontmatter', 'x.md')).toThrow(/frontmatter/)
  })

  it('splitSections is case-insensitive on headings', () => {
    const s = splitSections('## Prompt\na\n\n## WHY NOT\nb')
    expect([...s.keys()]).toEqual(['prompt', 'why not'])
  })

  it('parseWhyNot rejects stray lines', () => {
    expect(() => parseWhyNot('stray text', 'x.md')).toThrow(/unparseable/)
  })

  it('validate catches broken references', () => {
    const bad = { ...content.problems[0]!, patterns: ['nope'], pinnedDistractors: ['hash-map'] }
    const errors = validate(content.patterns, [bad])
    expect(errors.some((e) => e.includes('unknown pattern nope'))).toBe(true)
  })
})
