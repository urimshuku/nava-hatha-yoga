# Production SEO Verification V2

**Site:** https://navahathayoga.com  
**Checked:** 6 August 2026 (post Git push)  
**Method:** Live HTTP fetches of HTML, `robots.txt`, `sitemap.xml`, fonts, images, and JSON-LD. No code changes in this pass.  
**Compared against:** `SEO-CRITICAL-FIXES-REPORT.md`, `SEO-HIGH-PRIORITY-REPORT.md`, `PRE-DEPLOYMENT-CHECK.md`, `PRODUCTION-SEO-VERIFICATION.md`

---

## Deploy alignment

| Item | Value |
|------|--------|
| Local `HEAD` | `f62aa0502fa921039fe89aa06f99102192ab4cff` |
| `origin/main` | `f62aa0502fa921039fe89aa06f99102192ab4cff` |
| Commit | `f62aa05` — *Ship Critical and High Priority SEO fixes for production.* |
| Local ↔ remote | Match (`main` / `origin/main` aligned) |
| Deployed site vs pushed version | **Yes — appears to match** |

**Deploy match evidence (live HTML / assets):**

- Homepage title: `Classical Hatha Yoga in Saranda, Albania · Nava Hatha Yoga`
- Hero has no Framer `opacity:0` wrapper
- Montserrat preloads as `.woff2` (no `.ttf`)
- `og:image` → `/images/og-default.png` (200 `image/png`); legacy `/opengraph-image` → 308 → same PNG
- Event / Course / BreadcrumbList JSON-LD present
- LocalBusiness/`HealthAndBeautyBusiness` includes `@id`, logo, image, geo, priceRange
- `robots.txt` no longer disallows `/thank-you`
- Sitemap omits fake “now” `lastmod` on static URLs; program `lastmod` values come from Sanity `_updatedAt`

---

## Executive verdict

**Critical and High Priority SEO fixes are live on production** after deploy + push. Previous V1 failures (invisible hero, missing title, TTF font, missing JSON-LD, robots Disallow thank-you, identical sitemap lastmods, CF 404s, OG 500) are resolved for the intended checks.

One residual issue: the Isha/Sadhguru certification logo is an `.avif` served through `/cdn-cgi/image/…` and returns **HTTP 415** (raw `/images/Sadhguru_Gurukulam_Logo.avif` is **200**). Program and brand PNG/JPEG/WebP transforms return **200**.

---

## Checklist (15)

| # | Check | Result |
|---|--------|--------|
| 1 | Homepage hero visible in initial HTML; no `opacity: 0` | ✅ Passed |
| 2 | Homepage SSR HTML contains a valid `<title>` | ✅ Passed |
| 3 | Montserrat loads as WOFF2; old TTF not requested | ✅ Passed |
| 4 | Cloudflare `/cdn-cgi/image/` transformation URLs return HTTP 200 | ⚠ Warning |
| 5 | Program pages use the intended responsive image pipeline | ✅ Passed |
| 6 | Event JSON-LD on the intended pages | ✅ Passed |
| 7 | Course JSON-LD on every program detail page | ✅ Passed |
| 8 | BreadcrumbList on program and applicable retreat detail pages | ✅ Passed |
| 9 | LocalBusiness contains `@id`, logo, image, geo, priceRange | ✅ Passed |
| 10 | `robots.txt` no longer disallows `/thank-you` | ✅ Passed |
| 11 | `/thank-you` still contains `noindex` | ✅ Passed |
| 12 | Sitemap does not use the same fake current `lastModified` for every URL | ✅ Passed |
| 13 | Open Graph image URL returns HTTP 200 with an image content type | ✅ Passed |
| 14 | Canonical, Open Graph, and Twitter URLs use the production domain | ✅ Passed |
| 15 | No new 403, 404, or 500 responses introduced | ✅ Passed |

---

## Detailed results

### 1. Homepage hero visible — ✅ Passed

- `<h1>` present in initial HTML: *Nava Classical Hatha Yoga - Now in Albania, and Beyond.*
- Hero wrapper has **no** `style="opacity:0;…"`.
- Aligns with C1 (`SEO-CRITICAL-FIXES-REPORT.md`).

### 2. Homepage `<title>` — ✅ Passed

