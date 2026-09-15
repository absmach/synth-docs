# Publishing images (maintainers only)

This repo can serve images from a shared Cloudflare R2 bucket (`websites-images`)
instead of committing them to git, via a small Worker that sits in front of the
static export.

- [`workers/image-proxy.ts`](../workers/image-proxy.ts) routes
  `/docs/synth/img/*`, `/docs/synth/diagrams/*`, and
  `/docs/synth/screenshots/*` to R2.
- `wrangler.jsonc`'s `assets.run_worker_first` sends only those path prefixes
  to the Worker before static asset matching.

## One-time setup

Create `scripts/.env.publish-image` from the template:

```bash
cp scripts/.env.publish-image.example scripts/.env.publish-image
```

Create a Cloudflare API token with:

- `Workers R2 Storage: Edit`
- `Zone -> Cache Purge -> Purge`, scoped to the `absmach.eu` zone

Paste the token into `CLOUDFLARE_API_TOKEN`. The zone ID is already filled in
and is not secret.

## Publishing an image

```bash
pnpm run publish-image <local-file> <public-path>
```

`<public-path>` is everything after the domain and must start with
`docs/synth/img/`, `docs/synth/diagrams/`, or `docs/synth/screenshots/`.

```bash
pnpm run publish-image ./architecture.svg docs/synth/img/architecture.svg
pnpm run publish-image ./board.png docs/synth/screenshots/board.png
```

The script uploads to the real R2 bucket with `--remote`, then purges that exact
URL from Cloudflare's edge cache.

## Local preview

Plain `pnpm run dev` runs Next.js only, so the image Worker is not active.
Preview the deployed shape locally with:

```bash
pnpm run build
npx wrangler dev --port 8789
```
