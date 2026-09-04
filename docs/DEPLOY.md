# Deploying

The app is static files. `npm run build` validates the content, copies it into
the app, and writes `apps/web/dist/`. Deploy that directory anywhere.

## Cloudflare Pages (recommended)

1. Push the repo to GitHub (private is fine).
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Build settings:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `apps/web/dist`
   - Environment variable: `NODE_VERSION` = `22`
4. Deploy. You get `<project>.pages.dev`.
5. Custom domain: Pages project → Custom domains → add `recall.<yourdomain>`.
   If the domain's DNS is on Cloudflare the CNAME is created for you; otherwise
   add a CNAME `recall` → `<project>.pages.dev` at your DNS host.

Every push to `main` redeploys app + content together. CI (`.github/workflows/ci.yml`)
runs `npm run check` and a build on every push, so a broken content file fails before it ships.

## GitHub Pages (alternative, public repo)

Add a workflow that runs `npm run build` and uploads `apps/web/dist` with
`actions/deploy-pages`, put `recall.<yourdomain>` in `apps/web/public/CNAME`,
and point a CNAME record at `adityapalve.github.io`. The service worker and
manifest assume the app is served from the domain root, which a custom
subdomain gives you.

## Installing on iPhone

Open the URL in Safari → Share → **Add to Home Screen**. The installed app runs
full-screen, works offline after the first load, and keeps its data in
IndexedDB (home-screen apps are exempt from Safari's 7-day storage eviction).

Back up from Settings → Export backup; it uses the share sheet, so you can
save the JSON to Files or iCloud. Import merges by most-recent review.

## Content updates

Edit or add files under `packages/content/leetcode/`, run
`npm run build -w @recall/content` to validate, commit, push. The manifest
carries a content hash; the Settings screen shows which version the phone has.
