# Deploying Recall

Production URL: https://recall-1sh.pages.dev/

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

Cloudflare Direct Upload projects cannot switch to built-in Git integration.
A future CI workflow can use Wrangler to deploy to this same project, or a new
Pages project can be created for built-in Git integration.

## Use on a phone

Open https://recall-1sh.pages.dev/ on the phone. On iPhone, use Safari's Share
menu and Add to Home Screen, then launch the installed app while online once
so its content can be cached. Android browsers also offer an install option.

Use the stable production URL above, not a deployment-specific preview URL:
browser storage is scoped to the origin. A custom domain would also have
separate storage, so export progress before changing origins.

The full deck is included. Progress is local to each browser/app installation;
there is no automatic sync yet. To transfer existing progress, export a backup
from Settings in the original instance, transfer the JSON to the phone, and
import it from Settings inside the installed app. Retain a backup separately.

## Content updates and sync

Edit `packages/content/leetcode/` or `packages/content/patterns.yaml`, then run
`npm run deploy`. The content hash is visible in Settings.

See [SYNC.md](SYNC.md) for the proposed cross-device sync architecture and rollout.

## Cloudflare reference

https://developers.cloudflare.com/pages/get-started/direct-upload/
