// Shared handler factory for serving files out of the R2 bucket that backs
// this site's images/diagrams/screenshots.
//
// Minimal local R2 typings on purpose (no `@cloudflare/workers-types`
// dependency) -- this file is type-checked by the site's own tsconfig (DOM
// lib), and pulling in the Workers global types there would conflict with
// DOM's Request/Response/Headers types across the rest of the app.

export interface R2ObjectBody {
  body: ReadableStream;
  size: number;
  httpEtag: string;
  writeHttpMetadata(headers: Headers): void;
}

export interface R2Bucket {
  get(key: string): Promise<R2ObjectBody | null>;
}

export interface Env {
  IMAGES_BUCKET: R2Bucket;
}

export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

interface CFCache {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
}
interface CFCacheStorage {
  readonly default: CFCache;
}

const notFound = () =>
  new Response("Not found", {
    status: 404,
    headers: { "cache-control": "no-store" },
  });

export function createR2ProxyHandler(keyPrefix: string) {
  return async (
    path: string,
    env: Env,
    request: Request,
    ctx: ExecutionContext,
  ): Promise<Response> => {
    if (!path) return notFound();

    const bucket = env.IMAGES_BUCKET;
    if (!bucket) return notFound();

    const cache = (caches as unknown as CFCacheStorage).default;
    const cacheKey = new Request(request.url, request);

    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const object = await bucket.get(`${keyPrefix}/${path}`);
    if (!object) return notFound();

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("content-length", String(object.size));
    headers.set("cache-control", "public, max-age=3600, s-maxage=31536000");

    const response = new Response(object.body, { headers });
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  };
}
