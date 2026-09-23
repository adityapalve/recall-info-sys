# Deploying Recall

Production URL: https://recall.palve.dev/
Pages URL: https://recall-1sh.pages.dev/

Cloudflare Pages project: `recall`. Production branch: `main`.
This is a Direct Upload project, deployed from this checkout with Wrangler.
Source repository: https://github.com/adityapalve/recall-info-sys (private).
GitHub Actions checks pushes and pull requests; Cloudflare deployments remain
manual via `npm run deploy`.

## Publish an update

```sh
npm ci
npx wrangler login
npm run deploy
```

The deploy script runs lint, formatting, type checks, tests, and a production
build before uploading `apps/web/dist` to the existing Pages project. Wrangler
is pinned in the root package and lockfile. Login is needed only when the local
Wrangler credentials are absent or expired. If you have multiple accounts,
select the account that owns `recall` using `CLOUDFLARE_ACCOUNT_ID`.

The build validates content, writes the deck and manifest into the app's public
directory, and bundles the PWA and its service worker. Only the build output is
uploaded; local IndexedDB progress and backup files are not included.

The Cloudflare dashboard offers a Connect to a repository flow for this project.
After pushing this version, select repository `recall-info-sys`, branch `main`,
framework preset None, build command `npm run check && npm run build`, output
`apps/web/dist`, and leave the root directory blank. Wrangler does not expose a
command for attaching an existing project to GitHub. Until connected, deployment
remains manual.

## Use on a phone

Open https://recall.palve.dev/ on the phone. On iPhone, use Safari's Share
menu and Add to Home Screen, then launch the installed app while online once
so its content can be cached. Android browsers also offer an install option.

Use the stable production URL above, not a deployment-specific preview URL:
browser storage is scoped to the origin. The Pages URL has separate local
storage, so export progress there before moving to the custom domain unless
the device has already completed a cloud backup.

The full deck is included. Until Google sign-in is configured and this device is
connected, progress stays local. To transfer existing progress, export a backup
from Settings in the original instance, transfer the JSON to the phone, and
import it from Settings inside the installed app. Retain a backup separately.

## Content updates and sync

Edit `packages/content/leetcode/` or `packages/content/patterns.yaml`, then run
`npm run deploy`. The content hash is visible in Settings.

See [SYNC.md](SYNC.md) for the implemented cross-device sync protocol and its limitations.

## Cloudflare reference

https://developers.cloudflare.com/pages/get-started/direct-upload/

## D1 and Google sign-in

`wrangler.jsonc` defines the `DB` binding to `recall-progress`, the primary and
Pages origins, and the owner's allowed email. Before the first backend deployment:

```sh
npx wrangler d1 migrations apply recall-progress --remote
```

Create a Google Cloud project, then open **Google Auth Platform**:

1. Configure branding (app name Recall and your support/contact email).
2. Choose External audience; while testing, add your Google email as a test user.
3. Create a client of type **Web application**.
4. Add these exact authorized redirect URIs:
   `https://recall.palve.dev/api/auth/callback` and
   `https://recall-1sh.pages.dev/api/auth/callback`.
5. Save the client ID and client secret as Pages secrets using the interactive
   prompts below. Do not commit the downloaded client JSON or paste secrets into
   chat. Only `openid email` is requested; no Drive/Gmail permissions are needed.

```sh
npx wrangler pages secret put GOOGLE_CLIENT_ID --project-name recall
npx wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name recall
npm run deploy
```

Without both secrets, local study, activity, and feedback still work, but Google
sign-in remains disabled and no cloud backup occurs. After setup, sign in and
choose **Back up and merge this device**. Verify a review appears on a second
device before relying on recovery. JSON export remains available in Settings.

The sign-in flow starts on the server through `/api/auth/login`; it does not use
the Google JavaScript sign-in library. Each allowed host redirects to its own
registered callback URI. `APP_ORIGIN` is the preferred custom domain and
`PAGES_ORIGIN` retains sign-in on the Pages URL. The custom domain must be
attached to the Pages project before deployment. Existing cloud history remains
associated with the same Google account, while local browser storage remains
separate between the two hosts.

Local API development uses `npx wrangler pages dev apps/web/dist` after a build
and `npx wrangler d1 migrations apply recall-progress --local`. Override
APP_ORIGIN for the local server in ignored `.dev.vars`. Local tests exercise D1
through Miniflare without production credentials. `npm run typecheck` generates
Cloudflare binding types before checking all workspaces.

Google setup reference: https://developers.google.com/identity/openid-connect/openid-connect
