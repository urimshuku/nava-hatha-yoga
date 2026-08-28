import { CMS_SESSION_COOKIE } from "./cms/session-cookie";

/**
 * Edge cache for public GET responses.
 *
 * Every public page currently renders Next.js on the Worker (force-dynamic so
 * CMS edits are not baked in at build time). That work regularly exceeds
 * Cloudflare's CPU or 128 MB isolate limit, which surfaces as Error 1102.
 *
 * This layer sits in front of Next.js: cache hits never load the page handler,
 * and stale hits are served while a single in-flight render refreshes the
 * entry. The editor's session cookie bypasses the cache so /admin saves still
 * look live to the person who made them.
 */

const HTML_FRESH_SECONDS = 60;
const HTML_STALE_SECONDS = 600;
const MEDIA_FRESH_SECONDS = 60 * 60 * 24 * 365;

const SKIP_PREFIXES = ["/admin", "/login", "/api"];

const TRACKING_PARAM = /^(utm_|fbclid|gclid|gad_|mc_|yclid|_hs)/i;

const inflight = new Map<string, Promise<void>>();

type Ttl = {
  freshSeconds: number;
  staleSeconds: number;
};

function isCacheableMethod(method: string): boolean {
  return method === "GET" || method === "HEAD";
}

function hasEditorSession(request: Request): boolean {
  const cookie = request.headers.get("cookie");
  if (!cookie) return false;
  return cookie.split(";").some((part) => part.trim().startsWith(`${CMS_SESSION_COOKIE}=`));
}

function ttlFor(pathname: string): Ttl {
  if (pathname.startsWith("/media/")) {
    return { freshSeconds: MEDIA_FRESH_SECONDS, staleSeconds: 0 };
  }
  return { freshSeconds: HTML_FRESH_SECONDS, staleSeconds: HTML_STALE_SECONDS };
}

export function shouldUsePublicCache(request: Request): boolean {
  if (!isCacheableMethod(request.method)) return false;
  if (hasEditorSession(request)) return false;

  const { pathname } = new URL(request.url);
  return !SKIP_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function stripTrackingParams(url: URL): URL {
  const cleaned = new URL(url.toString());
  for (const key of [...cleaned.searchParams.keys()]) {
    if (TRACKING_PARAM.test(key)) cleaned.searchParams.delete(key);
  }
  return cleaned;
}

function toCacheKey(request: Request): Request {
  const url = stripTrackingParams(new URL(request.url));
  const headers = new Headers();

  const rsc = request.headers.get("rsc");
  if (rsc) headers.set("rsc", rsc);

  const prefetch = request.headers.get("next-router-prefetch");
  if (prefetch) headers.set("next-router-prefetch", prefetch);

  const segmentPrefetch = request.headers.get("next-router-segment-prefetch");
  if (segmentPrefetch) headers.set("next-router-segment-prefetch", segmentPrefetch);

  const accept = request.headers.get("accept") ?? "";
  if (accept.includes("text/x-component")) {
    headers.set("accept", "text/x-component");
  } else if (accept.includes("text/html")) {
    headers.set("accept", "text/html");
  }

  return new Request(url.toString(), { method: "GET", headers });
}

function cacheMapKey(key: Request): string {
  return [
    key.url,
    key.headers.get("rsc") ?? "",
    key.headers.get("next-router-prefetch") ?? "",
    key.headers.get("next-router-segment-prefetch") ?? "",
    key.headers.get("accept") ?? "",
  ].join("\0");
}

function ageSeconds(response: Response): number {
  const dateHeader = response.headers.get("date");
  if (!dateHeader) return 0;
  const generatedAt = Date.parse(dateHeader);
  if (!Number.isFinite(generatedAt)) return 0;
  return Math.max(0, (Date.now() - generatedAt) / 1000);
}

function getEdgeCache(): Cache | null {
  if (typeof caches === "undefined") return null;
  const storage = caches as CacheStorage & { default?: Cache };
  return storage.default ?? null;
}

function canStore(response: Response): boolean {
  if (response.headers.has("set-cookie")) return false;
  const status = response.status;
  return (status >= 200 && status < 400) || status === 404;
}

function toClientResponse(request: Request, response: Response): Response {
  const pathname = new URL(request.url).pathname;
  if (pathname.startsWith("/media/")) return response;

  // Keep HTML out of the browser (and Cloudflare's Browser Cache TTL). The
  // Worker Cache API already holds the copy that avoids another Next.js render.
  const headers = new Headers(response.headers);
  headers.set("cache-control", "private, no-cache, no-store, must-revalidate");
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function toStoredResponse(response: Response, ttl: Ttl): Response {
  const headers = new Headers(response.headers);
  headers.set(
    "cache-control",
    `public, max-age=0, s-maxage=${ttl.freshSeconds}, stale-while-revalidate=${ttl.staleSeconds}`,
  );
  if (!headers.has("date")) {
    headers.set("date", new Date().toUTCString());
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function storeGenerated(
  cache: Cache,
  key: Request,
  mapKey: string,
  ttl: Ttl,
  generate: () => Promise<Response>,
): Promise<Response> {
  const existing = inflight.get(mapKey);
  if (existing) {
    await existing;
    const hit = await cache.match(key);
    if (hit) return hit;
    return generate();
  }

  let release: () => void = () => {};
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  inflight.set(mapKey, gate);

  try {
    const response = await generate();
    if (!canStore(response)) return response;

    await cache.put(key, toStoredResponse(response.clone(), ttl));
    const stored = await cache.match(key);
    if (stored) {
      void response.body?.cancel();
      return stored;
    }
    return response;
  } finally {
    inflight.delete(mapKey);
    release();
  }
}

/**
 * Serve a cached public response when possible. `generate` is only called on a
 * miss, or in the background when the cached copy is stale.
 */
export async function withPublicResponseCache(
  request: Request,
  ctx: ExecutionContext,
  generate: () => Promise<Response>,
): Promise<Response> {
  if (!shouldUsePublicCache(request)) {
    return generate();
  }

  const cache = getEdgeCache();
  if (!cache) return generate();
  const key = toCacheKey(request);
  const mapKey = cacheMapKey(key);
  const ttl = ttlFor(new URL(request.url).pathname);

  const cached = await cache.match(key);
  if (cached) {
    const age = ageSeconds(cached);
    if (age < ttl.freshSeconds) return toClientResponse(request, cached);

    if (ttl.staleSeconds > 0 && age < ttl.freshSeconds + ttl.staleSeconds) {
      ctx.waitUntil(
        storeGenerated(cache, key, mapKey, ttl, generate).then((response) => {
          if (response !== cached) void response.body?.cancel();
        }),
      );
      return toClientResponse(request, cached);
    }
  }

  return toClientResponse(
    request,
    await storeGenerated(cache, key, mapKey, ttl, generate),
  );
}
