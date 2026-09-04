import {
  buildSession,
  createScheduler,
  mathRng,
  SessionRunner,
  summarize,
  type Feedback,
  type Grade,
  type ReviewLog,
  type Scheduler,
  type Session,
  type Settings,
  type Summary,
} from '@recall/engine'
import type { Content } from './content.ts'
import { countNewSeenToday, db, loadStates } from './db.ts'
import { endOfDay } from './time.ts'

export interface HomeStats {
  due: number
  newAvailable: number
  total: number
  seen: number
}

export function makeScheduler(settings: Settings): Scheduler {
  return createScheduler({ desiredRetention: settings.desiredRetention, enableFuzz: true })
}

export async function homeStats(
  content: Content,
  settings: Settings,
  now: number,
): Promise<HomeStats> {
  const scheduler = makeScheduler(settings)
  const states = await loadStates()
  const newSeenToday = await countNewSeenToday(now)
  const built = buildSession({
    cards: content.deck.cards,
    states,
    scheduler,
    now,
    horizon: endOfDay(now),
    size: Number.MAX_SAFE_INTEGER,
    newCap: settings.newPerDay,
    newSeenToday,
  })
  return {
    due: built.dueCount,
    newAvailable: built.newCount,
    total: content.deck.cards.length,
    seen: states.size,
  }
}

export class LiveSession {
  readonly runner: SessionRunner
  readonly scheduler: Scheduler

  private constructor(runner: SessionRunner, scheduler: Scheduler) {
    this.runner = runner
    this.scheduler = scheduler
  }

  static async start(
    content: Content,
    settings: Settings,
    size: number,
  ): Promise<LiveSession | null> {
    const now = Date.now()
    const scheduler = makeScheduler(settings)
    const states = await loadStates()
    const newSeenToday = await countNewSeenToday(now)
    const built = buildSession({
      cards: content.deck.cards,
      states,
      scheduler,
      now,
      horizon: endOfDay(now),
      size,
      newCap: settings.newPerDay,
      newSeenToday,
    })
    if (built.cardIds.length === 0) return null
    const session: Session = {
      id: crypto.randomUUID(),
      deckId: content.deck.id,
      startedAt: now,
      endedAt: null,
      plannedSize: size,
      cardIds: built.cardIds,
    }
    await db.sessions.put(session)
    const runner = new SessionRunner(session, states, {
      scheduler,
      cards: content.cards,
      problems: content.problems,
      patterns: content.patterns,
      rng: mathRng,
      now: Date.now,
      newId: () => crypto.randomUUID(),
      maxRetries: settings.maxRetries,
    })
    return new LiveSession(runner, scheduler)
  }

  /** Interval preview (days) per grade for the card currently awaiting a rating. */
  previewIntervals(fb: Feedback): Record<Grade, number> {
    const state =
      this.runner.states.get(fb.cardId) ?? this.scheduler.newState(fb.cardId, Date.now())
    return this.scheduler.preview(state, Date.now())
  }

  async commit(rating?: Grade): Promise<ReviewLog> {
    const log = this.runner.commit(rating)
    const state = this.runner.states.get(log.cardId)
    await db.transaction('rw', db.cardStates, db.reviewLogs, db.sessions, async () => {
      if (log.scheduled && state) await db.cardStates.put(state)
      await db.reviewLogs.put(log)
      if (this.runner.isDone) await db.sessions.put(this.runner.session)
    })
    return log
  }

  summary(content: Content): Summary {
    return summarize({
      session: this.runner.session,
      logs: this.runner.logs,
      cards: content.cards,
      problems: content.problems,
      states: this.runner.states,
    })
  }
}
