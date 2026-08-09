# Final SEO Audit — Production

**Site:** https://navahathayoga.com  
**Audited:** 9 August 2026  
**Method:** Live production crawl (HTTP, HTML, robots, sitemap, assets, redirects). No code changes.  
**Compared against:** `SEO-AUDIT.md`, Critical/High/Medium/Low implementation reports, and production verification reports (V2 / Medium / Low).  
**Deployed commit:** `a785590` (*Implement low priority SEO improvements*)

---

## Executive summary

The original Critical, High, and Medium Priority issues from `SEO-AUDIT.md` are **fixed on production**. Low Priority items that were chosen for implementation (L1, L2, L4, L5) are also **fixed**. L3, L6, and L7 remain **intentionally skipped**.

The site’s technical SEO foundation is now strong: indexable pages have unique titles, descriptions, canonicals, healthy heading outlines, Event/Course/Breadcrumb JSON-LD, optimized fonts/images, deferred YouTube, and correct robots/sitemap/noindex behavior.

**New remaining technical issue found in this pass:** dynamic `/icon` and `/apple-icon` routes return **HTTP 500** on Cloudflare (same class of Workers limitation that previously broke dynamic OG). `/favicon.ico` works (**200**). HTML still links to the broken `/icon` and `/apple-icon` routes (and the web manifest points at them).

---

## Original issue status matrix

### Critical

| ID | Issue | Status | Live evidence |
|----|--------|--------|----------------|
| C1 | Hero / ATF SSR `opacity: 0` | ✅ Fixed | Homepage `<h1>` visible; no `opacity:0` on hero wrapper |
| C2 | Eager / unoptimized local program images | ✅ Fixed | `/cdn-cgi/image/` pipeline live; no `/_next/image?` on sampled pages; responsive `srcset` |

### High

| ID | Issue | Status | Live evidence |
|----|--------|--------|----------------|
| H1 | Montserrat 728 KB TTF | ✅ Fixed | Montserrat `.woff2` preload; **200** `font/woff2` |
| H2 | Missing Event / Course / Breadcrumb / thin LocalBusiness | ✅ Fixed | Events + Course + BreadcrumbList JSON-LD; org has `@id`, logo, image, geo, priceRange |
| H3 | Listing `h1` → `h3` with no `h2` | ✅ Fixed | `/programs` has `h2` section labels; `/events` & archive use `h2` card titles |
| H4 | robots `Disallow: /thank-you` vs noindex | ✅ Fixed | No thank-you disallow; page is `noindex, nofollow` |
| H5 | Fake identical sitemap `lastModified` | ✅ Fixed | Static URLs omit lastmod; programs use distinct Sanity `_updatedAt` values |
| H6 | Homepage title / og:title weak & inconsistent | ✅ Fixed | Title + og:title = `Classical Hatha Yoga in Saranda, Albania · Nava Hatha Yoga` |

### Medium

| ID | Issue | Status | Live evidence |
|----|--------|--------|----------------|
| M1 | Oversized logo/photo sources | ✅ Fixed | WebP brand assets in HTML; CF transforms **200** |
| M2 | YouTube API on load | ✅ Fixed | Homepage facade (`i.ytimg.com` + play button); no `iframe_api` before click |
| M3 | Bare 404 / no metadata | ✅ Fixed | Unknown URLs → **404**; titled “Page not found”; nav/footer; `noindex` |
| M4 | Invalid event-card `<dl>` | ✅ Fixed | `/events`: **0** `<dl>` |
| M5 | Gallery empty alt | ✅ Fixed | Schema requires alt + runtime fallback in code; **no live retreat galleries** to re-assert HTML |
| M6 | Single generic OG image everywhere | ✅ Fixed | Program details use Sanity OG URLs; homepage keeps default OG |
| M7 | Canonical on noindex pages | ✅ Fixed | `/register` & `/thank-you`: no `rel=canonical` |

### Low

| ID | Issue | Status | Live evidence |
|----|--------|--------|----------------|
| L1 | Weak cache headers for `/images/*`, `/pdfs/*` | ✅ Fixed | Images: `max-age=604800,stale-while-revalidate=86400`; PDF: `max-age=86400` |
| L2 | `/favicon.ico` 404 | ✅ Fixed | **200** `image/vnd.microsoft.icon` |
| L3 | `og:locale` is `en_GB` | ➖ Intentionally skipped | Still `en_GB`; harmless; no `sq` locale yet |
| L4 | robots `Host:` directive | ✅ Fixed | No `Host:` in live robots |
| L5 | Footer six `<h2>` labels | ✅ Fixed | Labels are `p.eyebrow` (0 matching `<h2>`s) |
| L6 | Minimal manifest icons / no maskable 512 | ➖ Intentionally skipped | Manifest still 32×32 `/icon` + 180 `/apple-icon` only |
| L7 | Search Console verification not in code | ➖ Intentionally skipped | No `google-site-verification` meta; may already use DNS |

