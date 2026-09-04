import { describe, expect, it } from 'vitest'
import { makeQuestion } from '../src/question.ts'
import { seededRng } from '../src/rng.ts'
import { PROBLEMS, patternMap, problemMap } from './fixtures.ts'

const get = (id: string) => {
  const p = problemMap.get(id)
  if (!p) throw new Error(id)
  return p
}

describe('makeQuestion', () => {
  it('offers 4 distinct options including exactly the primary pattern', () => {
    for (const p of PROBLEMS) {
      const q = makeQuestion(p, patternMap, seededRng(1))
      expect(q.options).toHaveLength(4)
      expect(new Set(q.options.map((o) => o.id)).size).toBe(4)
      expect(q.options.map((o) => o.id)).toContain(p.patterns[0])
      expect(q.correctId).toBe(p.patterns[0])
    }
  })

  it('never offers a secondary valid pattern as a distractor', () => {
    const p = get('trapping-rain-water')
    for (let seed = 0; seed < 50; seed++) {
      const q = makeQuestion(p, patternMap, seededRng(seed))
      expect(q.options.map((o) => o.id)).not.toContain('monotonic-stack')
    }
    expect(makeQuestion(p, patternMap, seededRng(1)).alsoValid).toEqual(['monotonic-stack'])
  })

  it('always includes pinned distractors', () => {
    const p = get('trapping-rain-water')
    for (let seed = 0; seed < 50; seed++) {
      const q = makeQuestion(p, patternMap, seededRng(seed))
      expect(q.options.map((o) => o.id)).toContain('sliding-window')
    }
  })

  it('prefers confusable patterns over random ones', () => {
    const p = get('longest-substring') // sliding-window, confusable with two-pointers, prefix-sum
    for (let seed = 0; seed < 50; seed++) {
      const ids = makeQuestion(p, patternMap, seededRng(seed)).options.map((o) => o.id)
      expect(ids).toContain('two-pointers')
      expect(ids).toContain('prefix-sum')
    }
  })

  it('is deterministic for a given seed and varies across seeds', () => {
    const p = get('two-sum')
    const a = makeQuestion(p, patternMap, seededRng(7)).options.map((o) => o.id)
    const b = makeQuestion(p, patternMap, seededRng(7)).options.map((o) => o.id)
    expect(a).toEqual(b)
    const orders = new Set<string>()
    for (let seed = 0; seed < 20; seed++) {
      orders.add(
        makeQuestion(p, patternMap, seededRng(seed))
          .options.map((o) => o.id)
          .join(','),
      )
    }
    expect(orders.size).toBeGreaterThan(1)
  })

  it('throws when the taxonomy is too small', () => {
    const tiny = new Map([...patternMap].slice(0, 3))
    expect(() => makeQuestion(get('two-sum'), tiny, seededRng(1))).toThrow(/not enough/)
  })
})
