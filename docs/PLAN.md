# Recall — design plan

> Status (2026-09-04): phases 0–2 built. Phase 3 (patterns screen, polish) and phase 4 (book mode) not started.

Personal active-recall system. Anki-style scheduling, tailored to two use cases:

1. **LeetCode mode** (v1): "which pattern solves this problem?" multiple choice.
2. **Book mode** (v2): concepts captured while reading, reviewed later.

Authoring happens on the Mac (markdown + git push). Recall happens on the phone
(bus stop, no laptop). One user, no accounts, no server to babysit.

---

## 1. Key decision: PWA, not Expo

**Decision: a mobile-first Progressive Web App, installed to the iPhone home screen.**

Why not Expo / React Native:

- A free Apple developer account can sideload a build, but the signature
  expires every 7 days and you must re-install from the Mac. TestFlight needs
  the paid account.
- Expo Go can load a published bundle, but it is a dev tool and adds a
  dependency on Expo's update service for a one-person app.
- Everything this app needs (offline storage, fast UI, home-screen icon,
  full-screen without browser chrome) a PWA does on iOS today.

Why a PWA fits the workflow:

- `git push` deploys both the app and the content. No app store, no signing.
- Installed home-screen PWAs on iOS are exempt from Safari's 7-day storage
  eviction, so progress in IndexedDB is stable. We still add JSON export as a
  backup.
- Works offline after first load (service worker caches app + content).

Escape hatch: the engine is a pure TypeScript package with no DOM or browser
dependency. If a native app is ever wanted, Expo can wrap the same engine.

## 2. Architecture

```
  Mac (authoring)                     GitHub / Cloudflare Pages          iPhone (recall)
  ─────────────────                   ─────────────────────────          ───────────────
  content/                 build      apps/web/dist/                     PWA (home screen)
    patterns.yaml     ──────────►       index.html, app.js      ───────►   fetches content manifest
    problems/*.md      npm run build       content/manifest.json               caches via service worker
    books/*.md                          content/leetcode.json              engine runs on-device
                                                                           progress in IndexedDB
  git push ──────────► CI deploy ───────────────────────────────────►      export/import JSON backup
```

Three parts, one npm workspace:

| Package            | What it is                                                                                                     | Depends on |
| ------------------ | -------------------------------------------------------------------------------------------------------------- | ---------- |
| `packages/engine`  | Pure TS. FSRS wrapper, session builder, question/distractor generator, summary. Fully unit-tested.             | `ts-fsrs`  |
| `packages/content` | Source of truth for decks (markdown/yaml) + build script to JSON + optional Claude-assisted generation script. | none       |
| `apps/web`         | Vite + React PWA. Screens, IndexedDB storage (Dexie), service worker.                                          | engine     |

The "backend" is the engine + the content build. It runs on the phone, so
there is nothing to host except static files.

## 3. Scheduling: FSRS

Use `ts-fsrs` (open-spaced-repetition). Do not hand-roll.

- Each card carries FSRS state: `due, stability, difficulty, reps, lapses, state (New/Learning/Review/Relearning), last_review`.
- Desired retention default **0.9**. Default FSRS parameters until there are
  a few hundred reviews; the optimizer (`@open-spaced-repetition/binding`) can
  fit personal parameters later from the review log.
- Retrievability (probability of recall right now) is computed on demand from
  stability and elapsed time. It is the sort key for "what to ask first".

Rating mapping for multiple choice:

| Outcome                      | FSRS rating |
| ---------------------------- | ----------- |
| Wrong option                 | Again       |
| Right, then user taps "Hard" | Hard        |
| Right, then user taps "Good" | Good        |
| Right, then user taps "Easy" | Easy        |

Answer time is logged but not used for scheduling in v1 (available for later).

Misses are re-asked at the end of the same session (like Anki's 10-minute
learning step) so a session ends with every card answered correctly at least once.

## 4. Data model

Content (static, built from repo, read-only on device):

```ts
Pattern {
  id: string            // "monotonic-stack"
  name: string          // "Monotonic Stack"
  family: string        // NeetCode category: "Stack"
  blurb: string         // one-line "when to reach for this"
  confusableWith: string[]  // preferred distractors
}

Problem {
  id: string            // "trapping-rain-water"
  title: string
  leetcodeUrl: string
  neetcodeUrl?: string
  difficulty: "Easy" | "Medium" | "Hard"
  lists: string[]       // ["blind75", "neetcode150"]
  patterns: string[]    // valid patterns; patterns[0] is primary
  pinnedDistractors?: string[]
  prompt: string        // our own one-paragraph paraphrase (not LeetCode's text)
  explanation: {
    why: string         // key insight, why the primary pattern fits
    whyNot: Record<patternId, string>  // why common wrong picks fail
    complexity: string
  }
}

Card {                  // generic, so book cards fit the same engine
  id: string            // "lc:trapping-rain-water"
  deckId: string        // "leetcode" | "book:<slug>"
  kind: "pattern-mcq" | "concept-mcq" | "free-recall"
  ref: string           // problem id or concept id
}
```

