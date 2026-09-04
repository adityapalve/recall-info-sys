/**
 * End-to-end smoke run: builds a session from fixtures, answers with a biased
 * coin, prints the markdown summary, then shows what the next session looks like.
 *   npm run demo
 */
import {
  buildSession,
  createScheduler,
  seededRng,
  SessionRunner,
  summarize,
  summaryToMarkdown,
} from '../src/index.ts'
import type { Session } from '../src/index.ts'
import { CARDS, DAY, T0, cardMap, counter, patternMap, problemMap } from '../test/fixtures.ts'

const scheduler = createScheduler()
const rng = seededRng(2026)
const newId = counter('log')
let now = T0
let states = new Map()

for (let day = 0; day < 3; day++) {
  const built = buildSession({
    cards: CARDS,
    states,
    scheduler,
    now,
    horizon: T0 + day * DAY + 15 * 3_600_000, // local midnight (T0 is 09:00)
    size: 20,
    newCap: 4,
    newSeenToday: 0,
  })
  console.log(`\n=== Day ${day + 1}: ${built.dueCount} due, ${built.newCount} new ===`)
  if (built.cardIds.length === 0) {
    console.log('nothing to review')
  } else {
    const session: Session = {
      id: `s${day}`,
      deckId: 'leetcode',
      startedAt: now,
      endedAt: null,
      plannedSize: built.cardIds.length,
      cardIds: built.cardIds,
    }
    const runner = new SessionRunner(session, states, {
      scheduler,
      cards: cardMap,
      problems: problemMap,
      patterns: patternMap,
      rng,
      now: () => now,
      newId,
      maxRetries: 2,
    })
    while (!runner.isDone) {
      const q = runner.current()
      if (!q) break
      const right = rng.next() < 0.6
      const pick = right ? q.correctId : (q.options.find((o) => o.id !== q.correctId)?.id as string)
      const fb = runner.answer(pick, 1000 + Math.floor(rng.next() * 5000))
      const log = runner.commit(fb.correct ? (rng.next() < 0.3 ? 4 : 3) : undefined)
      console.log(
        `${fb.retry ? '  (retry) ' : ''}${q.title.padEnd(22)} picked ${pick.padEnd(16)} ${fb.correct ? 'ok' : 'MISS'}` +
          (log.scheduled && log.after
            ? `  -> due in ${((log.after.due - now) / DAY).toFixed(1)}d`
            : ''),
      )
      now += 30_000
    }
    states = runner.states
    console.log(
      '\n' +
        summaryToMarkdown(
          summarize({ session, logs: runner.logs, cards: cardMap, problems: problemMap, states }),
          patternMap,
        ),
    )
  }
  now = T0 + (day + 1) * DAY
}