```html
<title>Classical Hatha Yoga in Saranda, Albania · Nava Hatha Yoga</title>
```

Matches H6. V1 had **no** `<title>` on production.

### 3. Montserrat WOFF2 — ✅ Passed

- Preload: `/_next/static/media/Montserrat%5Bwght%5D-s.p.1tmxtaoimdqvs.woff2`
- Font URL → **200** `font/woff2`
- No Montserrat `.ttf` referenced in homepage HTML (H1).

### 4. Cloudflare Image Transformations — ⚠ Warning

**Working (200 + image content-type):**

| URL | Status |
|-----|--------|
| `/cdn-cgi/image/width=640,quality=75,format=auto/images/nava-logo-symbol-v2.png` | **200** `image/avif` |
| `/cdn-cgi/image/width=640,quality=75,format=auto/images/programs/upa-yoga.jpg` | **200** `image/avif` |
| `/cdn-cgi/image/width=640,quality=75,format=auto/images/programs/yogasanas.webp` | **200** `image/avif` |
| `/cdn-cgi/image/width=640,quality=75,format=auto/images/programs/yogasanas-desktop.webp` | **200** `image/avif` |

**Broken:**

| URL | Status |
|-----|--------|
| `/cdn-cgi/image/width=640,quality=75,format=auto/images/Sadhguru_Gurukulam_Logo.avif` | **415** |
| Raw `/images/Sadhguru_Gurukulam_Logo.avif` | **200** `image/avif` |

Live HTML includes many `/cdn-cgi/image/…/Sadhguru_Gurukulam_Logo.avif` `srcSet` entries (certification badge). CF Image Transformations reject re-encoding that AVIF source (`format=auto`). Core C2 program/brand pipeline is healthy; this badge is a residual transform failure.

### 5. Program responsive image pipeline — ✅ Passed

- `/programs`: **0** `/_next/image?` URLs; program cards use Sanity CDN URLs with `srcset` + `sizes` (13 cards). Remote Sanity sources bypass the CF loader by design (`image-loader.ts`).
- Local assets (nav logo, local program files when used) go through `/cdn-cgi/image/…`.
- Program detail pages include CF-transformed local assets + Sanity images with responsive attributes.
- `<picture>` art-direction (yogasanas desktop/mobile) applies only when `LocalProgramImage` is used **without** a Sanity image. Live program photos are Sanity-backed, so `<picture>` is unused on current detail HTML — expected for the CMS-first `ProgramImage` path.

### 6. Event JSON-LD — ✅ Passed

| Page | Event count (sampled) | Other |
|------|----------------------|--------|
| `/` | 3 Events | Org schema present |
| `/events` | 5 Events | Org schema present |

Example (home): Surya Kriya / Surya Shakti with `startDate` values.

### 7. Course JSON-LD — ✅ Passed

All **13** program detail pages return Course JSON-LD:

`angamardana`, `bhastrika-kriya`, `bhuta-shuddhi`, `childrens-program`, `eye-care-practices`, `jala-neti`, `pavanamuktasana`, `shanmukhi-mudra`, `surya-kriya`, `surya-shakti`, `thoppukarnam`, `upa-yoga`, `yogasanas`

Example: Yogasanas Course with `url`, `description`, `provider.@id`.

### 8. BreadcrumbList — ✅ Passed

- All **13** program detail pages include BreadcrumbList (Home → Programs → {Program}).
- **Retreat detail pages:** none in sitemap / no `/retreats/{slug}` links on `/retreats` (0 retreats). Breadcrumb on retreat details is **N/A** until retreat content exists.

### 9. LocalBusiness enriched fields — ✅ Passed

Org type on live site: `HealthAndBeautyBusiness` (schema.org subtype of LocalBusiness), with:

| Field | Live value |
|-------|------------|
| `@id` | `https://navahathayoga.com/#organization` |
| `logo` | `https://navahathayoga.com/images/nava-hatha-yoga-logo.png` |
| `image` | `https://navahathayoga.com/images/nava-hatha-yoga-logo.png` |
| `geo` | `latitude` 39.8756, `longitude` 20.0049 |
| `priceRange` | `€€` |

### 10. robots.txt — `/thank-you` — ✅ Passed

