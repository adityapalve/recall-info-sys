# Recall

Personal active-recall trainer. FSRS scheduling, tailored for LeetCode
patterns and book concepts. Authored on the Mac, reviewed on the phone.

See [docs/PLAN.md](docs/PLAN.md) for the design.

## Layout

```
packages/engine   pure TypeScript: FSRS wrapper, session builder, question generator, summary
packages/content  (phase 1) pattern taxonomy + problem files + build script
apps/web          (phase 2) mobile-first PWA
```

## Commands

```
npm install
npm run check     # lint + format check + typecheck + tests
npm test
npm run demo      # runs three simulated days of sessions against fixture data
npm run fmt       # format everything
```

Tooling: oxlint, oxfmt, tsc (TypeScript 7), vitest, lefthook (pre-commit lint/format, pre-push typecheck/tests).
