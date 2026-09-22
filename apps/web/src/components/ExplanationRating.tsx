import { useState } from 'react'
import type { ExplanationFeedback, Feedback } from '@recall/engine'
import { saveFeedback } from '../lib/db.ts'

export function ExplanationRating({
  fb,
  contentVersion,
}: {
  fb: Feedback
  contentVersion: string
}) {
  const [id] = useState(() => crypto.randomUUID())
  const [vote, setVote] = useState<'up' | 'down' | null>(null)
  const [reason, setReason] = useState<ExplanationFeedback['reason']>('')
  const [note, setNote] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  async function save(next: 'up' | 'down') {
    setBusy(true)
    try {
      await saveFeedback({
        id,
        problemId: fb.problem.id,
        title: fb.problem.title,
        contentVersion,
        chosen: fb.chosen,
        vote: next,
        reason: next === 'up' ? '' : reason,
        note: next === 'up' ? '' : note,
        ts: feedbackTimestamp(),
      })
      setVote(next)
      setMessage('Saved on this device; included in cloud sync when connected.')
    } catch {
      setMessage('Could not save feedback. Please try again.')
    } finally {
      setBusy(false)
    }
  }
  return (
    <section
      className="mt-4 rounded-xl border border-zinc-800 p-3"
      aria-label="Explanation feedback"
    >
      <p className="text-sm">Was this explanation helpful?</p>
      <div className="mt-2 flex gap-3">
        {(['up', 'down'] as const).map((v) => (
          <button
            type="button"
            key={v}
            disabled={busy}
            aria-pressed={vote === v}
            aria-label={v === 'up' ? 'Helpful explanation' : 'Unhelpful explanation'}
            onClick={() => void save(v)}
            className={`rounded-lg px-4 py-2 ${vote === v ? 'bg-accent' : 'bg-zinc-800'}`}
          >
            {v === 'up' ? '👍' : '👎'}
          </button>
        ))}
      </div>
      {vote === 'down' ? (
        <div className="mt-3 space-y-2">
          <label className="block text-xs text-zinc-400">
            What could be better? (optional)
            <select
              className="mt-1 w-full rounded-lg bg-zinc-800 p-2 text-sm text-white"
              value={reason}
              onChange={(e) => {
                const v = e.target.value
                if (v === '' || v === 'unclear' || v === 'wrong-answer' || v === 'incorrect')
                  setReason(v)
              }}
            >
              <option value="">Choose a reason</option>
              <option value="unclear">Unclear reasoning</option>
              <option value="wrong-answer">Doesn't explain my answer</option>
              <option value="incorrect">Seems incorrect</option>
            </select>
          </label>
          <textarea
            aria-label="Explanation feedback note"
            maxLength={2000}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What was confusing?"
            className="w-full rounded-lg bg-zinc-800 p-2 text-sm"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => void save('down')}
            className="text-sm text-accent"
          >
            Save details
          </button>
        </div>
      ) : null}
      <p role="status" className="mt-2 text-xs text-zinc-400">
        {message}
      </p>
    </section>
  )
}

function feedbackTimestamp() {
  return Date.now()
}
