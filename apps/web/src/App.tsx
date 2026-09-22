import { useCallback, useEffect, useState } from 'react'
import type { Feedback, Grade, Settings, Summary } from '@recall/engine'
import { loadContent, type Content } from './lib/content.ts'
import { loadSettings, saveSettings } from './lib/db.ts'
import { startSync, setStudying, syncNow } from './lib/sync.ts'
import { LiveSession } from './lib/session.ts'
import { Home } from './screens/Home.tsx'
import { Question } from './screens/Question.tsx'
import { FeedbackScreen } from './screens/Feedback.tsx'
import { SummaryScreen } from './screens/Summary.tsx'
import { SettingsScreen } from './screens/Settings.tsx'

type Screen =
  | { kind: 'home'; notice?: string }
  | { kind: 'question' }
  | { kind: 'feedback'; fb: Feedback; intervals: Record<Grade, number> }
  | { kind: 'summary'; summary: Summary }
  | { kind: 'settings' }

export function App() {
  const [content, setContent] = useState<Content | null>(null)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [screen, setScreen] = useState<Screen>({ kind: 'home' })
  const [live, setLive] = useState<LiveSession | null>(null)

  useEffect(() => startSync(), [])
  useEffect(() => {
    const refresh = () => {
      void loadSettings().then(setSettings)
    }
    window.addEventListener('recall-cloud-applied', refresh)
    return () => window.removeEventListener('recall-cloud-applied', refresh)
  }, [])

  useEffect(() => {
    Promise.all([loadContent(), loadSettings()])
      .then(([c, s]) => {
        setContent(c)
        setSettings(s)
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
  }, [])

  const start = useCallback(
    async (size: number) => {
      if (!content || !settings) return
      setStudying(true)
      let s: LiveSession | null
      try {
        s = await LiveSession.start(content, settings, size)
      } catch (e) {
        setStudying(false)
        throw e
      }
      if (!s) {
        setStudying(false)
        setScreen({ kind: 'home', notice: 'Nothing due and no new cards left for today.' })
        return
      }
      setLive(s)
      setScreen({ kind: 'question' })
    },
    [content, settings],
  )

  const answer = useCallback(
    (chosen: string, elapsedMs: number) => {
      if (!live) return
      const fb = live.runner.answer(chosen, elapsedMs)
      setScreen({ kind: 'feedback', fb, intervals: live.previewIntervals(fb) })
    },
    [live],
  )

  const commit = useCallback(
    async (rating?: Grade) => {
      if (!live || !content) return
      await live.commit(rating)
      if (live.runner.isDone) {
        setScreen({ kind: 'summary', summary: live.summary(content) })
      } else {
        setScreen({ kind: 'question' })
      }
    },
    [live, content],
  )

  const finish = useCallback(() => {
    setStudying(false)
    void syncNow()
    setLive(null)
    setScreen({ kind: 'home' })
  }, [])

  const updateSettings = useCallback(async (next: Settings) => {
    setSettings(next)
    await saveSettings(next)
  }, [])

  if (error) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-lg font-semibold">Couldn't load</p>
          <p className="text-zinc-400">{error}</p>
        </div>
      </Shell>
    )
  }
  if (!content || !settings) {
    return (
      <Shell>
        <div className="flex flex-1 items-center justify-center text-zinc-500">Loading…</div>
      </Shell>
    )
  }

  switch (screen.kind) {
    case 'home':
      return (
        <Shell>
          <Home
            content={content}
            settings={settings}
            notice={screen.notice ?? null}
            onStart={start}
            onSettings={() => setScreen({ kind: 'settings' })}
          />
        </Shell>
      )
    case 'settings':
      return (
        <Shell>
          <SettingsScreen
            settings={settings}
            contentVersion={content.version}
            onChange={updateSettings}
            onBack={() => setScreen({ kind: 'home' })}
          />
        </Shell>
      )
    case 'question': {
      const q = live?.runner.current()
      if (!live || !q) return null
      return (
        <Shell>
          <Question
            key={`${q.problemId}:${live.runner.logs.length}`}
            question={q}
            progress={live.runner.progress()}
            onAnswer={answer}
            onQuit={finish}
          />
        </Shell>
      )
    }
    case 'feedback':
      return (
        <Shell>
          <FeedbackScreen
            key={`${screen.fb.cardId}:${live?.runner.logs.length}`}
            contentVersion={content.version}
            fb={screen.fb}
            intervals={screen.intervals}
            patterns={content.patterns}
            onCommit={commit}
          />
        </Shell>
      )
    case 'summary':
      return (
        <Shell>
          <SummaryScreen summary={screen.summary} patterns={content.patterns} onDone={finish} />
        </Shell>
      )
  }
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="safe-top safe-bottom mx-auto flex h-dvh w-full max-w-lg flex-col">
      {children}
    </div>
  )
}
