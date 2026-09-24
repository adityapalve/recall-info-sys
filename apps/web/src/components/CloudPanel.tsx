import { useEffect, useState } from 'react'
import type { AvatarId } from '@recall/engine'
import { connectCloud, getCloudStatus, syncNow, signOut } from '../lib/sync.ts'
import { AvatarPicker } from './AvatarPicker.tsx'

export function CloudPanel({
  compact = false,
  avatar = 'fox',
  onAvatarChange,
}: {
  compact?: boolean
  avatar?: AvatarId
  onAvatarChange?: (avatar: AvatarId) => void
}) {
  const [status, setStatus] = useState(getCloudStatus)
  const [error, setError] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)
  useEffect(() => {
    const update = () => setStatus(getCloudStatus())
    window.addEventListener('recall-sync', update)
    return () => window.removeEventListener('recall-sync', update)
  }, [])
  return (
    <section
      className="my-3 rounded-xl border border-zinc-800 p-3 text-sm"
      aria-label="Cloud backup"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          {onAvatarChange ? (
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              aria-label={`Change avatar, currently ${avatar}`}
              className="relative shrink-0 rounded-full ring-2 ring-zinc-700 ring-offset-2 ring-offset-zinc-950 focus-visible:ring-accent"
            >
              <img src={`/avatars/${avatar}.svg`} alt="" className="h-12 w-12 rounded-full" />
              <span className="absolute -right-1 -bottom-1 grid h-5 w-5 place-items-center rounded-full bg-zinc-700 text-xs text-white">
                ✎
              </span>
            </button>
          ) : null}
          <div className="min-w-0">
            <p className="font-medium">Cloud backup</p>
            {status.user ? (
              <p className="truncate text-xs text-zinc-400">{status.user.email}</p>
            ) : null}
          </div>
        </div>
        <span className="text-xs text-zinc-400" role="status">
          {status.busy
            ? 'Syncing…'
            : status.pending
              ? `${status.pending} pending`
              : status.lastSync && status.user
                ? 'Backed up'
                : 'Local only'}
        </span>
      </div>
      <p aria-live="polite" className="mt-3 min-h-4 text-xs text-zinc-400">
        {status.message || '\u00a0'}
      </p>
      {status.lastSync && !compact ? (
        <p className="mt-1 text-xs text-zinc-500">
          Last synced {new Date(status.lastSync).toLocaleString()}
        </p>
      ) : null}
      {!status.user ? (
        <a
          className={`mt-2 inline-block text-accent ${!status.configured ? 'pointer-events-none opacity-50' : ''}`}
          aria-disabled={!status.configured}
          href="/api/auth/login"
        >
          Sign in with Google
        </a>
      ) : (
        <button
          type="button"
          disabled={status.busy || (!!status.owner && status.owner !== status.user.id)}
          className="mt-2 text-accent disabled:opacity-50"
          onClick={() => {
            setError('')
            void (status.owner ? syncNow() : connectCloud()).catch((e) =>
              setError(e instanceof Error ? e.message : 'Could not connect'),
            )
          }}
        >
          {status.owner ? 'Sync now' : status.busy ? 'Connecting…' : 'Connect backup'}
        </button>
      )}
      {status.user && !compact ? (
        <button
          type="button"
          disabled={status.busy}
          className="ml-4 text-zinc-400"
          onClick={() =>
            void signOut().catch((e: unknown) =>
              setError(e instanceof Error ? e.message : 'Could not sign out'),
            )
          }
        >
          Sign out
        </button>
      ) : null}
      {status.user && !status.owner ? (
        <p className="mt-2 text-xs text-zinc-400">Connecting this device to your cloud backup.</p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-2 text-xs text-rose-300">
          {error}
        </p>
      ) : null}
      {pickerOpen && onAvatarChange ? (
        <AvatarPicker
          selected={avatar}
          onSelect={(next) => {
            onAvatarChange(next)
            setPickerOpen(false)
          }}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}
    </section>
  )
}
