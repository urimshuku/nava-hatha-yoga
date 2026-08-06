# Production SEO Verification

**Site:** https://navahathayoga.com  
**Checked:** 6 August 2026  
**Method:** Live HTTP fetches of HTML, `robots.txt`, `sitemap.xml`, fonts, images, and JSON-LD (not local-only).  
**Compared against:** `SEO-AUDIT.md`, `SEO-CRITICAL-FIXES-REPORT.md`, `SEO-HIGH-PRIORITY-REPORT.md`

---

## Executive verdict

**The Critical and High Priority SEO fixes exist in the local codebase but are not live on production.**

Production still serves the pre-fix build:

- Homepage hero is SSR’d with Framer-style `style="opacity:0"` (C1 not deployed).
- Montserrat still loads as **TTF**, not WOFF2 (H1 not deployed).
- No Event / Course / BreadcrumbList JSON-LD; LocalBusiness lacks logo/geo/priceRange (H2 not deployed).
- `robots.txt` still `Disallow: /thank-you` (H4 not deployed).
- Sitemap still stamps every URL with the same `lastmod` (H5 not deployed).
- Cloudflare `/cdn-cgi/image/…` returns **404** (Transformations not enabled / not used yet).

Additionally, production has two live issues independent of “not deployed yet”:

1. Homepage HTML has **no `<title>` tag**.
2. `/opengraph-image` returns **HTTP 500**.

No code changes were made in this verification pass.

---

## Passed checks

| # | Check | Result | Evidence |
|---|--------|--------|----------|
| 3* | Image requests for URLs actually used in live HTML | **Pass** | 160 decoded `/_next/image?…` URLs from program pages → all **200** |
| 4 | Responsive `srcset` + `sizes` on program cards | **Pass** | `/programs` — 13 program images with ~10 `srcSet` widths and `sizes="(max-width: 768px) 100vw, 33vw"` |
| 5 | Dual mobile+desktop local variant download | **Pass (N/A on live)** | No CSS-toggled dual `<img>` pattern; program photos come from Sanity via `/_next/image` |
| 11† | `/thank-you` returns HTML with `noindex` | **Pass** | `200`, `<meta name="robots" content="noindex, nofollow"/>`, has `<h1>` |
| 14 | Canonical URLs use production domain | **Pass** | e.g. `https://navahathayoga.com`, `…/events`, `…/programs/surya-kriya` |
| 15a | OG/Twitter image/url fields are absolute | **Pass (URL form)** | `og:url`, `og:image`, `twitter:image` use `https://navahathayoga.com/…` |
| — | `www` → apex | **Pass** | `https://www.navahathayoga.com/` → **308** → `https://navahathayoga.com/` |
| — | Heading fonts load | **Pass** | Cormorant Garamond `.woff` → **200** |

\*Pass for the **current** production image pipeline (`/_next/image`). Does **not** mean Cloudflare Image Transformations work (see Failed #2).  
†Page is fine when fetched directly; crawlability is undermined by robots `Disallow` (see Failed #12).

---

## Failed checks

### 1. Homepage hero visible in initial SSR HTML — **FAIL**

**Expected (C1):** Hero `<h1>` visible in first HTML (no JS-dependent hide).  
**Live:** Hero text is in the HTML **but not visible**:

```html
<div class="mx-auto max-w-3xl text-center" style="opacity:0;transform:translateY(16px)">
  <h1 …>Nava Classical Hatha Yoga - Now in Albania, and Beyond.</h1>
```

**Affected URL:** https://navahathayoga.com/

**Why:** Production still uses Framer Motion `initial="hidden"`. Local fix (unwrap hero + progressive CSS reveal) is not deployed.  
**Fix:** Deploy the branch that contains C1 (`SEO-CRITICAL-FIXES-REPORT.md`). Re-fetch and confirm no `opacity:0` on the hero wrapper.

---

### 2. Program images via Cloudflare Image Transformations — **FAIL**

**Expected (C2):** Production local/optimized images via `/cdn-cgi/image/width=…,quality=…,format=auto/…`.  
**Live:** All tested transform URLs return **404** HTML:

| URL | Status |
|-----|--------|
| https://navahathayoga.com/cdn-cgi/image/width=640,quality=75,format=auto/images/programs/upa-yoga.jpg | **404** |
| https://navahathayoga.com/cdn-cgi/image/width=640,quality=75,format=auto/images/programs/surya-kriya.webp | **404** |
| https://navahathayoga.com/cdn-cgi/image/width=640,quality=75,format=auto/images/programs/yogasanas.webp | **404** |
| https://navahathayoga.com/cdn-cgi/image/width=640,quality=75,format=auto/images/programs/yogasanas-desktop.webp | **404** |

Raw assets work (e.g. `/images/programs/upa-yoga.jpg` → **200**). Live HTML currently uses `/_next/image`, not `/cdn-cgi/image/`.

**Fix:**

1. Enable **Cloudflare Image Transformations** (Image Resizing) on the `navahathayoga.com` zone.
2. Confirm a transform URL returns **200** + an image.
3. Deploy the C2 custom loader (`image-loader.ts` + `next.config.mjs`).
4. Re-check program listing HTML for `/cdn-cgi/image/` in `src`/`srcSet`.

**Do not deploy the custom loader before step 1** — optimized URLs will 404.

---

### 3. No image 403/404/5xx — **PASS for live HTML; FAIL for CF transforms**

- Images referenced in live HTML (`/_next/image?…`): **all 200** (after HTML-entity decode).
- Cloudflare transform URLs (not yet in HTML): **404**.

Treat CF transforms as failed until enabled (see #2).

---

### 6. Montserrat WOFF2; no TTF request — **FAIL**

**Live preload:**

`/_next/static/media/Montserrat%5Bwght%5D-s.p.3jtw53q37e1ol.ttf` → **200** `font/ttf`

No Montserrat `.woff2` in homepage HTML. Local H1 WOFF2 subset is not deployed.

**Affected URL:** https://navahathayoga.com/  
**Fix:** Deploy High Priority font change (`lib/fonts.ts` + `assets/fonts/Montserrat[wght].woff2`). Confirm Network shows WOFF2 only.

---

### 7. Event JSON-LD on intended pages — **FAIL**

| URL | Event JSON-LD |
|-----|----------------|
| https://navahathayoga.com/ | Missing (only `HealthAndBeautyBusiness`) |
| https://navahathayoga.com/events | Missing |
| https://navahathayoga.com/programs/surya-kriya | Missing |
| https://navahathayoga.com/programs/upa-yoga | Missing |
| https://navahathayoga.com/programs/yogasanas | Missing |

**Fix:** Deploy H2 (`lib/structured-data.ts`, `JsonLd` on home/events/program pages). Validate with Rich Results Test.

---

### 8. Course JSON-LD on every program detail page — **FAIL**

Checked:

- https://navahathayoga.com/programs/surya-kriya  
- https://navahathayoga.com/programs/upa-yoga  
- https://navahathayoga.com/programs/yogasanas  

Only site-wide `HealthAndBeautyBusiness`. No `Course`.

**Fix:** Deploy H2 program Course schema. Sitemap lists 13 program URLs — all need Course after deploy.

---

### 9. BreadcrumbList on program and retreat detail pages — **FAIL**

- Program details: no `BreadcrumbList`.
- Retreat details: **none in sitemap** (0 `/retreats/{slug}` URLs); `/retreats` listing has no detail links in HTML.

**Fix:** Deploy H2 breadcrumbs with program pages. When retreats exist in CMS, confirm detail URLs appear in sitemap + BreadcrumbList (+ Event if dated).

---

### 10. LocalBusiness enriched fields — **FAIL**

Live org node includes: `name`, `url`, `email`, `telephone`, `address`, `areaServed`, `knowsAbout`.

**Missing vs H2 / this checklist:** `image`, `logo`, `geo`, `priceRange`, `@id`.

**Affected URL:** all public pages (layout JSON-LD), e.g. https://navahathayoga.com/

**Fix:** Deploy enriched `buildOrganizationJsonLd`.

---

### 12. `robots.txt` must not disallow `/thank-you` — **FAIL**

Live https://navahathayoga.com/robots.txt includes:

```
Disallow: /studio
Disallow: /api/
Disallow: /thank-you
```

Local `app/robots.ts` already removed `/thank-you` — **not deployed**.

**Fix:** Deploy H4. Confirm live robots no longer lists `/thank-you`.

---

### 13. Sitemap honest `lastmod` — **FAIL**

https://navahathayoga.com/sitemap.xml — **23 URLs**, all:

`<lastmod>2026-08-06T14:11:31.546Z</lastmod>`

(identical “now” stamp).

**Fix:** Deploy H5 (`_updatedAt` for programs/retreats; omit fake lastmod on static routes).

---

### 15b. Open Graph image resolves — **FAIL (production)**

| URL | Status |
|-----|--------|
| https://navahathayoga.com/opengraph-image | **500** `Internal Server Error` |

`og:image` / `twitter:image` correctly point at that absolute URL, but the asset is broken for crawlers/social.

**Fix (production):** Diagnose OpenNext/`ImageResponse` failure for `app/opengraph-image.tsx` (often font file path / Workers FS). Fix and redeploy; confirm **200** + `image/png`.

---

### Homepage document title — **FAIL (production)**

https://navahathayoga.com/ — **no `<title>`** in SSR HTML (other routes do have titles, e.g. events/programs).

`og:title` / `twitter:title` are present but only `"Nava Hatha Yoga"` (H6 keyword title not live).

**Fix:** Deploy H6 homepage title. After deploy, confirm `<title>Classical Hatha Yoga in Saranda, Albania · Nava Hatha Yoga</title>` (or CMS override). If still missing, investigate OpenNext metadata streaming for `/` only.

---

## Warnings

1. **Deploy gap:** Local Critical + High Priority work will not affect Google until Cloudflare deploy.
2. **Deploy order for images:** Enable Image Transformations **before** shipping the custom Cloudflare loader.
3. **`/thank-you` + robots:** Page has `noindex`, but `Disallow: /thank-you` can yield “Indexed, though blocked by robots.txt” if linked.
4. **OG/Twitter titles on home** are brand-only until H6 is live.
5. **No retreat detail URLs** in production sitemap — Breadcrumb/Event for retreats can’t be verified until content exists.
6. **Sanity vs local program images:** Live cards use Sanity + `/_next/image` (working). After C2 deploy, local-fallback paths depend on CF transforms; Sanity remotes intentionally bypass the CF loader.
7. Cloudflare-managed robots preamble also blocks AI bots (`GPTBot`, etc.) — intentional CF feature, not from app `robots.ts`.

---

## Checklist summary (1–15)

| # | Item | Status |
|---|------|--------|
| 1 | Hero visible in SSR | **FAIL** (`opacity:0`) |
| 2 | CF Image Transformations | **FAIL** (404) |
| 3 | No bad image statuses (in-use URLs) | **PASS** |
| 4 | `srcset` / `sizes` | **PASS** |
| 5 | No dual variant download | **PASS** |
| 6 | Montserrat WOFF2 | **FAIL** (TTF) |
| 7 | Event JSON-LD | **FAIL** |
| 8 | Course JSON-LD | **FAIL** |
| 9 | BreadcrumbList | **FAIL** |
| 10 | LocalBusiness complete | **FAIL** |
| 11 | `/thank-you` + noindex | **PASS** (page) |
| 12 | robots no `/thank-you` Disallow | **FAIL** |
| 13 | Sitemap lastmod | **FAIL** |
| 14 | Canonical production domain | **PASS** |
| 15 | Absolute OG/Twitter URLs | **PASS** form / **FAIL** image 500 |

---

## Recommended fixes (ordered)

1. **Enable Cloudflare Image Transformations** on the zone; verify a `/cdn-cgi/image/…` URL returns 200.
2. **Deploy** the local Critical + High Priority SEO branch to production (OpenNext/Cloudflare).
3. **Fix `/opengraph-image` 500** on Workers (font/path); confirm 200 PNG.
4. **Re-run this verification** against live URLs after deploy.
5. Validate Event + Course with [Google Rich Results Test](https://search.google.com/test/rich-results) on `/events` and one `/programs/{slug}`.

---

## Exact URLs sampled

- https://navahathayoga.com/
- https://navahathayoga.com/events
- https://navahathayoga.com/programs
- https://navahathayoga.com/programs/surya-kriya
- https://navahathayoga.com/programs/upa-yoga
- https://navahathayoga.com/programs/yogasanas
- https://navahathayoga.com/retreats
- https://navahathayoga.com/thank-you
- https://navahathayoga.com/robots.txt
- https://navahathayoga.com/sitemap.xml
- https://navahathayoga.com/opengraph-image
- https://www.navahathayoga.com/ (308 → apex)
- https://navahathayoga.com/cdn-cgi/image/width=640,quality=75,format=auto/images/programs/upa-yoga.jpg
