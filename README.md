# synth-docs

Documentation site for [Synth](https://github.com/absmach/synth), built with Next.js and Fumadocs. It is a single docs tree served at the site root, with the Enterprise Edition pages under `/user-guide/enterprise/`.

## Requirements

- Node.js 22+
- pnpm 10 (`packageManager` in `package.json`)

```bash
pnpm install   # also generates the Fumadocs content collections
```

## Development

```bash
pnpm dev   # http://localhost:3000
```

Content images resolve from `public/screenshots/` during development. Production rewrites the same markdown to `/docs/synth/screenshots/...`, which the Worker serves from R2 with a static-export fallback.

Search is served by the static index at `/api/search`.

## Build and preview

```bash
pnpm build   # production build
pnpm start   # serve the export
```

The build runs a Next export and nests it under the deployed base path:

```text
out/docs/synth/    the docs site
```

With `pnpm start`, open `http://localhost:3000/docs/synth/`.

## Deploy

```bash
pnpm deploy   # build and deploy the Worker + static assets
pnpm upload   # build and upload a new Worker version without deploying
```

Images can be published to R2 without redeploying the site:

```bash
pnpm publish-image ./screenshot.png docs/synth/screenshots/example.png
```

This requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ZONE_ID` (see `scripts/publish-image.mjs`). Local credentials can go in `scripts/.env.publish-image`, which is git-ignored.

## Checks

```bash
pnpm lint         # Biome
pnpm types:check  # Fumadocs collections, Next types, tsc
pnpm build        # production build
```
