# Low Priority SEO Fixes — Implementation Report

**Date:** 9 August 2026  
**Scope:** Only Low Priority issues from `SEO-AUDIT.md` (L1–L7)  
**Compared against:** `SEO-AUDIT.md`, `SEO-MEDIUM-PRIORITY-REPORT.md`, `PRODUCTION-SEO-MEDIUM-VERIFICATION.md`  
**Status:** Selective complete — meaningful fixes applied; negligible / blocked items skipped  

No Critical, High, or Medium Priority work was changed. Cloudflare Image Transformations, YouTube click-to-load, structured data, noindex/canonical behavior, and 404 behavior were preserved.

---

## Decision summary

| ID | Issue | Still present? | Decision |
|----|--------|----------------|----------|
| L1 | `/images/*` and `/pdfs/*` lack long-lived cache headers | Yes | **Fixed** |
| L2 | `/favicon.ico` 404 for legacy consumers | Yes | **Fixed** |
| L3 | `og:locale` is `en_GB` | Yes | **Skipped** |
| L4 | Non-standard `Host:` in `robots.txt` | Yes | **Fixed** |
| L5 | Footer uses six `<h2>` link-list labels | Yes | **Fixed** |
| L6 | Manifest icons minimal (no 192/512 maskable) | Yes | **Skipped** |
| L7 | Search-engine verification not in code | Yes | **Skipped** |

Nothing in L1–L7 had already been resolved by earlier SEO work.

---

## Fixed issues

### L1 — Cache headers for `/images/*` and `/pdfs/*`

**Why fix:** Production currently serves public assets with Cloudflare’s default `Cache-Control: public, max-age=0, must-revalidate`, so browsers revalidate on every visit. Longer caching for static logos/photos/PDFs improves repeat-visit performance without changing URLs or image behavior.

**Change:** Extended `public/_headers`:

```
/images/*
  Cache-Control: public,max-age=604800,stale-while-revalidate=86400
/pdfs/*
  Cache-Control: public,max-age=86400
```

Existing `/_next/static/*` immutable rule unchanged.

**Benefit:** Faster repeat loads for brand images, program assets, and the guidelines PDF.  
**Trade-off:** After replacing a file in place (same path), browsers may keep the old version for up to 7 days (images) or 1 day (PDFs). Use a new filename when a hard bust is required.

### L2 — `favicon.ico` for legacy consumers

**Why fix:** Production `GET /favicon.ico` returned **404**. Some crawlers, feed readers, and older tooling still request that path even when `/icon` exists.

**Change:** Added `app/favicon.ico` (Next.js App Router auto-serves it), generated from the brand symbol WebP on a cream background (16/32 sizes in ICO).

**Benefit:** Stops favicon 404 noise; better legacy tooling support.  
**Trade-off:** Separate from the dynamic `/icon` PNG route; keep them visually aligned when the brand mark changes.

### L4 — Remove `Host:` from `robots.txt`

**Why fix:** `Host:` is a legacy Yandex-only directive; Google ignores it. Canonical host is already enforced via the www→apex **308** redirect. Removing the field avoids implying robots.txt controls the host.

**Change:** Dropped `host: SITE_URL` from `app/robots.ts`. Sitemap + allow/disallow rules unchanged.

**Benefit:** Cleaner robots.txt; less misleading crawl metadata.  
**Trade-off:** None for Google; Yandex historically used `Host:` (deprecated in favor of Search Console / redirects).

### L5 — Footer link-list labels are not headings

**Why fix:** Mobile + desktop footers both sit in the DOM, so “Explore / Legal / Contact” appeared as **six `<h2>`s** on every page outline — noise for assistive tech and document outline SEO.

**Change:** Demoted those labels from `<h2 className="eyebrow">` to `<p className="eyebrow">` in both layouts. Visual design unchanged (same class). Did **not** merge mobile/desktop into one markup tree (higher layout risk, little extra SEO gain).

**Benefit:** Cleaner heading outline; less duplicated boilerplate announced to screen readers.  
**Trade-off:** Labels are no longer section headings; list context remains clear from surrounding structure and link text.

---

## Intentionally skipped

### L3 — `og:locale` `en_GB` → `en`

**Still present:** Yes (`lib/seo.ts`, `app/layout.tsx`).

**Why skip:** Harmless and not incorrect for English content. Changing locale tags without a real localization strategy is a speculative SEO tweak. No `sq` site exists yet; when it does, `hreflang` / `alternates.languages` matter more than renaming `en_GB` → `en`.

### L6 — Larger / maskable manifest icons

**Still present:** Yes (`app/manifest.ts` still uses `/icon` 32×32 and `/apple-icon` 180×180).

**Why skip:** Audit notes **zero classic-SEO impact**. This only helps PWA install / some Android surfaces. The site is not positioned as an installable app; generating 192/512 maskable assets would be speculative work with no crawl/ranking benefit.

### L7 — Google/Bing verification meta in code

**Still present:** Yes — no `verification` key in root metadata; no verification token in project env.

**Why skip:** Cannot invent a Search Console token. Verification may already be done via **DNS** (preferred). Adding a placeholder would be incorrect. When a code-based token is available, add `verification: { google: "…" }` to `app/layout.tsx` `generateMetadata` in a dedicated change.

---

## Files changed

| File | Change |
|------|--------|
| `public/_headers` | Cache-Control for `/images/*` and `/pdfs/*` |
| `app/favicon.ico` | **Added** — legacy favicon |
| `app/robots.ts` | Removed `host` |
| `components/layout/Footer.tsx` | Footer labels `h2` → `p.eyebrow` |
| `SEO-LOW-PRIORITY-REPORT.md` | This report |

---

## Expected benefit

- Repeat visitors cache static images/PDFs more effectively (L1).  
- Fewer `/favicon.ico` 404s for crawlers/tools (L2).  
- Cleaner robots.txt without a non-Google directive (L4).  
- Cleaner document outline / less footer heading noise (L5).

---

## Trade-offs (overall)

- In-place image/PDF updates inherit longer browser cache (L1).  
- Favicon is a static ICO alongside the dynamic `/icon` route (L2).  
- Footer column titles are no longer headings (L5) — intentional.

---

## Test results

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass (36 routes). Sandbox may log Sanity CDN DNS fallbacks during SSG; build still succeeds. |

Preserved by design (not modified): structured data, CF image loader, YouTube click-to-load, noindex/canonical rules, 404 metadata/chrome, Medium/Critical/High SEO fixes.

---

## Out of scope

- Medium / High / Critical rework  
- Deploy / git commit (not requested here)  
- Adding Search Console tokens without a provided value  
- PWA icon pack / `og:locale` rename  
- Merging footer mobile/desktop into a single DOM tree
