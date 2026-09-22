# Progress sync

Recall keeps IndexedDB as its offline working database and outbox. Cloudflare
Pages Functions expose a same-origin API; D1 stores account-scoped immutable
events. Google OpenID Connect identifies the owner. Deck content remains static.

## Connection and recovery

Configure Google credentials as described in DEPLOY.md. Sign in, then explicitly
choose **Back up and merge this device**. Existing local data stays available
without login. Once connected, sync runs on launch, foreground, reconnection,
local changes, and every minute while visible. Keep the app open until uploads
finish before removing it. There is no background sync guarantee when closed.

On another device, sign in to the same account and connect it to download progress.
The account is pinned to local storage; signing out does not erase that data or
allow it to upload to a different account. Export before clearing the device to
switch accounts. **Clear this device** disconnects and clears only local storage;
it does not delete cloud history. Reconnecting restores cloud history.

## Data and conflicts

Reviews and their outbox events commit in one IndexedDB transaction. The study
runner advances only after that succeeds. Uploads carry stable IDs; retrying a
request does not duplicate a review. Downloaded events, acknowledgements, and the
server sequence cursor commit atomically. API batches are bounded to 40 uploads,
100 downloads, and 256 KB request bodies. APIs are excluded from PWA caching.

New scheduled reviews are replayed by timestamp, with event ID breaking ties,
using ts-fsrs 5.4.2, the recorded retention setting, and fuzz disabled. Both devices'
reviews survive concurrent offline use. Retry reviews remain in history without
changing the schedule. Settings and explanation feedback use the last event in
that same ordering. Device clocks must be accurate: the server rejects events
more than five minutes ahead; it cannot infer incorrect timestamps in the past.
Scheduler changes require an explicit protocol/replay migration.

Legacy progress is imported as a scheduling baseline plus historical logs, which
are not replayed on top of that baseline. If older installations independently
studied the same card, the baseline with the latest last-review time wins; both
histories remain, but their original combined schedule cannot be reconstructed.
New review events at or before a later imported baseline are covered by that
baseline. Export before merging diverged legacy installations. JSON backups
include feedback and events and remain usable without the cloud.

Incoming changes are projected between study sessions so remote updates do not
change a question mid-session. Session history syncs; an active session cannot
be resumed on another device. Replay currently reads the full local event history;
this is intended for personal use, with compaction a future scaling improvement.

## Feedback and activity

The home heatmap displays 12 calendar weeks using the device's local timezone.
Only scheduled reviews count, so retries do not inflate activity. Tap a day for
review count and accuracy. Wrong-answer explanations offer thumbs up/down and
optional details. Downvotes are listed in Settings and sync with the account;
feedback does not automatically rewrite explanations.

## Security and validation

Google tokens are verified for signature, issuer, audience, nonce, and verified
email. Sign-in uses state and PKCE. The instance restricts login to ALLOWED_EMAIL.
Opaque sessions use Secure, HttpOnly, SameSite cookies; D1 stores token hashes.
POST requests require the configured origin. Preview origins cannot use production
sign-in or sync. Google secrets stay in Cloudflare, never in frontend code.

Tests cover deterministic replay, retries, legacy migration, transaction rollback,
backup validation, account isolation, duplicate uploads, pagination, invalid
requests, and missing OAuth configuration. A real Google login and phone/laptop
recovery test are still required after credentials are configured.