---

## Independent production recheck

### Indexability

| Surface | Result |
|---------|--------|
| Marketing pages | `index, follow` + self-canonical on production host |
| `/register`, `/thank-you` | `noindex, nofollow`, no canonical |
| `/studio`, `/api/` | Disallowed in robots |
| Soft-404 risk | Low — unknown paths return real **404** |

### robots.txt

- App rules: `Allow: /`, `Disallow: /studio`, `Disallow: /api/`, sitemap URL present  
- No `Disallow: /thank-you`  
- No `Host:`  
- Cloudflare-managed AI/bot blocks appear above the app block (expected)

### sitemap.xml

- **23** URLs (home, listings, legal, 13 programs)  
- **0** retreat detail URLs (no published retreats)  
- `/register` and `/thank-you` correctly **absent**  
- Program `lastmod` values are distinct CMS timestamps (not “now” for everything)

### Canonical URLs

- Indexable pages canonicalize to `https://navahathayoga.com…`  
- www → apex **308**  
- Noindex pages omit canonical  

### Titles & meta descriptions

| Page | Title | Description present |
|------|-------|---------------------|
| Home | Classical Hatha Yoga in Saranda, Albania · Nava Hatha Yoga | Yes (~126 chars) |
| Programs | Programs & Offerings · … | Yes |
| Surya Kriya | Surya Kriya · … | Yes |
| Events | Upcoming Events · … | Yes |
| About / Contact / Retreats | Unique branded titles | Yes |

Titles are unique; descriptions are present and generally in a useful length range.

### Heading hierarchy

- One `<h1>` per sampled page  
- Listing hierarchy fixed (programs `h2` sections; events/archive `h2` cards)  
- Footer labels no longer pollute the outline as `<h2>`  

### Structured data

- Sitewide `HealthAndBeautyBusiness` with NAP-ish fields, geo, logo/image, priceRange  
- `Event` on home + `/events`  
- `Course` + `BreadcrumbList` (+ related `Event` when applicable) on program detail  
- No `openingHours` (opportunity, not a regression)  
- No live retreat `Event`/breadcrumb to recheck (no retreat details)

### Open Graph / Twitter

- Homepage: default OG PNG **200**  
- Program details: page-specific Sanity OG URLs **200**  
- `twitter:card` = `summary_large_image` on sampled pages  
- Legacy `/opengraph-image` → **308** → static PNG  

### Internal linking

- Header + footer cover programs, retreats, about, contact, legal  
- Program cards, event cards, cross-CTAs present  
- Note: footer Explore set does **not** include `/events` (reachable from header/home) — minor IA gap, not an orphan  

### Image optimization

- Brand WebP + CF `/cdn-cgi/image/` **200**  
- Program listing/detail images use Sanity CDN with `srcset`/`sizes`  
- Local transforms still work for brand/certification assets  

### Image alt text

- Meaningful content images generally have descriptive alts  
- Remaining `alt=""` instances are consistent with decorative logos / YouTube thumbnail button pattern  
- Gallery fallback not live-testable (no retreat galleries)

### Core Web Vitals risks (remaining)

| Risk | Severity | Notes |
|------|----------|-------|
| `/icon` & `/apple-icon` **500** | Medium | Linked from HTML + manifest; wasted requests / broken PWA/touch icons |
| Third-party YouTube after click | Low | Intentional; deferred correctly |
| Sanity remote images bypass CF loader | Low | By design; Sanity already serves resized URLs |
| Below-fold motion still JS-assisted | Low | ATF no longer hidden |

### Fonts

- Montserrat WOFF2 ✅  
- Cormorant heading WOFF ✅  
- No Montserrat TTF requested in homepage HTML  

### Third-party scripts

- YouTube iframe API **not** on initial homepage load  
- Facade thumbnail from `i.ytimg.com` only until interaction  

### HTTP status codes & redirects

| Check | Result |
|-------|--------|
| Core routes | **200** |
| www → apex | **308** |
| Unknown path | **404** |
| `/favicon.ico` | **200** |
| `/opengraph-image` | **308** → PNG |
| `/icon`, `/apple-icon` | **500** ❌ remaining |

