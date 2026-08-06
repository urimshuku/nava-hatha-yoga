# Critical SEO Fixes — Implementation Report

**Date:** 6 August 2026  
**Scope:** Only Critical Issues from `SEO-AUDIT.md` (C1, C2)  
**Status:** Complete

---

## Summary

Both critical issues are fixed. Above-the-fold content is no longer server-rendered invisible, and local program images now lazy-load with responsive `srcset` (via Cloudflare Image Resizing) and download only one art-directed variant when desktop/mobile crops differ.

---

## C1 — Above-the-fold content invisible until JS hydrates

### What changed

1. **Homepage hero no longer uses motion.** The `<h1>`, subtitle, supporting text, and CTAs render in a plain `<div>` so the LCP text is visible in the first HTML response with no client JS dependency.

2. **Framer Motion entry animations replaced with progressive-enhancement CSS + IntersectionObserver.**
   - SSR / no-JS: content is fully visible (`opacity: 1`).
   - After mount: elements already in the viewport stay visible (marked `.is-visible` immediately — no hide flash).
   - Below-the-fold elements get `.motion-pending` (hidden) only after JS confirms they are off-screen, then fade/rise when they enter view.
   - Stagger timing is preserved via CSS `nth-child` delays (80ms steps).
   - `prefers-reduced-motion` skips hiding and short-circuits transitions.

3. **Removed unused Framer Motion variant helpers** (`fadeUp`, `stagger`) from `lib/utils.ts`. Framer Motion is no longer imported by motion components (dependency left in `package.json` unused — safe to remove later).

### Files modified

| File | Change |
|------|--------|
| `app/(site)/page.tsx` | Unwrapped hero from `MotionReveal` |
| `components/ui/MotionReveal.tsx` | Rewrote as SSR-visible IO + CSS reveal |
| `components/ui/Motion.tsx` | `MotionStagger` → plain container; `MotionItem` → `MotionReveal` |
| `app/globals.css` | Added `.motion-reveal` / `.motion-stagger` styles + reduced-motion override |
| `lib/utils.ts` | Removed `fadeUp` / `stagger` exports |

### Why this improves SEO / Core Web Vitals

- **LCP:** Hero headline is paint-ready in the initial HTML instead of waiting for JS download + hydration to clear `opacity: 0`.
- **Crawlability:** Content is readable without executing JS (useful for previews, partial crawlers, and faster Google rendering).
- **INP / TBT:** Dropping Framer Motion from these components reduces client JS work on every page that used reveals.

### Trade-offs / remaining concerns

- Above-the-fold sections that still wrap in `MotionReveal` (e.g. homepage highlights, just below the hero) will **not** animate on first paint if they are already in view — they appear immediately. Below-fold animation behavior is unchanged in spirit.
- Scroll-reveal animation now depends on class toggling rather than Framer; timing/easing matches the previous curve, but micro-differences in stagger feel are possible.
- `framer-motion` remains in `package.json` but is unused — optional cleanup, not an SEO issue.

---

## C2 — Eager, unoptimized local program images

### What changed

1. **Removed `loading="eager"`** so non-priority images use the browser/Next default (`lazy`). Listing pages no longer force-fetch every program photo on load.

2. **Removed `unoptimized`** so Next.js emits responsive `srcset`/`sizes`.

3. **Added a Cloudflare Image Resizing custom loader** (`image-loader.ts`) wired in `next.config.mjs`. Production local images are served as `/cdn-cgi/image/width=…,quality=75,format=auto/…` (AVIF/WebP when supported). Remote Sanity URLs pass through unchanged. Dev serves originals.

4. **Art direction uses `<picture>`** when a desktop variant exists (currently `yogasanas`). Only one asset downloads per viewport; CSS `hidden lg:block` dual-`<Image>` pattern is gone. Object-position for that case uses `object-center lg:object-left`.

### Files modified

| File | Change |
|------|--------|
| `components/ui/LocalProgramImage.tsx` | Lazy by default; `getImageProps` + `<picture>` for art direction; `Image` for single-src |
| `image-loader.ts` | **New** — Cloudflare `/cdn-cgi/image/` loader |
| `next.config.mjs` | `images.loader: "custom"` + `loaderFile` |
| `lib/local-images.ts` | Added `programPictureObjectPositionClass()` |

### Why this improves SEO / Core Web Vitals

- **LCP / bandwidth:** Program listing pages stop competing with the LCP candidate by downloading 13 full-size images immediately.
- **Payload:** Responsive widths + `format=auto` shrink bytes on mobile vs shipping full JPG/WebP sources.
- **Art direction:** Mobile no longer downloads the unused desktop crop (and vice versa).

### Trade-offs / remaining concerns

- **Cloudflare Image Transformations must be enabled** on the `navahathayoga.com` zone. If they are not, `/cdn-cgi/image/…` URLs may 403 in production until Transformations (Image Resizing) is turned on in the Cloudflare dashboard. Local `next dev` is unaffected (loader returns the original `src`).
- Sanity images already use Sanity’s CDN resize URLs and are intentionally **not** re-routed through Cloudflare (remote URLs bypass the loader).
- Source files that are still heavy (e.g. `bhastrika-kriya.jpg` at 444 KB) benefit from edge resizing, but **compressing/re-exporting sources** remains a Medium-priority audit item (M1) and was not done here.
- Program detail pages still do not set `priority` on the sidebar image; that is intentional (audit said keep priority only when above-the-fold). Lazy is correct for cards; if Lighthouse later flags the detail sidebar as LCP, add `priority` there only.

---

## Verification

- `npm run typecheck` — passed
- ESLint on touched files — passed
- No High / Medium / Low audit items were implemented

## Suggested next steps (out of scope)

1. Confirm Cloudflare Image Transformations is enabled for the production zone and spot-check a program image URL after deploy.
2. Proceed with High Priority items from `SEO-AUDIT.md` (font WOFF2, structured data, robots/`thank-you`, sitemap `lastmod`, homepage title).
