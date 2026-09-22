# Cross-device progress sync — proposed plan

Status: design proposal, not implemented.

## Goal and first release

Study on a phone or laptop, including offline, without losing reviews. When the
app is open and online, devices converge on the same review history, schedule,
and settings. Keep IndexedDB as the local working database and the existing
JSON export as a recovery option.

First release is for one person's devices. Sync on app launch, foreground,
reconnection, and after committed reviews, with a manual Sync button. Do not
promise background sync while a phone app is closed. Active sessions remain
local; cross-device resumption and shared decks are later features.

## Proposed architecture

- Cloudflare Pages continues to serve the React PWA and versioned deck JSON.
- Same-origin Pages Functions expose an authenticated `/api/sync` endpoint.
- D1 stores user-scoped review events, sessions, scheduling baselines, derived
  card states, settings, device metadata, and an ordered change feed.
- IndexedDB gains an outbox, sync metadata, and account ownership. A review and
  its outbox entry commit atomically before any network request.
- The pure engine remains independent of storage and networking.

Deck content already ships with the app and does not need per-user syncing.
Store a content version on review events; preserve historical references if a
future deck removes a card.

## Identity and API contract

Choose identity before implementation. For personal use, evaluate Cloudflare
Access restricted to the owner's email; validate its signed identity in the
API. For a future multi-user product, use an established OIDC provider and
server-side sessions. A frontend-only login gate is insufficient. Never ship
Cloudflare account credentials to the browser.

Scope every database query and uniqueness constraint to the authenticated
user. Validate incoming data and batch size. Use secure cookies, same-origin
requests, appropriate CSRF protection, and `Cache-Control: no-store` for API
responses; exclude the API from service-worker caching. Expired login must not
prevent local study. Logout must prevent one account's pending writes from
being uploaded into another account.

A request uploads a bounded batch of operations with stable IDs and a pull
cursor. The server applies changes transactionally and deduplicates retries,
then returns acknowledgements, canonical state revisions, and a paginated
change feed. Use a server-issued sequence cursor, not client wall-clock time,
to track downloaded changes. The client atomically applies each page, advances
its cursor, and removes acknowledged outbox entries. Test crashes at every step.

## Conflict policy: decide this before coding

Review events are immutable and merge by stable event ID. Retrying the same
upload must never count as a second review. Keep reviews from both devices.

CardState cannot safely be merged by simply choosing the newest lastReview:
two offline devices may both grade from the same old state, so one snapshot
would discard the scheduling effect of the other review. This is the main
limitation of reusing the current backup merge as a sync protocol.

Proposed policy: replay the merged scheduled-review events from an agreed
baseline to produce canonical FSRS state. Non-scheduled retry events remain in
history but do not affect scheduling. Add device ID, per-device sequence,
base revision, event/schema version, and scheduler version/configuration to
future events. Specify deterministic fuzz behavior (record a seed or disable
fuzz for canonical computation) so clients and server agree.

Prototype ordering before committing the schema: preserve per-device order,
define a stable tie-break for concurrent events, and handle wrong device clocks
explicitly. Do not use upload arrival order as study chronology. Two distinct
offline reviews of the same card are real events, not duplicates; decide how
near-simultaneous scheduled reviews affect FSRS and lock it down with examples.
Late events may require replay and invalidate earlier state snapshots.

Apply canonical updates between sessions, or rebase the current session's
pending operations without changing the question on screen. Tell the user when
an offline schedule has been reconciled. Strict cross-device new-card caps
cannot be guaranteed when both devices are offline; preserve reviews and
reconcile counts after syncing.

Settings use field-level server revisions; stale writes receive a conflict
response and an explicit deterministic resolution policy. Separate "clear this
device" from "reset progress everywhere". A global reset needs a new progress
generation so an old offline device cannot resurrect deleted progress.

## Migration from today's app

1. Validate backup imports and make local review persistence recoverable before
   introducing remote writes. The runner currently advances before the Dexie
   transaction finishes; a failed write needs a recoverable UI path.
2. On first sign-in, offer to merge this device's existing progress into the
   account, with an export available first. Preserve existing review UUIDs.
3. Import legacy progress as a baseline plus historical logs. Existing logs do
   not carry all FSRS parameters/version data needed for exact historical
   replay. Do not replay those logs on top of the imported baseline.
4. If devices have independently diverged legacy states, keep both histories
   and explicitly resolve the baseline; do not silently claim a lossless
   reconstruction. New events use the versioned protocol.
5. Keep backups portable and versioned. Test account changes, interrupted
   migration, and importing the same backup on multiple devices.

## Delivery slices and acceptance tests

1. Reliability foundations: validated boundary schemas, atomic local writes,
   persistence-failure recovery, database tests.
2. Conflict prototype: two simulated offline devices, duplicate uploads,
   overlapping card reviews, wrong clocks, late events, deterministic replay,
   scheduler upgrades, reset generations. Finalize the event contract here.
3. Hosted backend: identity, D1 migrations, user isolation, transactional
   push/pull, cursor pagination, request validation, backups.
4. Client sync: durable outbox, bounded retry/backoff, foreground/reconnect
   triggers, account-aware local data, and last-sync/pending/error indicators.
5. Migration and rollout: seed existing progress, test a real phone and laptop,
   disconnect both, review, reconnect in reverse order, and confirm histories
   and canonical schedules converge. Retain JSON export throughout rollout.

Acceptance: acknowledged reviews survive refresh and reinstall; repeated
requests do not duplicate reviews; both devices converge after concurrent
use; offline study works through expired login; resets do not resurrect data;
one account cannot read or alter another account's progress.

## Decisions to settle

- Personal-only Access authentication or multi-user OIDC login?
- Confirm concurrent-review ordering and close-in-time scheduling semantics.
- Confirm the legacy-baseline reconciliation policy.
- Whether session history alone is enough (recommended for v1), or active
  session continuation across devices is required.

## References

- https://developers.cloudflare.com/pages/functions/
- https://developers.cloudflare.com/d1/
- https://developers.cloudflare.com/cloudflare-one/access-controls/