Progress (IndexedDB on device, exportable):

```ts
CardState  { cardId, ...FSRS fields }
ReviewLog  { id, cardId, sessionId, ts, rating, correct, chosen, elapsedMs,
             stateBefore, stateAfter }
Session    { id, deckId, startedAt, endedAt, plannedSize, cardIds[] }
Settings   { sessionSize: 20, newPerDay: 10, desiredRetention: 0.9,
             contentVersion }
```

## 5. Engine API (packages/engine)

```ts
buildSession({ cards, states, now, size, newCap, newSeenToday }): string[]
  // 1. due cards (due <= now), sorted by retrievability ascending
  // 2. then new cards, in curriculum order, up to newCap - newSeenToday
  // 3. truncated to size

makeQuestion(problem, patterns, rng): Question
  // options = 4: primary pattern + 3 distractors
  // distractor priority: pinnedDistractors → confusableWith of valid patterns
  //   → same family → any. Never a pattern in problem.patterns.
  // shuffled; returns correctSet (all valid patterns count as correct)

grade(state, rating, now): { state, log }     // thin wrapper over ts-fsrs

summarize(session, logs, cards): Summary       // for the end-of-session screen
```

## 6. Screens (apps/web)

1. **Home** — due count, new available today, current streak. Session size
   picker (10 / 20 / 30). Big "Start" button. Deck switcher (v2).
2. **Question** — title, difficulty chip, one-paragraph prompt, four large
   option buttons. No timer shown (elapsed logged silently).
3. **Feedback** — green/red banner. Explanation: the "why", and the "why not"
   for the option you picked if wrong. Link out to LeetCode. If correct:
   Hard / Good / Easy buttons. If wrong: "Got it" → next.
4. **Summary** — every card seen with ✓/✗, next due date, expandable
   explanation. "Copy as markdown" button. Weakest patterns of the session.
5. **Patterns** — per-pattern accuracy and card count; tap to see problems.
   This is the "what am I bad at" view.
6. **Settings** — session size, new/day cap, desired retention, export
   backup (JSON via share sheet), import backup, refresh content.

Design: one-hand use, large tap targets, dark mode, no scrolling on the
question screen.

## 7. Content pipeline (packages/content)

```
content/
  patterns.yaml                # taxonomy, ~25–30 patterns
  leetcode/
    two-sum.md                 # one file per problem, YAML frontmatter + sections
    ...
  books/                       # v2
    <book-slug>.md
scripts/
  ingest-neetcode.ts           # seed 150 stubs from the krmanik/Anki-NeetCode JSON
  build.ts                     # md/yaml → apps/web/public/content/*.json + manifest
  validate.ts                  # every pattern id exists, primary set, no distractor overlap
```

Problem file shape:

```md
---
id: trapping-rain-water
title: Trapping Rain Water
leetcode: https://leetcode.com/problems/trapping-rain-water/
difficulty: Hard
lists: [blind75, neetcode150]
patterns: [two-pointers, monotonic-stack] # first is primary
pinnedDistractors: [sliding-window]
---

## Prompt

Given bar heights, compute how much water is trapped between them after rain.

## Why

Water above index i is bounded by min(maxLeft, maxRight) − h[i]. Two pointers
moving inward from both ends can track those maxima in O(1) space.

## Why not

- sliding-window: no contiguous-subarray property; the answer depends on the
  global maxima on each side, not a local window.
- prefix-sum: you need running _maxima_, not sums.

## Complexity

O(n) time, O(1) space (two pointers) or O(n) space (stack).
```

Pattern taxonomy (NeetCode's 18 categories as families, split where a
category hides distinct patterns):

- Arrays & Hashing → hash-map, prefix-sum, sorting, counting
- Two Pointers → two-pointers
- Sliding Window → sliding-window
- Stack → stack, monotonic-stack
- Binary Search → binary-search, binary-search-on-answer
- Linked List → fast-slow-pointers, in-place-reversal, linked-list
- Trees → tree-dfs, tree-bfs, bst-property
- Tries → trie
- Heap → heap, top-k, two-heaps
- Backtracking → backtracking
- Graphs → graph-bfs, graph-dfs, topological-sort, union-find, dijkstra, mst
- 1-D DP → dp-1d
- 2-D DP → dp-2d
- Greedy → greedy
- Intervals → intervals
- Math & Geometry → math, matrix
- Bit Manipulation → bit-manipulation

