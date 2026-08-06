# Pre-Deployment Check — Critical + High Priority SEO

**Date:** 6 August 2026  
**Branch:** `main`  
**Latest committed HEAD:** `10c011f` — *Wire marketing content to Sanity for 1:1 CMS control.*  
**Working tree:** SEO fixes are present as **uncommitted local changes** (not yet on `origin/main`).

---

## Passed checks

| Check | Result |
|-------|--------|
| Critical C1 — hero not wrapped in Framer `opacity:0`; progressive `MotionReveal` | Pass |
| Critical C2 — `image-loader.ts` + `next.config.mjs` custom loader; no `unoptimized`/`eager` on local program images; `<picture>` art direction | Pass |
| Cloudflare Image Transformations live | Pass — `https://navahathayoga.com/cdn-cgi/image/width=640,quality=75,format=auto/images/programs/upa-yoga.jpg` → **200** `image/jpeg` |
| High H1 — Montserrat WOFF2 (~111 KB) wired in `lib/fonts.ts` | Pass |
| High H2 — Event/Course/Breadcrumb/org JSON-LD (`lib/structured-data.ts`, `JsonLd`) | Pass |
| High H3 — listing heading hierarchy | Pass |
| High H4 — `/thank-you` removed from `robots.ts` disallow | Pass |
| High H5 — sitemap uses Sanity `_updatedAt` via slug entries | Pass |
| High H6 — homepage absolute `<title>` for Saranda keyword title | Pass |
| Static OG image (`/images/og-default.png` + `app/opengraph-image.png`) replaces broken `ImageResponse` route | Pass |
| `npm run typecheck` | Pass |
| `npm run lint` | Pass (0 errors; 2 pre-existing warnings in `cloudflare-env.d.ts`) |
| `npm run build` | Pass — Next.js 16.2.9, 36 static routes generated |

---

## Problems found

1. **Production was still on the old build** (see `PRODUCTION-SEO-VERIFICATION.md`) — SEO work not deployed yet.
2. **`/opengraph-image` returned HTTP 500** — dynamic `app/opengraph-image.tsx` used `fs.readFile` + `next/og` `ImageResponse`, which fails on OpenNext/Cloudflare Workers.
3. **Homepage had no SSR `<title>`** on live — old metadata path; fixed locally with `title: { absolute: ... }`.
4. **SEO changes were uncommitted on `main`** — deploy uses the local working tree via `npm run deploy`, but git history/origin did not yet contain the fixes until/unless committed.

---

## Fixes made (this session)

1. Removed `app/opengraph-image.tsx` (dynamic OG that 500s on Workers).
2. Generated static **1200×630** PNG with brand copy via `@resvg/resvg-js`:
   - `public/images/og-default.png` (canonical metadata URL)
   - `app/opengraph-image.png` (Next file convention; build lists route `○ /opengraph-image.png`)
3. Updated `lib/seo.ts` `DEFAULT_OG_IMAGE.url` → `/images/og-default.png`.
4. Hardened homepage metadata with `title: { absolute: "Classical Hatha Yoga in Saranda, Albania · {brand}" }` (CMS SEO title still overrides when set).
5. Added permanent redirect `/opengraph-image` → `/images/og-default.png` in `next.config.mjs` (redeployed).

---

## Files changed

### Modified (SEO Critical + High + OG fix)
- `app/(site)/page.tsx`, `events/page.tsx`, `programs/[slug]/page.tsx`, `retreats/[slug]/page.tsx`, `retreats/page.tsx`
- `app/globals.css`, `app/robots.ts`, `app/sitemap.ts`
- `components/ArchiveList.tsx`, `StructuredData.tsx`, `JsonLd.tsx` *(new)*
- `components/cards/EventCard.tsx`, `ProgramCard.tsx`, `RetreatCard.tsx`
- `components/programs/ProgramsListing.tsx`
- `components/ui/LocalProgramImage.tsx`, `Motion.tsx`, `MotionReveal.tsx`
- `lib/fonts.ts`, `lib/local-images.ts`, `lib/seo.ts`, `lib/utils.ts`, `lib/structured-data.ts` *(new)*
- `next.config.mjs`, `image-loader.ts` *(new)*
- `sanity/lib/fetch.ts`, `sanity/lib/queries.ts`

### Added assets
- `assets/fonts/Montserrat[wght].woff2`
- `public/images/og-default.png`
- `app/opengraph-image.png`

### Removed
- `app/opengraph-image.tsx`

### Docs (optional for deploy; not required at runtime)
- `SEO-AUDIT.md`, `SEO-CRITICAL-FIXES-REPORT.md`, `SEO-HIGH-PRIORITY-REPORT.md`, `PRODUCTION-SEO-VERIFICATION.md`, `PRE-DEPLOYMENT-CHECK.md`

---

## Build results

