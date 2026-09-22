import { useState } from 'react'
import type { ReviewLog } from '@recall/engine'
import { activityDays } from '../lib/activity.ts'

export function Activity({ logs }: { logs: ReviewLog[] }) {
  const [now] = useState(Date.now)
  const days = activityDays(logs, now)
  const [selected, setSelected] = useState<string | null>(null)
  const day = days.find((d) => d.key === selected)
  const colors = ['bg-zinc-800', 'bg-violet-950', 'bg-violet-800', 'bg-violet-600', 'bg-violet-400']
  return (
    <section className="my-6" aria-label="Study activity">
      <div className="mb-3 flex justify-between text-xs text-zinc-400">
        <h2>Study activity</h2>
        <span>Last 8 weeks</span>
      </div>
      <div className="grid grid-flow-col grid-rows-7 gap-1.5">
        {days.map((d) => (
          <button
            key={d.key}
            type="button"
            disabled={d.future}
            aria-label={`${d.key}: ${d.count} reviews${d.count ? `, ${Math.round((d.correct / d.count) * 100)}% correct` : ''}`}
            aria-pressed={selected === d.key}
            onClick={() => setSelected(d.key)}
            className={`aspect-square rounded-sm ${d.future ? 'opacity-0' : colors[d.count === 0 ? 0 : d.count < 5 ? 1 : d.count < 10 ? 2 : d.count < 20 ? 3 : 4]} ${selected === d.key ? 'ring-2 ring-white' : ''}`}
          />
        ))}
      </div>
      <p className="mt-3 min-h-4 text-xs text-zinc-400" aria-live="polite">
        {day
          ? `${day.key} · ${day.count} reviews${day.count ? ` · ${Math.round((day.correct / day.count) * 100)}% correct` : ''}`
          : 'Tap a day · darker to brighter means more reviews'}
      </p>
    </section>
  )
}
