import { useEffect, useRef, useState } from 'react'
import type { Progress, Question as Q } from '@recall/engine'

interface Props {
  question: Q
  progress: Progress
  onAnswer: (chosen: string, elapsedMs: number) => void
  onQuit: () => void
}

const DIFF: Record<string, string> = {
  Easy: 'bg-emerald-500/15 text-emerald-300',
  Medium: 'bg-amber-500/15 text-amber-300',
  Hard: 'bg-rose-500/15 text-rose-300',
}

export function Question({ question, progress, onAnswer, onQuit }: Props) {
  const shownAt = useRef(0)
  const [locked, setLocked] = useState(false)
  useEffect(() => {
    shownAt.current = performance.now()
  }, [])
  const done = progress.answered
  const total = progress.total + progress.retriesPending

  return (
    <div className="flex flex-1 flex-col px-5 pt-3 pb-4">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={onQuit}
          className="tap -ml-2 rounded-full p-2 text-zinc-500"
          aria-label="End session"
        >
          <span className="text-xl leading-none">×</span>
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-accent transition-[width]"
            style={{ width: `${(done / Math.max(1, total)) * 100}%` }}
          />
        </div>
        <span className="text-sm tabular-nums text-zinc-500">
          {done}/{total}
        </span>
      </header>

      <div className="flex flex-1 flex-col justify-center py-6">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-md px-2 py-0.5 text-xs font-semibold ${DIFF[question.difficulty] ?? ''}`}
          >
            {question.difficulty}
          </span>
          {progress.retriesPending > 0 && done === progress.total ? (
            <span className="text-xs text-zinc-500">retry</span>
          ) : null}
        </div>
        <h2 className="mt-2 text-2xl font-bold leading-tight">{question.title}</h2>
        <p className="mt-3 text-base leading-relaxed text-zinc-300">{question.prompt}</p>
        <p className="mt-5 text-sm text-zinc-500">Which pattern solves it?</p>
      </div>

      <div className="grid gap-2">
        {question.options.map((o) => (
          <button
            key={o.id}
            type="button"
            disabled={locked}
            onClick={() => {
              if (locked) return
              setLocked(true)
              onAnswer(o.id, Math.round(performance.now() - shownAt.current))
            }}
            className="tap w-full rounded-2xl bg-zinc-900 px-4 py-4 text-left text-base font-medium active:bg-zinc-800"
          >
            {o.name}
          </button>
        ))}
      </div>
    </div>
  )
}
