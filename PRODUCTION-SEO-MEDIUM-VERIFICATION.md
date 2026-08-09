# Production SEO Medium Verification

**Site:** https://navahathayoga.com  
**Checked:** 9 August 2026 (post Medium Priority deploy)  
**Method:** Live HTTP fetches + Playwright click test for YouTube. No code changes.  
**Compared against:** `SEO-AUDIT.md`, `SEO-MEDIUM-PRIORITY-REPORT.md`, `PRODUCTION-SEO-VERIFICATION-V2.md`

---

## Deploy alignment

| Item | Value |
|------|--------|
| Local `HEAD` | `00b9eb25133b6cea1675de0d209e7af259cd590c` |
| `origin/main` | `00b9eb25133b6cea1675de0d209e7af259cd590c` |
| Commit | `00b9eb2` — *Implement medium priority SEO improvements* |
| Deployed site vs push | **Yes — appears to match** (WebP logos, YouTube facade, 404 chrome, noindex without canonical, page OG images) |

---

## Executive verdict

**Medium Priority SEO changes are live and working.** Brand WebP sources, YouTube click-to-load, 404 recovery, event-card markup, program OG images, and noindex-without-canonical all verify on production. Critical/High Priority fixes remain intact.

**Warnings only where production has no retreat detail pages** to exercise gallery alt / retreat OG in rendered HTML (0 retreat URLs in sitemap). Runtime fallback code is deployed; there is nothing live to assert against.

---

## Checklist

| # | Check | Result |
|---|--------|--------|
| 1 | Optimized WebP brand/logo assets used in production | ✅ Passed |
| 2 | `teacher-linda.webp` loads successfully | ✅ Passed |
| 3 | `bhastrika-kriya.webp` loads successfully | ✅ Passed |
| 4 | Cloudflare Image Transformations return HTTP 200 for local images | ✅ Passed |
| 5 | No old oversized PNG/JPG unnecessarily requested by live pages | ✅ Passed |
| 6 | YouTube iframe/player scripts not loaded before interaction | ✅ Passed |
| 7 | Clicking YouTube facade loads and starts the video | ✅ Passed |
| 8 | YouTube thumbnail requests return HTTP 200 | ✅ Passed |
| 9 | YouTube facade does not introduce layout shift | ✅ Passed |
| 10 | Invalid URLs return real HTTP 404 | ✅ Passed |
| 11 | 404 page has nav, recovery links, and noindex | ✅ Passed |
| 12 | Event cards no longer contain invalid `<dl>` markup | ✅ Passed |
| 13 | Meaningful gallery images have non-empty alt in HTML | ⚠ Warning |
| 14 | CMS content without alt gets runtime fallback | ⚠ Warning |
| 15 | Program detail pages use page-specific OG images when available | ✅ Passed |
| 16 | Retreat detail pages use page-specific OG images when available | ⚠ Warning |
| 17 | OG image URLs return HTTP 200 | ✅ Passed |
| 18 | `/register` and `/thank-you` remain noindex | ✅ Passed |
| 19 | `/register` and `/thank-you` no longer output canonical links | ✅ Passed |
| 20 | Critical and High Priority fixes remain intact | ✅ Passed |

**Summary:** 17 ✅ Passed · 3 ⚠ Warning · 0 ❌ Failed

---

## Detailed results

### 1. WebP brand/logo assets — ✅ Passed

Homepage HTML references CF-transformed **`.webp`** logos only, e.g.:

`/cdn-cgi/image/width=32,…/images/nava-logo-symbol-v2.webp`

Counts on `/`: `nava-logo-symbol-v2.webp` present; **`.png` logo paths = 0**.

Raw assets:

| URL | Status | Type |
|-----|--------|------|
| `/images/nava-logo-symbol-v2.webp` | **200** | `image/webp` |
| `/images/nava-hatha-yoga-logo.webp` | **200** | `image/webp` |
| `/images/nava-hatha-yoga-header-logo.webp` | **200** | `image/webp` |
| `/images/nava-hatha-yoga-logo-full.webp` | **200** | `image/webp` |
| `/images/nava-hatha-yoga-wordmark.webp` | **200** | `image/webp` |

LocalBusiness schema logo/image now point at `…/nava-hatha-yoga-logo.webp`.

### 2. `teacher-linda.webp` — ✅ Passed

`GET /images/about/teacher-linda.webp` → **200** `image/webp`.

**Note:** `/about` currently renders the teacher photo from **Sanity CDN** (with descriptive alt), so the local WebP is the fallback asset and is not referenced in that page’s HTML. Asset availability is confirmed.

### 3. `bhastrika-kriya.webp` — ✅ Passed

`GET /images/programs/bhastrika-kriya.webp` → **200** `image/webp`.  
CF: `/cdn-cgi/image/width=640,…/images/programs/bhastrika-kriya.webp` → **200**.

**Note:** `/programs/bhastrika-kriya` uses a Sanity cover image in HTML (CMS-first `ProgramImage`). Local WebP is available for fallback / CF transforms.

### 4. Cloudflare transforms — ✅ Passed

| Transform URL | Status |
|---------------|--------|
| `…/nava-logo-symbol-v2.webp` (w=256) | **200** |
| `…/programs/bhastrika-kriya.webp` (w=640) | **200** |
| `…/about/teacher-linda.webp` (w=640) | **200** |
| `…/Sadhguru_Gurukulam_Logo.webp` (w=180) | **200** |

### 5. Old oversized PNG/JPG not requested by live pages — ✅ Passed

Across fetched pages (`/`, `/programs`, program details, `/about`, `/events`, `/register`, `/thank-you`, `/retreats`, 404):

