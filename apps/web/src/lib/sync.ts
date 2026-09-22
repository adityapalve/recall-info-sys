import { syncResponseSchema, identitySchema } from '@recall/engine'
import { db, initializeEvents, materialize } from './db.ts'

export interface CloudUser {
  id: string
  email: string
}
export interface CloudStatus {
  user: CloudUser | null
  configured: boolean
  pending: number
  lastSync: number | null
  message: string
  owner: string | null
  busy: boolean
}
let status: CloudStatus = {
  user: null,
  configured: false,
  pending: 0,
  lastSync: null,
  message: 'Checking cloud connection…',
  owner: null,
  busy: false,
}
let task: Promise<void> | null = null
let studying = false
export function setStudying(value: boolean) {
  studying = value
}
export function getCloudStatus() {
  return status
}
function publish(patch: Partial<CloudStatus>) {
  status = { ...status, ...patch }
  window.dispatchEvent(new Event('recall-sync'))
}
export async function refreshCloudStatus() {
  const meta = await db.syncMeta.get('sync')
  publish({
    pending: await db.events.where('pending').equals(1).count(),
    lastSync: meta?.lastSync ?? null,
    owner: meta?.owner ?? null,
  })
}
export async function checkIdentity() {
  try {
    const res = await fetch('/api/auth/me', { cache: 'no-store' })
    if (!res.ok || !res.headers.get('content-type')?.includes('application/json'))
      throw new Error('Cloud unavailable')
    const data = identitySchema.parse(await res.json())
    publish({
      user: data.user,
      configured: data.configured,
      message: data.user
        ? ''
        : data.configured
          ? 'Sign in to back up your progress'
          : 'Cloud sign-in is not configured yet',
    })
  } catch {
    publish({ message: 'Offline · changes stay on this device' })
  }
}
export async function connectCloud() {
  if (!status.user) throw new Error('Sign in first')
  await initializeEvents()
  const meta = await db.syncMeta.get('sync')
  if (!meta) return
  if (meta.owner && meta.owner !== status.user.id)
    throw new Error(
      'This device belongs to another account. Export it, then clear this device before switching accounts.',
    )
  await db.syncMeta.put({ ...meta, owner: status.user.id })
  await syncNow()
}
export async function syncNow(): Promise<void> {
  if (task) return task
  task = performSync().finally(() => {
    task = null
  })
  return task
}
async function performSync() {
  await initializeEvents()
  await refreshCloudStatus()
  if (!navigator.onLine) {
    publish({ message: 'Offline · changes stay on this device' })
    return
  }
  await checkIdentity()
  const owner = status.user?.id
  const initial = await db.syncMeta.get('sync')
  if (!owner || !initial?.owner) return
  if (initial.owner !== owner) {
    publish({ message: 'Account differs from this device. Sign back into the original account.' })
    return
  }
  publish({ busy: true, message: 'Syncing…' })
  try {
    let more = true
    let pages = 0
    // Each page depends on the cursor and acknowledgements committed by the previous one.
    /* oxlint-disable no-await-in-loop */
    while (more && pages++ < 100) {
      const meta = await db.syncMeta.get('sync')
      if (!meta || meta.owner !== owner) throw new Error('Device ownership changed')
      const batch = await db.events.where('pending').equals(1).limit(40).toArray()
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cursor: meta.cursor, events: batch.map((r) => r.event) }),
      })
      if (res.status === 401) throw new Error('Sign in again; your changes are saved locally')
      if (!res.ok) throw new Error(`Sync unavailable (${res.status}); will retry`)
      const data = syncResponseSchema.parse(await res.json())
      await db.transaction('rw', db.events, db.syncMeta, async () => {
        const current = await db.syncMeta.get('sync')
        if (current?.owner !== owner) throw new Error('Device ownership changed')
        for (const e of data.events) await db.events.put({ id: e.id, event: e, pending: 0 })
        for (const id of data.acknowledged) await db.events.update(id, { pending: 0 })
        await db.syncMeta.put({ ...current, cursor: data.cursor, lastSync: Date.now() })
      })
      more = data.more || (await db.events.where('pending').equals(1).count()) > 0
    }
    /* oxlint-enable no-await-in-loop */
    if (!studying) {
      await materialize()
      window.dispatchEvent(new Event('recall-cloud-applied'))
    }
    await refreshCloudStatus()
    publish({ message: status.pending ? 'Uploads pending · will continue shortly' : 'Synced' })
  } catch (e) {
    publish({ message: e instanceof Error ? e.message : 'Sync failed; will retry' })
  } finally {
    publish({ busy: false })
  }
}
export function startSync() {
  const run = () => {
    if (document.visibilityState === 'visible')
      void syncNow().catch(() => publish({ message: 'Local storage unavailable' }))
  }
  window.addEventListener('online', run)
  window.addEventListener('recall-data', run)
  document.addEventListener('visibilitychange', run)
  const timer = window.setInterval(run, 60000)
  run()
  return () => {
    clearInterval(timer)
    window.removeEventListener('online', run)
    window.removeEventListener('recall-data', run)
    document.removeEventListener('visibilitychange', run)
  }
}

export async function signOut() {
  if (task) await task
  const res = await fetch('/api/auth/logout', { method: 'POST' })
  if (!res.ok) throw new Error('Could not sign out. Please reconnect and try again.')
  publish({ user: null, message: 'Signed out · changes stay on this device' })
}