Explanations: written once, stored in the repo, edited freely. First pass is
generated in batches (by Claude in this project, or via a script with an API
key), then reviewed. Prompts are paraphrased in our own words; we never copy
LeetCode's problem text.

## 8. Book mode (v2, sketch)

Same engine, different deck. Authored on the Mac as one markdown file per book:

```md
---
book: Designing Data-Intensive Applications
slug: ddia
---

### What does a write-ahead log guarantee?

- [x] Durability of committed writes across crashes
- [ ] Serializable isolation
- [ ] Read-your-writes consistency
- [ ] Bounded replication lag

> Notes: the log is append-only; recovery replays it...

### Explain the difference between latency and response time.

> Free recall. Answer: response time = service time + queueing + network; latency = waiting...
```

Cards with checkboxes become `concept-mcq`. Cards without become
`free-recall` (show prompt → reveal → self-grade Again/Hard/Good/Easy).
Build script picks both up; the app gets a deck switcher.

## 9. Phases

**Phase 0 — scaffold + engine**

- npm workspaces, TypeScript strict, vitest.
- `packages/engine`: FSRS wrapper, `buildSession`, `makeQuestion`, `summarize`, with tests.
- Deliverable: `npm test` green; a Node script can run a fake session end to end.

**Phase 1 — content**

- `patterns.yaml`.
- Ingest NeetCode 150 → 150 stubs (title, links, difficulty, family).
- Label patterns per problem (family gives a starting point; refine by hand
  where a category hides several patterns).
- Write prompts + explanations in batches; validate.
- Deliverable: `content/leetcode.json` with 150 complete problems.

**Phase 2 — app**

- Vite + React + Tailwind + vite-plugin-pwa + Dexie.
- Screens 1–4 (Home, Question, Feedback, Summary).
- Deploy to Cloudflare Pages (works with a private repo) or GitHub Pages.
- Install on phone. Use it for a week.
- Deliverable: sessions work offline on the phone.

**Phase 3 — polish**

- Patterns screen, Settings, export/import backup, re-ask misses in session,
  content refresh with version check.

**Phase 4 — book mode**

- Book markdown format, `concept-mcq` and `free-recall` card kinds, deck switcher.

## 10. Defaults chosen (change any of these)

- React over Svelte/Vue (largest ecosystem for PWA tooling; either works).
- Tailwind for styling.
- Dexie over raw IndexedDB.
- Hosting: Cloudflare Pages, served at a subdomain of the existing domain
  (e.g. `recall.<domain>`). See §11.
- Session size 20, new cards/day 10, desired retention 0.9.
- One card per problem in v1 (no reversed cards, no "name the problem for this pattern").

## 11. Hosting

The app lives at its own subdomain rather than a path like `/recall/` under the
existing site. Reasons: the service worker scope and PWA manifest are simplest
at a domain root, and the home-screen app then has its own identity separate
from the personal site.

- **Cloudflare Pages** (default): connect the repo, build command
  `npm run build`, output `apps/web/dist`. If the domain's DNS is already on
  Cloudflare, adding `recall.<domain>` is one click. Works with a private repo.
- **GitHub Pages** (alternative): a second repo with a `CNAME` file pointing
  at `recall.<domain>`, deployed by an Actions workflow. Needs a public repo
  on the free tier. Coexists fine with the `adityapalve.github.io` user site.

Either way, `git push` to `main` deploys app + content together.

## 12. Tooling

- **oxlint** for linting (TS + React rules, `--type-aware` when available).
  Replaces ESLint; runs in milliseconds.
- **oxfmt** for formatting if it is stable when we scaffold; otherwise Prettier.
- **tsc --noEmit** with `strict` as the type check.
- **vitest** for tests.
- One `npm run check` script runs lint + typecheck + test + content validate.
  Same script runs in CI on every push and gates the deploy.
- **lefthook** pre-commit hook running `npm run check` on staged packages.

## 13. Non-goals for v1

- Accounts, sync server, multi-user.
- Scraping LeetCode problem text.
- Running code / judging solutions.
- FSRS parameter optimization (log everything so it's possible later).

## References

- ts-fsrs: https://github.com/open-spaced-repetition/ts-fsrs
- NeetCode 150 seed data: https://github.com/krmanik/Anki-NeetCode/blob/main/neetcode-150-list.json
- FSRS algorithm write-up: https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm
