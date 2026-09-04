/**
 * Seed problem stubs from the NeetCode 150 list. Never overwrites an existing file.
 *   npm run ingest -w @recall/content
 */
import { access, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { CONTENT_ROOT } from '../src/load.ts'

const SOURCE = 'https://raw.githubusercontent.com/krmanik/Anki-NeetCode/main/neetcode-150-list.json'

type Entry = { nurl: string; url: string; difficulty: string }
const res = await fetch(SOURCE)
if (!res.ok) throw new Error(`fetch failed: ${res.status}`)
const data = (await res.json()) as Record<string, Record<string, Entry>>

async function exists(file: string): Promise<boolean> {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

async function ingest(family: string, title: string, e: Entry, order: number): Promise<boolean> {
  const slug = /leetcode\.com\/problems\/([a-z0-9-]+)\/?/.exec(e.url)?.[1]
  if (!slug) throw new Error(`no slug in ${e.url}`)
  const file = path.join(CONTENT_ROOT, 'leetcode', `${slug}.md`)
  if (await exists(file)) return false
  const md = `---
id: ${slug}
title: ${JSON.stringify(title)}
leetcode: https://leetcode.com/problems/${slug}/
neetcode: ${e.nurl}
difficulty: ${e.difficulty}
family: ${JSON.stringify(family)}
order: ${order}
lists: [neetcode150]
patterns: []
---

## Prompt

## Why

## Why not

## Complexity
`
  await writeFile(file, md)
  return true
}

const results = await Promise.all(
  Object.entries(data).flatMap(([family, problems]) =>
    Object.entries(problems).map(([title, e], i) => ingest(family, title, e, i)),
  ),
)
console.log(`created ${results.filter(Boolean).length} stub(s)`)
