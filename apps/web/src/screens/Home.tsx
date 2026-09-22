import { useEffect, useState } from 'react'
import type { Settings, ReviewLog } from '@recall/engine'
import type { Content } from '../lib/content.ts'
import { currentStreak, db } from '../lib/db.ts'
import { homeStats, type HomeStats } from '../lib/session.ts'

import { Activity } from '../components/Activity.tsx'
import { CloudPanel } from '../components/CloudPanel.tsx'

interface Props {
  content: Content
  settings: Settings
  notice: string | null
  onStart: (size: number) => Promise<void>
  onSettings: () => void
}

const SIZES = [10, 20, 30]

export function Home({ content, settings, notice, onStart, onSettings }: Props) {
  const [logs, setLogs] = useState<ReviewLog[]>([])
  const [failure, setFailure] = useState<string | null>(null)
  const [stats, setStats] = useState<HomeStats | null>(null)
  const [streak, setStreak] = useState(0)
  const [size, setSize] = useState(settings.sessionSize)
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    const refresh = () => {
      const now = Date.now()
      Promise.all([homeStats(content, settings, now), currentStreak(now), db.reviewLogs.toArray()])
        .then(([s, st, l]) => {
          setStats(s)
          setStreak(st)
          setLogs(l)
        })
        .catch(() => setFailure('Could not load progress. Please reload.'))
    }
    refresh()
    window.addEventListener('recall-cloud-applied', refresh)
    return () => window.removeEventListener('recall-cloud-applied', refresh)
  }, [content, settings])

  const available = stats ? stats.due + stats.newAvailable : 0

  return (
    <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-4 pb-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Recall</h1>
        <button
          type="button"
          onClick={onSettings}
          className="tap rounded-full p-2 text-zinc-400"
          aria-label="Settings"
        >
          <GearIcon />
        </button>
      </header>

      <div className="mt-10 grid grid-cols-2 gap-4">
        <Stat label="Due" value={stats?.due ?? '–'} accent />
        <Stat label="New today" value={stats?.newAvailable ?? '–'} />
        <Stat label="Streak" value={streak ? `${streak}d` : '0d'} />
        <Stat label="Seen" value={stats ? `${stats.seen}/${stats.total}` : '–'} />
      </div>

      <Activity logs={logs} />
      <CloudPanel compact />
      <div className="min-h-4 flex-1" />
      {failure ? (
        <p role="alert" className="mb-3 text-sm text-rose-300">
          {failure}
        </p>
      ) : null}

      {notice ? (
        <p className="mb-4 rounded-xl bg-zinc-900 p-3 text-center text-sm text-zinc-300">
          {notice}
        </p>
      ) : null}

      <p className="mb-2 text-sm text-zinc-500">Session size</p>
      <div className="mb-4 grid grid-cols-3 gap-2 rounded-xl bg-zinc-900 p-1">
        {SIZES.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setSize(n)}
            className={`tap rounded-lg py-2 text-sm font-semibold ${
              size === n ? 'bg-zinc-700 text-white' : 'text-zinc-400'
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!stats || available === 0 || starting}
        onClick={() => {
          setStarting(true)
          void onStart(size)
            .catch(() => setFailure('Could not start. Please try again.'))
            .finally(() => setStarting(false))
        }}
        className="tap w-full rounded-2xl bg-accent py-4 text-lg font-semibold text-white disabled:bg-zinc-800 disabled:text-zinc-500"
      >
        {stats && available === 0
          ? 'All done for today'
          : `Start · ${Math.min(size, available || size)} cards`}
      </button>
    </div>
  )
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string | number
  accent?: boolean
}) {
  return (
    <div className="rounded-2xl bg-zinc-900 p-4">
      <p className="text-xs font-medium tracking-wide text-zinc-500 uppercase">{label}</p>
      <p className={`mt-1 text-3xl font-bold tabular-nums ${accent ? 'text-accent' : ''}`}>
        {value}
      </p>
    </div>
  )
}

function GearIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}