App rules:

```
User-Agent: *
Allow: /
Disallow: /studio
Disallow: /api/
```

No `Disallow: /thank-you`. (Cloudflare-managed bot blocks above the app block are unrelated.)

### 11. `/thank-you` noindex — ✅ Passed

- HTTP **200**
- `<meta name="robots" content="noindex, nofollow"/>`
- Title: `Thank You · Nava Hatha Yoga`

### 12. Sitemap lastmod — ✅ Passed

- **23** URLs total
- **10** static URLs: **no** `<lastmod>` (not stamped with “now”)
- **13** program URLs: Sanity `_updatedAt` values — **4 distinct** timestamps, e.g.:
  - `2026-07-24T13:08:48.000Z` (most programs)
  - `2026-08-03T10:03:52.000Z` (upa-yoga)
  - `2026-08-03T11:28:31.000Z` (childrens-program)
  - `2026-08-03T13:58:08.000Z` (surya-shakti)

No longer the V1 pattern of identical current-time `lastmod` on every URL (H5).

### 13. Open Graph image — ✅ Passed

| URL | Status | Content-Type |
|-----|--------|--------------|
| `https://navahathayoga.com/images/og-default.png` | **200** | `image/png` |
| `https://navahathayoga.com/opengraph-image` | **308 → 200** | `image/png` (redirect to OG default) |

V1 `/opengraph-image` **500** is fixed.

### 14. Production domain on social/canonical URLs — ✅ Passed

Homepage:

| Field | Value |
|-------|--------|
| `canonical` | `https://navahathayoga.com` |
| `og:url` | `https://navahathayoga.com` |
| `og:image` | `https://navahathayoga.com/images/og-default.png` |
| `og:title` | `Classical Hatha Yoga in Saranda, Albania · Nava Hatha Yoga` |
| `twitter:image` | `https://navahathayoga.com/images/og-default.png` |
| `twitter:title` | same as `og:title` |
| `twitter:card` | `summary_large_image` |

### 15. No new 403 / 404 / 500 — ✅ Passed

Sampled **26** HTML/document URLs (home, listings, all 13 programs, legal, thank-you, robots, sitemap, events archive): all **200**.

- OG + Montserrat WOFF2: **200**
- Intended CF program/logo transforms: **200**
- No page-level **403 / 404 / 500** observed in this crawl

**Note (not 403/404/500):** Sadhguru logo via CF returns **415** (see check 4). Early V2 URL scraping that truncated CF `srcset` commas produced false 404s; those truncated URLs are not real asset requests.

---

## Comparison to prior reports

| Topic | V1 (`PRODUCTION-SEO-VERIFICATION.md`) | V2 (this report) |
|-------|----------------------------------------|------------------|
| C1 hero `opacity:0` | ❌ Failed | ✅ Passed |
| Homepage `<title>` | ❌ Failed | ✅ Passed |
| Montserrat WOFF2 | ❌ Failed (TTF) | ✅ Passed |
| CF `/cdn-cgi/image/` | ❌ Failed (404) | ⚠ Warning (programs 200; Sadhguru AVIF 415) |
| Event / Course / Breadcrumb | ❌ Failed | ✅ Passed |
| LocalBusiness fields | ❌ Failed | ✅ Passed |
| robots `/thank-you` Disallow | ❌ Failed | ✅ Passed |
| Sitemap fake lastmod | ❌ Failed | ✅ Passed |
| OG image | ❌ Failed (500) | ✅ Passed |
| Deployed vs SEO branch | Not deployed | Matches `f62aa05` on `origin/main` |

`PRE-DEPLOYMENT-CHECK.md` expectations for Critical/High + static OG are met on live production, aside from the Sadhguru AVIF transform **415**.

---

## Residual follow-ups (out of scope for this verification)

1. **Sadhguru/Isha badge:** stop piping `.avif` through `/cdn-cgi/image/…format=auto`, or convert the source to PNG/WebP so transforms succeed.
2. **Retreat BreadcrumbList:** re-check when retreat detail pages exist in CMS/sitemap.
3. Medium / Low items from `SEO-AUDIT.md` remain untouched by design.

---

*Verification only — no application code was changed in this pass.*
