import { CloudPanel } from '../components/CloudPanel.tsx'
import type { ExplanationFeedback } from '@recall/engine'
import { useEffect, useRef, useState } from 'react'
import { type Settings } from '@recall/engine'
import { exportBackup, importBackup, wipeAll, db } from '../lib/db.ts'

interface Props {
  settings: Settings
  contentVersion: string
  onChange: (next: Settings) => void
  onBack: () => void
}

async function doExport() {
  const backup = await exportBackup()
  const json = JSON.stringify(backup)
  const name = `recall-backup-${backup.exportedAt.slice(0, 10)}.json`
  const file = new File([json], name, { type: 'application/json' })
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: name })
      return
    } catch {
      // cancelled — fall back to download
    }
  }
  const url = URL.createObjectURL(file)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

async function doWipe() {
  if (
    !window.confirm(
      'Clear this device and disconnect cloud sync? Cloud backups will remain. Unsynced changes will be lost. Export first.',
    )
  )
    return
  await wipeAll()
  window.location.reload()
}

export function SettingsScreen({ settings, contentVersion, onChange, onBack }: Props) {
  const [feedback, setFeedback] = useState<ExplanationFeedback[]>([])
  useEffect(() => {
    const refresh = () => {
      void db.feedback.where('vote').equals('down').toArray().then(setFeedback)
    }
    refresh()
    window.addEventListener('recall-cloud-applied', refresh)
    return () => window.removeEventListener('recall-cloud-applied', refresh)
  }, [])
  const [msg, setMsg] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function doImport(f: File | undefined) {
    if (!f) return
    try {
      const parsed: unknown = JSON.parse(await f.text())
      const r = await importBackup(parsed)
      setMsg(`Imported ${r.states} card states and ${r.logs} reviews.`)
    } catch (e) {
      setMsg(`Import failed: ${e instanceof Error ? e.message : String(e)}`)
    }
  }

  return (
    <div className="flex flex-1 flex-col px-5 pt-3 pb-4">
      <header className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="tap -ml-2 rounded-full p-2 text-zinc-400"
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </header>

      <div className="mt-4 flex-1 overflow-y-auto">
        <CloudPanel />
        <Section title="Sessions">
          <Stepper
            label="New cards per day"
            value={settings.newPerDay}
            min={0}
            max={50}
            step={5}
            onChange={(v) => onChange({ ...settings, newPerDay: v })}
          />
          <Stepper
            label="Retries per miss"
            value={settings.maxRetries}
            min={0}
            max={5}
            step={1}
            onChange={(v) => onChange({ ...settings, maxRetries: v })}
          />
          <Stepper
            label="Desired retention"
            value={Math.round(settings.desiredRetention * 100)}
            min={70}
            max={97}
            step={1}
            suffix="%"
            onChange={(v) => onChange({ ...settings, desiredRetention: v / 100 })}
          />
          <p className="mt-2 text-xs text-zinc-500">
            Higher retention means more frequent reviews. 90% is the usual default.
          </p>
        </Section>

        <Section title="Data">
          <button
            type="button"
            onClick={doExport}
            className="tap w-full rounded-xl bg-zinc-900 py-3 font-medium"
          >
            Export backup
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="tap mt-2 w-full rounded-xl bg-zinc-900 py-3 font-medium"
          >
            Import backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => doImport(e.target.files?.[0])}
          />
          <button
            type="button"
            onClick={doWipe}
            className="tap mt-2 w-full rounded-xl bg-zinc-900 py-3 font-medium text-rose-300"
          >
            Clear this device
          </button>
          {msg ? <p className="mt-3 text-sm text-zinc-400">{msg}</p> : null}
        </Section>

        <Section title="Explanations to improve">
          {feedback.length === 0 ? (
            <p className="text-sm text-zinc-500">No explanations flagged yet.</p>
          ) : (
            feedback.map((f) => (
              <div key={f.id} className="mb-3 rounded-lg bg-zinc-900 p-3 text-sm">
                <p>{f.title}</p>
                <p className="mt-1 text-zinc-400">
                  {f.reason || 'Unhelpful'}
                  {f.note ? ` · ${f.note}` : ''}
                </p>
                <p className="mt-1 text-xs text-zinc-500">Content {f.contentVersion}</p>
              </div>
            ))
          )}
        </Section>
        <Section title="About">
          <p className="text-sm text-zinc-500">Content version {contentVersion}</p>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 text-xs font-semibold tracking-wide text-zinc-500 uppercase">{title}</h2>
      {children}
    </section>
  )
}

function Stepper({
  label,
  value,
  min,
  max,
  step,
  suffix = '',
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  suffix?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-zinc-300">{label}</span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - step))}
          className="tap h-9 w-9 rounded-lg bg-zinc-900 text-lg"
          aria-label="decrease"
        >
          −
        </button>
        <span className="w-12 text-center tabular-nums">
          {value}
          {suffix}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + step))}
          className="tap h-9 w-9 rounded-lg bg-zinc-900 text-lg"
          aria-label="increase"
        >
          +
        </button>
      </div>
    </div>
  )
}