```
Next.js 16.2.9 (Turbopack)
✓ Compiled successfully
✓ TypeScript
✓ Generating static pages (36/36)

Notable routes:
  ○ / , /events , /programs , /thank-you , /robots.txt , /sitemap.xml
  ● /programs/[slug] (13 programs)
  ○ /opengraph-image.png
```

---

## Image loader (production)

`next.config.mjs`:

```js
images: {
  loader: "custom",
  loaderFile: "./image-loader.ts",
  remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io", pathname: "/**" }],
}
```

`image-loader.ts` behavior:

- **Production local assets** → `/cdn-cgi/image/width=W,quality=75,format=auto/...`
- **Remote (Sanity)** → returned unchanged
- **Development** → original `src` (no CF transform)

Cloudflare Transformations confirmed enabled before deploy.

---

## Required environment variables

### In `wrangler.jsonc` `vars` (already set for production)
- `NEXT_PUBLIC_SITE_URL=https://navahathayoga.com`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET=production`
- `RESEND_FROM_EMAIL`
- `FORM_NOTIFICATION_EMAIL`

### Secrets / local `.env.local` (not in wrangler vars; keep with `--keep-vars` on deploy)
- `RESEND_API_KEY` (form email)
- `SANITY_API_READ_TOKEN` (optional draft/authenticated reads)
- `NEXT_PUBLIC_SANITY_API_VERSION` (optional; defaults in code)

Deploy uses: `opennextjs-cloudflare deploy -- --keep-vars` so existing Worker secrets/vars are preserved.

---

## Deployment instructions

### Exact production command

From the project root (with Cloudflare auth available — `CLOUDFLARE_API_TOKEN` or `wrangler login`):

```bash
npm run deploy
```

Which expands to:

```bash
node scripts/ensure-forms-d1.mjs && opennextjs-cloudflare build && opennextjs-cloudflare deploy -- --keep-vars
```

### Git workflow (recommended before/after deploy)

SEO changes are currently **uncommitted**. To record them:

```bash
git add -A
# review: do not commit .env.local
git commit -m "$(cat <<'EOF'
Ship Critical and High Priority SEO fixes for production.

EOF
)"
git push -u origin HEAD
```

Deploy does **not** require a push; it builds the **local working tree**. Pushing keeps GitHub in sync.

### Post-deploy smoke checks

1. https://navahathayoga.com/ — `<title>` contains Saranda keyword; hero has **no** `opacity:0`
2. https://navahathayoga.com/images/og-default.png — **200** image
3. https://navahathayoga.com/robots.txt — no `Disallow: /thank-you`
4. https://navahathayoga.com/sitemap.xml — program `lastmod` not all identical “now”
5. View-source `/events` and `/programs/surya-kriya` — Event / Course / Breadcrumb JSON-LD
6. Program listing images use `/cdn-cgi/image/` (or Sanity URLs), not broken transforms

---

## Out of scope

Medium and Low Priority SEO items from `SEO-AUDIT.md` were **not** implemented.

---

## Post-deploy verification (live)

**Deployed:** 6 August 2026 — Worker version from `npm run deploy` (then redeploy with `/opengraph-image` → static PNG redirect).

| # | Check | Live result |
|---|--------|-------------|
| 1 | Hero visible in SSR (no `opacity:0`) | **Pass** (cache-bust `/`) |
| 2 | CF Image Transformations | **Pass** — `/cdn-cgi/image/…/upa-yoga.jpg` → 200; program HTML includes `/cdn-cgi/image/` |
| 3 | Image errors | **Pass** for in-use URLs |
| 4 | `srcset` / `sizes` | **Pass** on `/programs` |
| 5 | Dual local variants | **Pass** |
| 6 | Montserrat WOFF2 | **Pass** — `.woff2` preload, no `.ttf` |
| 7 | Event JSON-LD | **Pass** on `/` and `/events` |
| 8 | Course JSON-LD | **Pass** on `/programs/surya-kriya` |
| 9 | BreadcrumbList | **Pass** on `/programs/surya-kriya` |
| 10 | LocalBusiness enriched | **Pass** — `@id`, `image`, `logo`, `geo`, `priceRange`, contact |
| 11 | `/thank-you` noindex | **Pass** |
| 12 | robots no `/thank-you` Disallow | **Pass** |
| 13 | Sitemap lastmod | **Pass** — static routes omit lastmod; 13 program entries with **4** distinct `_updatedAt` values |
| 14 | Canonical production domain | **Pass** |
| 15 | OG/Twitter absolute image 200 | **Pass** — `https://navahathayoga.com/images/og-default.png` → **200** `image/png` |
| — | Homepage `<title>` | **Pass** — `Classical Hatha Yoga in Saranda, Albania · Nava Hatha Yoga` |

**Note:** First request to `/` after deploy may briefly serve a cached ISR page (~60s). Cache-bust or wait; `/events` and program pages showed the new build immediately.

**Legacy URL:** `/opengraph-image` now **308/301 redirects** to `/images/og-default.png` (redeploy). Direct meta tags use `/images/og-default.png`.
