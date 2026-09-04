/**
 * Parse + validate every content file and write JSON for the app.
 *   npm run build -w @recall/content [-- --out <dir>]
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { CONTENT_ROOT, loadContent } from '../src/load.ts'
import { validate } from '../src/validate.ts'

const outArg = process.argv.indexOf('--out')
const outDir =
  outArg === -1 ? path.join(CONTENT_ROOT, 'dist') : path.resolve(process.argv[outArg + 1] ?? 'dist')

const { patterns, problems, cards } = await loadContent()
const errors = validate(patterns, problems)
if (errors.length) {
  console.error(`${errors.length} content error(s):`)
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}

await mkdir(outDir, { recursive: true })
const deck = { id: 'leetcode', name: 'LeetCode patterns', patterns, problems, cards }
const deckJson = JSON.stringify(deck)
const version = createHash('sha256').update(deckJson).digest('hex').slice(0, 12)
await writeFile(path.join(outDir, 'leetcode.json'), deckJson)
await writeFile(
  path.join(outDir, 'manifest.json'),
  JSON.stringify(
    {
      version,
      builtAt: new Date().toISOString(),
      decks: [{ id: 'leetcode', file: 'leetcode.json', cards: cards.length }],
    },
    null,
    2,
  ),
)
console.log(
  `built ${problems.length} problems, ${patterns.length} patterns -> ${path.relative(process.cwd(), outDir)} (version ${version})`,
)