| Legacy path | Mentions in HTML |
|-------------|------------------|
| `nava-logo-symbol-v2.png` | **0** |
| `nava-hatha-yoga-logo.png` | **0** |
| `nava-hatha-yoga-header-logo.png` | **0** |
| `nava-hatha-yoga-logo-full.png` | **0** |
| `nava-hatha-yoga-wordmark.png` | **0** |
| `teacher-linda.png` | **0** |
| `bhastrika-kriya.jpg` | **0** |

Legacy files may still exist as rebuild sources (direct GET can still **200**); they are **not** referenced by live page HTML.

### 6. YouTube scripts not before interaction — ✅ Passed

Homepage initial HTML / Playwright load:

- **No** `youtube.com/iframe_api` before click  
- **No** YouTube embed iframe before click  
- Facade present: `i.ytimg.com` thumbnail + `aria-label="Play video: What is Classical Hatha Yoga?"`

### 7. Click facade loads/starts video — ✅ Passed

Playwright on `https://navahathayoga.com/`:

- Before click: `iframe_api` = false  
- After click: `iframe_api` loaded; `youtube-nocookie.com/embed/…&autoplay=1`; **1** iframe; media requests to `googlevideo.com`

### 8. YouTube thumbnail HTTP 200 — ✅ Passed

`https://i.ytimg.com/vi/UIK3hR-NjYU/hqdefault.jpg` → **200** `image/jpeg`  
Same URL appears in homepage `src` / `srcSet`.

### 9. No layout shift from facade — ✅ Passed

Facade lives in `.aspect-video` container. Playwright bounding box ≈ **766×430** (16:9). Reserved aspect ratio prevents CLS when swapping thumbnail → player.

### 10. Invalid URLs → HTTP 404 — ✅ Passed

`GET /this-page-does-not-exist-seo-verify-404` → **404** (not 200 soft-404).

### 11. 404 page chrome / recovery / noindex — ✅ Passed

| Check | Evidence |
|-------|----------|
| Title | `Page not found · Nava Hatha Yoga` |
| Robots | `noindex` (also `noindex, nofollow` present in document) |
| Nav / footer | Primary `<nav>` + `<footer>` present |
| Recovery links | `/`, `/programs`, `/events`, `/contact` |
| H1 | `This page rests elsewhere` |

### 12. Event cards without invalid `<dl>` — ✅ Passed

`/events` HTML: **0** `<dl>` / **0** `<dt>`. Detail rows remain in a grid `<div>` with `sr-only` labels.

### 13. Gallery alt text in rendered HTML — ⚠ Warning

**No retreat detail URLs** in sitemap or on `/retreats` (0 `/retreats/{slug}` links). Gallery markup cannot be asserted on a live page.

Deployed `Gallery.tsx` still implements non-empty alt via CMS alt or `` `${title} — photo ${n}` ``.

### 14. Runtime alt fallback for missing CMS alt — ⚠ Warning

Same as #13: no live gallery pages to observe fallback HTML. Logic is present in the deployed codebase; Studio alt is also **required** on `imageWithAlt` (schema-level).

### 15. Program page-specific OG images — ✅ Passed

| Page | `og:image` |
|------|------------|
| `/programs/bhastrika-kriya` | Sanity CDN 1200×630 crop (**not** default OG) |
| `/programs/surya-kriya` | Sanity CDN 1200×630 crop |
| `/programs/yogasanas` | Sanity CDN 1200×630 crop |

### 16. Retreat page-specific OG images — ⚠ Warning

No published retreat detail pages to verify. Implementation is in `app/(site)/retreats/[slug]/page.tsx`; N/A on current production content.

### 17. OG image URLs HTTP 200 — ✅ Passed

| URL | Status | Type |
|-----|--------|------|
| Program Sanity OG (bhastrika sample) | **200** | `image/jpeg` |
| Program Sanity OG (surya sample) | **200** | `image/jpeg` |
| Default `/images/og-default.png` | **200** | `image/png` |

### 18. `/register` & `/thank-you` noindex — ✅ Passed

Both: `robots` = `noindex, nofollow`.

### 19. No canonical on noindex pages — ✅ Passed

Both pages: **no** `rel="canonical"` link.

### 20. Critical / High Priority regressions — ✅ Passed

| Prior fix | Live evidence |
|-----------|----------------|
| Hero SSR visibility | Homepage `<h1>` present; no `opacity:0` on hero wrapper |
| Homepage title | `Classical Hatha Yoga in Saranda, Albania · Nava Hatha Yoga` |
| Montserrat WOFF2 | Preload `.woff2` → **200** `font/woff2` |
| Event JSON-LD | `/events` has Event nodes (5) |
| Course + Breadcrumb | `/programs/bhastrika-kriya` has `Course`, `BreadcrumbList` |
| LocalBusiness fields | `@id`, `logo`, `image`, `geo`, `priceRange` present |
| robots.txt | No `Disallow: /thank-you` |
| Sitemap lastmod | 10 static URLs without lastmod; 13 program URLs with **4 distinct** `_updatedAt` values |
| OG fallback | Homepage `og:image` = `/images/og-default.png` **200** |

---

## Error-status sweep

Sampled HTML routes, WebP assets, CF transforms, YT thumbnail, OG images, intentional 404:

- **No new 403 / 415 / 500** observed  
- Intentional unknown path → **404** only  
- Legacy PNG/JPG rebuild sources still **200** if requested directly (not used by page HTML)

---

## Notes

1. **CMS-first images:** About teacher photo and many program covers come from Sanity; optimized local WebPs remain correct fallbacks and transform cleanly through CF.  
2. **Gallery / retreat OG warnings** clear once a retreat with a gallery is published.  
3. Verification only — **no code was modified** in this pass.
