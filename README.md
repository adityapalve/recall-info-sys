# Recall

Personal active-recall trainer. FSRS scheduling, tailored for LeetCode
patterns and book concepts. Authored on the Mac, reviewed on the phone.

See [docs/PLAN.md](docs/PLAN.md) for the design and [docs/DEPLOY.md](docs/DEPLOY.md) for hosting and phone install.

## Layout

```
packages/engine   pure TypeScript: FSRS wrapper, session builder, question generator, summary
packages/content  pattern taxonomy (patterns.yaml), one markdown file per problem, build + validation
apps/web          mobile-first PWA (Vite + React + Tailwind + Dexie), installable on iPhone
```

## Commands

```
npm install
npm run check     # lint + format check + typecheck + tests
npm test
npm run dev       # dev server for the app at http://localhost:5173 (rebuilds content first)
npm run build     # production build -> apps/web/dist (deploy this directory)
npm run demo      # runs three simulated days of sessions against fixture data
npm run fmt       # format everything
npm run build -w @recall/content   # validate content and write packages/content/dist/*.json
npm run ingest -w @recall/content  # add stubs for any NeetCode 150 problems missing from content/leetcode
```

## Adding or editing content

Problems live in `packages/content/leetcode/<slug>.md`: YAML frontmatter (patterns, lists,
optional pinnedDistractors) plus `## Prompt`, `## Why`, `## Why not` (one `- pattern-id: text`
bullet per wrong answer) and `## Complexity`. Patterns live in `packages/content/patterns.yaml`.
`npm run build -w @recall/content` fails loudly on any broken reference.

Tooling: oxlint, oxfmt, tsc (TypeScript 7), vitest, lefthook (pre-commit lint/format, pre-push typecheck/tests).
