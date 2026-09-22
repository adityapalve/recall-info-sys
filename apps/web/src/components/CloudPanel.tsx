import { useEffect, useState } from 'react'
import { connectCloud, getCloudStatus, syncNow, signOut } from '../lib/sync.ts'

export function CloudPanel({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState(getCloudStatus)
  const [error, setError] = useState('')
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
        <span className="font-medium">Cloud backup</span>
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
      <p className="mt-1 text-xs text-zinc-400">{status.message || status.user?.email}</p>
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
          {status.owner ? 'Sync now' : 'Back up and merge this device'}
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
        <p className="mt-2 text-xs text-zinc-400">
          Merge local progress with {status.user.email}. Nothing is uploaded until you connect.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-2 text-xs text-rose-300">
          {error}
        </p>
      ) : null}
    </section>
  )
}
