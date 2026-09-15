// Worker entry point for serving this site's images/diagrams/screenshots
// out of the shared R2 bucket ("websites-images") instead of committing
// them to git.
//
// This repo deploys as a Next.js static export (`output: "export"`) served
// by Cloudflare Workers Static Assets. This proxy is routed by
// `wrangler.jsonc`'s `assets.run_worker_first` for the path prefixes below;
// every other request goes straight to static asset serving.
//
// Keep this in sync with scripts/publish-image.mjs's ROUTES map.
import {
  createR2ProxyHandler,
  type Env,
  type ExecutionContext,
} from "./r2-proxy";

const BASE_PATH = "/docs/synth";

const ROUTES = [
  { segment: "img", handler: createR2ProxyHandler("synth-docs/img") },
  {
    segment: "diagrams",
    handler: createR2ProxyHandler("synth-docs/diagrams"),
  },
  {
    segment: "screenshots",
    handler: createR2ProxyHandler("synth-docs/screenshots"),
  },
] as const;

const notFound = () =>
  new Response("Not found", {
    status: 404,
    headers: { "cache-control": "no-store" },
  });

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const { pathname } = new URL(request.url);

    const withoutBase = pathname.startsWith(BASE_PATH)
      ? pathname.slice(BASE_PATH.length)
      : pathname;
    const [, segment, ...rest] = withoutBase.split("/");

    const route = ROUTES.find((r) => r.segment === segment);
    if (!route || rest.length === 0) return notFound();

    const path = decodeURIComponent(rest.join("/"));
    return route.handler(path, env, request, ctx);
  },
};
