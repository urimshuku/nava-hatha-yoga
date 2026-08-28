import { getMediaBucket } from "@/lib/cms/media";

/**
 * Serves images uploaded through the built-in CMS straight out of R2.
 *
 * Keeping them on our own origin means `next/image` sends them through the
 * Cloudflare resizing loader exactly like the files in /public, so uploads get
 * the same width-appropriate, format-negotiated delivery as everything else.
 */

export const dynamic = "force-dynamic";

const IMMUTABLE = "public, max-age=31536000, immutable";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key: segments } = await params;
  const key = segments.map(decodeURIComponent).join("/");

  const bucket = await getMediaBucket();
  if (!bucket) {
    return new Response("Image storage is not configured.", { status: 500 });
  }

  // Content is immutable per key, so a matching ETag can always short-circuit.
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch) {
    const existing = await bucket.head(key);
    if (existing && existing.httpEtag === ifNoneMatch) {
      return new Response(null, {
        status: 304,
        headers: { etag: existing.httpEtag, "cache-control": IMMUTABLE },
      });
    }
  }

  const object = await bucket.get(key);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      "content-type": object.httpMetadata?.contentType ?? "application/octet-stream",
      "cache-control": object.httpMetadata?.cacheControl ?? IMMUTABLE,
      etag: object.httpEtag,
    },
  });
}
