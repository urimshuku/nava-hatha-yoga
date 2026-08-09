# Medium Priority SEO Fixes — Implementation Report

**Date:** 9 August 2026  
**Scope:** Only Medium Priority issues from `SEO-AUDIT.md` (M1–M7)  
**Compared against:** `SEO-AUDIT.md`, `PRODUCTION-SEO-VERIFICATION-V2.md`  
**Status:** Complete  

Critical and High Priority work was already live; each Medium item was rechecked before changing code. Nothing in M1–M7 had been resolved indirectly.

---

## Issues confirmed (still present → fixed)

| ID | Issue | Status |
|----|--------|--------|
| M1 | Oversized logo and photo assets | Fixed |
| M2 | YouTube iframe API loads before interaction | Fixed |
| M3 | 404 page missing metadata and site chrome | Fixed |
| M4 | Invalid `<dl>` semantics in event cards | Fixed |
| M5 | Gallery images can render with empty alt | Fixed |
| M6 | Every page shares a single generic OG image | Fixed |
| M7 | Canonical URL on noindexed pages | Fixed |

## Issues already resolved or no longer applicable

| ID | Notes |
|----|--------|
| — | None. All seven Medium items were still present after Critical/High work. |
| C2 / CF transforms | Preserved. Loader and `/cdn-cgi/image/` pipeline unchanged; only source files and YouTube remotePatterns were added. |
| Low Priority (L1–L7) | Not implemented (out of scope). |

---

## What changed

### M1 — Oversized logos and photos

Re-exported display-sized WebP sources and pointed the app at them:

| Asset | Before | After |
|-------|--------|-------|
| `nava-logo-symbol-v2` | 197 KB PNG 1024² | **11 KB** WebP 256² |
| `nava-hatha-yoga-header-logo` | 288 KB PNG | **18 KB** WebP 400×168 |
| `nava-hatha-yoga-logo` | 237 KB PNG | **29 KB** WebP 520×371 |
| `nava-hatha-yoga-logo-full` | 276 KB PNG | **19 KB** WebP 320² |
| `nava-hatha-yoga-wordmark` | 162 KB PNG | **11 KB** WebP 256×81 |
| `about/teacher-linda` | 451 KB PNG | **29 KB** WebP |
| `programs/bhastrika-kriya` | 440 KB JPG | **91 KB** WebP |

Original PNG/JPG files remain on disk as rebuild sources only. Cloudflare Image Transformations still apply to local paths via the existing loader.

### M2 — YouTube click-to-load

`YouTubeEmbed` now shows a static `i.ytimg.com` thumbnail + existing play-mask overlay until click. The iframe API and player load only after interaction (`autoplay: 1`). Aspect-ratio container unchanged (no CLS). Added `i.ytimg.com` to `next.config.mjs` `remotePatterns`.

### M3 — 404 metadata and chrome

- `app/(site)/not-found.tsx` — segment 404 inside site layout (header/footer).
- `app/not-found.tsx` — global 404 with the same chrome + recovery links.
- Shared `NotFoundContent` with title **Page not found**, `noindex`, and links to Home / Programs / Events / Contact.

### M4 — Event card semantics

Replaced invalid `<dl>` (no `dt`/`dd`) with a plain `<div>` grid. `EventDetailRow` still exposes labels via `sr-only` text.

### M5 — Gallery alt text

- Sanity `imageWithAlt.alt` validation: **required** (was warning).
- `Gallery` falls back to `` `${title} — photo ${n}` `` when CMS alt is missing.
- Retreat detail passes `title={retreat.title}`.

### M6 — Per-page OG images

`buildMetadata` accepts optional `image`. Program and retreat detail pages pass Sanity cover (1200×630) or local program image, falling back to `DEFAULT_OG_IMAGE`.

### M7 — Canonical on noindex

`buildMetadata` sets `alternates: undefined` when `noIndex: true` (`/register`, `/thank-you`).

---

## Files modified

| File | Change |
|------|--------|
| `public/images/*.webp` (new) | Optimized logo / photo sources |
| `public/images/about/teacher-linda.webp` | New |
| `public/images/programs/bhastrika-kriya.webp` | New |
| `public/images/README.txt` | Document WebP sources |
| `lib/constants.ts` | Brand logo paths + intrinsic sizes |
| `lib/local-images.ts` | Bhastrika + teacher WebP paths |
| `lib/teacher-story.ts` | Teacher photo WebP |
| `lib/seo.ts` | Optional OG `image`; skip canonical when `noIndex` |
| `components/content/YouTubeEmbed.tsx` | Click-to-load facade |
| `components/content/NotFoundContent.tsx` | Shared 404 UI |
| `components/content/Gallery.tsx` | Fallback descriptive alt |
| `components/cards/EventCard.tsx` | `<dl>` → `<div>` |
| `app/not-found.tsx` | Metadata + site chrome |
| `app/(site)/not-found.tsx` | Segment 404 |
| `app/(site)/programs/[slug]/page.tsx` | Page OG image |
| `app/(site)/retreats/[slug]/page.tsx` | Page OG image + gallery title |
| `next.config.mjs` | Allow `i.ytimg.com` |
| `sanity/schemaTypes/objects/imageWithAlt.ts` | Required alt |
| `scripts/generate-seed.mjs` | WebP paths for seed assets |

---

## Performance / SEO benefit

- **Smaller every-page logo bytes** (header symbol ~197 KB → ~11 KB source; CF can still serve `format=auto`).
- **No YouTube iframe API / player JS** until play — major third-party savings on homepage and program pages with video.
- **404s** are titled correctly, `noindex`, and offer internal links (better recovery + clearer logs).
- **Valid event markup** for assistive tech.
- **Meaningful gallery alt** for image search / a11y; Studio forces alt on new edits.
- **Richer social previews** for program/retreat shares.
- **Cleaner indexing signals** on thank-you / register.

---

## Trade-offs

| Trade-off | Detail |
|-----------|--------|
| Original PNG/JPG kept on disk | Slight repo size; not requested at runtime. Safe rebuild sources. |
| Required CMS alt | Existing documents without alt show Studio validation errors until filled; runtime fallback still covers live HTML. |
| YouTube needs a click | Autoplay-on-load is gone (intentional). First click starts playback via `autoplay: 1`. |
| OG still falls back to brand card | When a program/retreat has no image. |
| Bhastrika WebP ~91 KB | Under the ~100 KB target; slightly recompressed vs q80. |

---

## Test results

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass (36 routes). Sandbox lacked Sanity CDN DNS during static generation; app fell back to placeholders as designed — build still succeeded. |

---

## Out of scope

- Low Priority items (L1–L7)
- Deploy / git commit (not requested in this task)
- Removing unused original PNG/JPG binaries from `public/images/`
