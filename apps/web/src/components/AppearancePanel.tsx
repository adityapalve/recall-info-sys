import type { Settings } from '@recall/engine'
import { FONTS, THEMES } from '../lib/appearance.ts'

export function AppearancePanel({
  settings,
  onChange,
}: {
  settings: Settings
  onChange: (next: Settings) => void
}) {
  const theme = settings.theme ?? 'midnight'
  const font = settings.font ?? 'system'

  return (
    <section className="mb-6" aria-labelledby="appearance-heading">
      <h2
        id="appearance-heading"
        className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase"
      >
        Appearance
      </h2>
      <p className="mb-3 text-sm text-zinc-400">Pick a palette. Changes preview instantly.</p>
      <div className="grid grid-cols-2 gap-2">
        {THEMES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label={`${item.name} theme`}
            aria-pressed={item.id === theme}
            onClick={() => onChange({ ...settings, theme: item.id })}
            className={`tap rounded-2xl border p-2 text-left ${
              item.id === theme ? 'border-accent' : 'border-zinc-800'
            }`}
          >
            <span
              className="flex h-16 flex-col justify-between rounded-xl p-2"
              style={{ backgroundColor: item.background }}
            >
              <span className="flex gap-1">
                <span className="h-2 w-8 rounded-full" style={{ backgroundColor: item.surface }} />
                <span className="h-2 w-4 rounded-full" style={{ backgroundColor: item.accent }} />
              </span>
              <span className="flex gap-1">
                <span className="h-6 flex-1 rounded-md" style={{ backgroundColor: item.surface }} />
                <span className="h-6 w-8 rounded-md" style={{ backgroundColor: item.accent }} />
              </span>
            </span>
            <span className="mt-2 flex items-center justify-between px-1 text-sm font-medium">
              {item.name}
              {item.id === theme ? <span className="text-accent">✓</span> : null}
            </span>
          </button>
        ))}
      </div>

      <h3 className="mt-5 mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">
        Type
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {FONTS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-label={`${item.name} font`}
            aria-pressed={item.id === font}
            onClick={() => onChange({ ...settings, font: item.id })}
            className={`tap flex flex-col items-center rounded-xl border py-2 ${
              item.id === font ? 'border-accent bg-zinc-800' : 'border-zinc-800 bg-zinc-900'
            }`}
          >
            <span style={{ fontFamily: item.stack }} className="text-xl leading-6">
              Aa
            </span>
            <span className="mt-1 text-[11px] text-zinc-400">{item.name}</span>
          </button>
        ))}
      </div>
      <p className="mt-3 rounded-xl bg-zinc-900 p-3 text-sm">
        <span className="text-zinc-500">Preview · </span>
        Given an unsorted array, which pattern fits?
      </p>
    </section>
  )
}
