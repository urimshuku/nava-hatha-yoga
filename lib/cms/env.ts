import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Reads a server-only CMS setting. Values come from the Cloudflare environment
 * in production (`wrangler secret put`) and from .env.local in development.
 */
export async function getCmsEnv(name: string): Promise<string | undefined> {
  let value: unknown;

  try {
    const { env } = await getCloudflareContext({ async: true });
    value = (env as unknown as Record<string, unknown>)[name];
  } catch {
    value = undefined;
  }

  const raw = typeof value === "string" ? value : process.env[name];
  const trimmed = raw?.trim();

  return trimmed ? trimmed : undefined;
}