### 404 behavior

- Real 404 status  
- “Page not found” title  
- Site chrome + recovery links  
- `noindex`  

### Accessibility affecting SEO

- `lang="en"`, skip link, one h1, improved outlines ✅  
- Footer heading noise fixed ✅  
- Invalid event `<dl>` fixed ✅  

### Mobile rendering

- `viewport` meta present  
- Responsive `sizes` / CF width variants in use  
- No separate m.-host / duplicate mobile site  

### Duplicate content

- Single production host + www redirect  
- Consistent canonicals  
- Noindex utility pages  

### Crawl depth & orphans

- Primary pages reachable within 1–2 clicks from home  
- All sitemap URLs correspond to live **200** marketing pages sampled  
- No published retreat detail pages (empty retreat inventory, not an orphan bug)  
- `/register` / `/thank-you` intentionally unsitemapped  

---

## 1. Technical SEO complete

- C1–C2, H1–H6, M1–M7 fixed on production  
- L1, L2, L4, L5 fixed on production  
- Indexable metadata, canonicals, robots/sitemap alignment  
- Event / Course / Breadcrumb JSON-LD  
- Font + image pipeline improvements  
- YouTube deferred loading  
- Real 404 with chrome  
- Cache headers for public images/PDFs  
- Working favicon.ico  

---

## 2. Remaining technical issues

| Issue | Priority | Notes |
|-------|----------|-------|
| `/icon` and `/apple-icon` return **HTTP 500** | High (tech) | Same Workers/`ImageResponse` class of failure as old dynamic OG. Replace with static PNGs (as done for OG) and update manifest. |
| Manifest icons point at broken `/icon` & `/apple-icon` | High (tech) | Install/home-screen icons fail until static assets exist. |
| L3 `og:locale=en_GB` | None / skip | Intentionally skipped; optional later. |
| L6 maskable 192/512 icons | None / skip | Intentionally skipped; no classic SEO impact. |
| L7 GSC verification meta | Ops | Intentionally skipped pending token / confirm DNS verification. |
| Gallery/retreat OG live proof | N/A | Code ready; no retreat content published. |
| LocalBusiness lacks `openingHours` | Low | Enrich when hours are stable. |

---

## 3. Content SEO opportunities

- Expand About/Contact copy around **Saranda / Albanian Riviera / Classical Hatha Yoga** intent (titles already strong on home).  
- Ensure every program shortIntro doubles as a crisp meta description (some inherit well already).  
- Add `/events` to footer Explore for symmetric internal links (header already links).  
- Publish retreat content when ready so M5/M6 retreat paths become crawlable.  
- Consider FAQ blocks (with FAQ schema) for “What is Surya Kriya?”, prerequisites, etc.  
- Keep event schedule text and Event JSON-LD dates/times in sync when CMS schedules change.  

---

## 4. Local SEO opportunities

- NAP consistency is good (phone, email, Saranda/Albania appear on contact/home/org schema).  
- Add `openingHours` / `openingHoursSpecification` when schedule is reliable.  
- Confirm Google Business Profile (if used) matches site NAP and links to `https://navahathayoga.com`.  
- Encourage reviews; embed GBP link from Contact.  
- Optional: local landing snippets for Tirana vs Saranda events (already separate event locations in CMS).  
- Geo coordinates already in JSON-LD ✅  

---

## 5. Search Console / monitoring tasks

1. Confirm property ownership (DNS or HTML tag — L7).  
2. Submit `https://navahathayoga.com/sitemap.xml`.  
3. Inspect homepage, `/programs/surya-kriya`, `/events` for coverage + rich results (Event / Course).  
4. Monitor Core Web Vitals (esp. after fixing `/icon` 500s).  
5. Watch for crawl anomalies on `/thank-you` (should stay excluded via noindex, not robots disallow).  
6. Re-validate Event rich results after any schedule edits.  
7. Set up uptime / synthetic checks for `/`, `/sitemap.xml`, `/robots.txt`, `/favicon.ico`, and (once fixed) static icons.  

---

## Verdict

**Technical SEO from the original audit is effectively complete** for all intended Critical/High/Medium work and the selected Low Priority fixes.  

The main follow-up before calling the engineering backlog “quiet” is to **replace broken dynamic `/icon` and `/apple-icon` routes with static assets** (mirroring the OG image fix). Everything else outstanding is content, local SEO enrichment, or intentionally skipped low-impact items.

---

*Audit only — no application code was modified.*
