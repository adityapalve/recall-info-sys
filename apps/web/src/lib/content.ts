import type { Card, Pattern, Problem } from '@recall/engine'

export interface Deck {
  id: string
  name: string
  patterns: Pattern[]
  problems: (Problem & { family: string })[]
  cards: Card[]
}

export interface Manifest {
  version: string
  builtAt: string
  decks: { id: string; file: string; cards: number }[]
}

export interface Content {
  version: string
  deck: Deck
  patterns: Map<string, Pattern>
  problems: Map<string, Deck['problems'][number]>
  cards: Map<string, Card>
}

export async function loadContent(): Promise<Content> {
  const manifest = (await fetchJson('/content/manifest.json')) as Manifest
  const entry = manifest.decks[0]
  if (!entry) throw new Error('manifest has no decks')
  const deck = (await fetchJson(`/content/${entry.file}`)) as Deck
  return {
    version: manifest.version,
    deck,
    patterns: new Map(deck.patterns.map((p) => [p.id, p])),
    problems: new Map(deck.problems.map((p) => [p.id, p])),
    cards: new Map(deck.cards.map((c) => [c.id, c])),
  }
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${url}: ${res.status}`)
  return res.json()
}
