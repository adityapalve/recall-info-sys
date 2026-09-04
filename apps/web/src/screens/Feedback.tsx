import type { Feedback, Grade, Pattern } from '@recall/engine'
import { formatDays } from '../lib/time.ts'

interface Props {
  fb: Feedback
  intervals: Record<Grade, number>
  patterns: ReadonlyMap<string, Pattern>
  onCommit: (rating?: Grade) => void
}

export function FeedbackScreen({ fb, intervals, patterns, onCommit }: Props) {
  const correct = patterns.get(fb.question.correctId)
  const chosen = patterns.get(fb.chosen)
  const alsoValid = fb.question.alsoValid
    .map((id) => patterns.get(id))
    .filter((p): p is Pattern => !!p)
  const ex = fb.problem.explanation

  return (
    <div className="flex flex-1 flex-col">
      <div
        className={`px-5 pt-4 pb-3 ${fb.correct ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/15 text-rose-200'}`}
      >
        <p className="text-sm font-semibold tracking-wide uppercase">
          {fb.correct ? 'Correct' : 'Not quite'}
        </p>
        <p className="mt-1 text-xl font-bold">{correct?.name}</p>
        {correct ? <p className="mt-1 text-sm opacity-80">{correct.blurb}</p> : null}
      </div>

      <div
        className="flex-1 overflow-y-auto px-5 py-4"
        style={{ userSelect: 'text', WebkitUserSelect: 'text' }}
      >
        <h3 className="text-lg font-bold">{fb.problem.title}</h3>

        {!fb.correct && chosen ? (
          <Block label={`Why not ${chosen.name}`} tone="warn">
            {fb.whyNotChosen ?? `${chosen.blurb} That is not what this problem needs.`}
          </Block>
        ) : null}

        <Block label="Why">{ex.why}</Block>

        {alsoValid.length ? (
          <Block label="Also works">
            {alsoValid.map((p) => (
              <p key={p.id}>
                <span className="font-semibold text-zinc-200">{p.name}</span>
                {ex.whyNot[p.id] ? (
                  <span className="text-zinc-400"> — {ex.whyNot[p.id]}</span>
                ) : null}
              </p>
            ))}
          </Block>
        ) : null}

        <Block label="Complexity">{ex.complexity}</Block>

        <a
          href={fb.problem.leetcodeUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-sm text-accent"
        >
          Open on LeetCode ↗
        </a>
      </div>

      <div className="px-5 pt-2 pb-4">
        {fb.correct && !fb.retry ? (
          <div className="grid grid-cols-3 gap-2">
            <RateButton label="Hard" sub={formatDays(intervals[2])} onClick={() => onCommit(2)} />
            <RateButton
              label="Good"
              sub={formatDays(intervals[3])}
              primary
              onClick={() => onCommit(3)}
            />
            <RateButton label="Easy" sub={formatDays(intervals[4])} onClick={() => onCommit(4)} />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onCommit()}
            className={`tap w-full rounded-2xl py-4 text-lg font-semibold text-white ${fb.correct ? 'bg-accent' : 'bg-zinc-800'}`}
          >
            {fb.correct ? 'Next' : fb.retry ? 'Next' : 'Got it — ask me again later'}
          </button>
        )}
      </div>
    </div>
  )
}

function Block({
  label,
  tone,
  children,
}: {
  label: string
  tone?: 'warn'
  children: React.ReactNode
}) {
  return (
    <div className={`mt-4 rounded-xl p-3 ${tone === 'warn' ? 'bg-rose-500/10' : 'bg-zinc-900'}`}>
      <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">{label}</p>
      <div className="mt-1 text-sm leading-relaxed text-zinc-300">{children}</div>
    </div>
  )
}

function RateButton({
  label,
  sub,
  primary,
  onClick,
}: {
  label: string
  sub: string
  primary?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tap flex flex-col items-center rounded-2xl py-3 ${primary ? 'bg-accent text-white' : 'bg-zinc-900 text-zinc-200'}`}
    >
      <span className="text-base font-semibold">{label}</span>
      <span className={`text-xs ${primary ? 'text-white/70' : 'text-zinc-500'}`}>{sub}</span>
    </button>
  )
}
