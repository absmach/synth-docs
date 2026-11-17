# Enterprise screenshots

These are the images used by the Enterprise guides under `content/docs/user-guide/enterprise`.

They are committed here so a fresh checkout and the static export render the guides without an R2 publish step. The Worker prefers the R2 copy when it exists and falls back to this static file when it does not.

To publish or refresh one on the live site:

```bash
pnpm publish-image ./public/screenshots/enterprise/05-workspace-pcb.png \ docs/synth/screenshots/enterprise/05-workspace-pcb.png
```

The destination path must start with `docs/synth/screenshots/`.
