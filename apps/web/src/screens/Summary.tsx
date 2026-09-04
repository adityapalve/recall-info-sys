import { useState } from 'react'
import { summaryToMarkdown, type Pattern, type Summary } from '@recall/engine'
import { formatDue } from '../lib/time.ts'

interface Props {
  summary: Summary
  patterns: ReadonlyMap<string, Pattern>
  onDone: () => void
}

export function SummaryScreen({ summary, patterns, onDone }: Props) {
  const [open, setOpen] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const name = (id: string) => patterns.get(id)?.name ?? id
  const now = summary.endedAt ?? summary.startedAt

  async function share() {
    const md = summaryToMarkdown(summary, patterns)
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Recall session', text: md })
        return
      } catch {
        // user cancelled or share failed: fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="px-5 pt-4">
        <p className="text-sm text-zinc-500">Session complete</p>
        <p className="mt-1 text-3xl font-bold">
          {summary.firstTryCorrect}/{summary.total}
          <span className="ml-2 text-base font-medium text-zinc-500">
            first try · {Math.round(summary.accuracy * 100)}%
          </span>
        </p>
        {summary.weakest.length ? (
          <p className="mt-2 text-sm text-zinc-400">
            Work on:{' '}
            <span className="text-rose-300">
              {summary.weakest.slice(0, 3).map(name).join(', ')}
            </span>
          </p>
        ) : (
          <p className="mt-2 text-sm text-emerald-300">Clean sweep.</p>
        )}
      </div>

      <ul className="mt-4 flex-1 overflow-y-auto px-5">
        {summary.items.map((it) => {
          const isOpen = open === it.cardId
          return (
            <li key={it.cardId} className="border-b border-zinc-900">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : it.cardId)}
                className="flex w-full items-start gap-3 py-3 text-left"
              >
                <span
                  className={`mt-0.5 text-sm ${it.firstTryCorrect ? 'text-emerald-400' : 'text-rose-400'}`}
                >
                  {it.firstTryCorrect ? '✓' : '✗'}
                </span>
                <span className="flex-1">
                  <span className="block font-medium">{it.title}</span>
                  <span className="block text-sm text-zinc-500">
                    {name(it.primaryPattern)}
                    {it.nextDue !== null ? ` · ${formatDue(it.nextDue, now)}` : ''}
                  </span>
                </span>
              </button>
              {isOpen ? (
                <div
                  className="pb-3 pl-7 text-sm leading-relaxed text-zinc-400"
                  style={{ userSelect: 'text' }}
                >
                  {it.wrongPicks.length ? (
                    <p className="mb-1 text-rose-300">
                      Picked: {it.wrongPicks.map(name).join(', ')}
                    </p>
                  ) : null}
                  <p>{it.why}</p>
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>

      <div className="grid grid-cols-2 gap-2 px-5 pt-3 pb-4">
        <button
          type="button"
          onClick={share}
          className="tap rounded-2xl bg-zinc-900 py-4 font-semibold text-zinc-200"
        >
          {copied ? 'Copied' : 'Share'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="tap rounded-2xl bg-accent py-4 font-semibold text-white"
        >
          Done
        </button>
      </div>
    </div>
  )
}
