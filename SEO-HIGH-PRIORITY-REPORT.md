# High Priority SEO Fixes — Implementation Report

**Date:** 6 August 2026  
**Scope:** Only High Priority issues from `SEO-AUDIT.md` (H1–H6)  
**Verification:** `npm run typecheck` passed · `npm run lint` passed (0 errors on changed files)

---

## Verification checklist

| ID | Issue | Resolved |
|----|--------|----------|
| H1 | Montserrat 728 KB TTF → WOFF2 (subset) | Yes — ~111 KB WOFF2 |
| H2 | Event / Course / Breadcrumb / richer LocalBusiness JSON-LD | Yes |
| H3 | Heading hierarchy on listing pages (`h1` → `h3`) | Yes |
| H4 | `robots.txt` Disallow `/thank-you` vs `noindex` | Yes — Disallow removed |
| H5 | Sitemap fake `lastModified: new Date()` | Yes — CMS `_updatedAt` / omit |
| H6 | Homepage title / `og:title` inconsistency | Yes |

Medium and Low priority items were **not** changed.

---

## H1 — Font optimization (Montserrat → WOFF2)

### Why needed
The body font shipped as an uncompressed variable **TTF (~745 KB)**, dominating mobile transfer and delaying text paint (FCP/LCP).

### What changed
- Generated `assets/fonts/Montserrat[wght].woff2` via fontTools, subset to Latin + Latin Extended + common punctuation (~**111 KB**).
- Pointed `next/font/local` at the WOFF2 file.
- Left the original TTF in the repo as a rebuild source (not loaded by the app).

### Files
- `assets/fonts/Montserrat[wght].woff2` *(new)*
- `lib/fonts.ts`

### SEO / CWV benefit
Smaller font payload → faster text rendering → better **FCP/LCP**, which Google uses as ranking signals via Core Web Vitals.

### Trade-offs
- Subsetting omits rare glyphs outside Latin Extended. Albanian/English site copy is covered; exotic symbols may fall back to the system font.
- Original TTF remains on disk (~745 KB) but is unused at runtime.

---

## H2 — Structured data (Events, Courses, Breadcrumbs, LocalBusiness)

### Why needed
A yoga studio’s primary discoverable entities (workshops, programs, retreats) had almost no schema markup, so Google could not show **Event** rich results or understand program hierarchy.

### What changed

1. **`lib/structured-data.ts`** — builders for:
   - `HealthAndBeautyBusiness` (enriched: `@id`, `logo`, `image`, `geo`, `priceRange`)
   - `Event` (upcoming classes/workshops + dated retreats)
   - `Course` (program detail pages)
   - `BreadcrumbList` (program & retreat detail)

2. **`components/JsonLd.tsx`** — shared renderer; multiple nodes use `@graph`.

3. **Emission points**
   - Site layout: enriched organization (via existing `StructuredData`)
   - `/` and `/events`: Event JSON-LD for upcoming sessions
   - `/programs/[slug]`: Course + Breadcrumbs + related Events
   - `/retreats/[slug]`: Breadcrumbs + Event (when a date exists)

Event nodes include Google-required/recommended fields: `name`, `startDate`/`endDate` (ISO), `location` (`Place` + `PostalAddress`), `eventAttendanceMode` (offline), `eventStatus`, `organizer`, `offers` (EUR when parseable), `image`, `description` when available.

Course nodes include `name`, `description`, `provider`, `url`, `image`, and `offers` from program price labels.

### Files
- `lib/structured-data.ts` *(new)*
- `components/JsonLd.tsx` *(new)*
- `components/StructuredData.tsx`
- `app/(site)/page.tsx`
- `app/(site)/events/page.tsx`
- `app/(site)/programs/[slug]/page.tsx`
- `app/(site)/retreats/[slug]/page.tsx`

### SEO benefit
Eligible for **Event rich results**, clearer entity understanding for programs (`Course`), breadcrumb trails in SERPs, and stronger local business signals (`geo`, `logo`, `priceRange`).

### Trade-offs
- `priceRange: "€€"` and Saranda `geo` are approximate (city-center coords). Refine if you get a studio pin.
- Prices parsed from labels like `150€`; free-text labels that don’t match stay without a numeric `Offer.price`.
- Google Course rich results are strongest for online course catalogs; in-person programs still benefit from entity clarity even if the Course carousel doesn’t always appear.
- After deploy, validate with [Google Rich Results Test](https://search.google.com/test/rich-results) and Search Console.

---

## H3 — Heading hierarchy on listing pages

### Why needed
`/programs`, `/events`, and `/events/archive` jumped from `<h1>` to `<h3>`, weakening document outline for crawlers and assistive tech.

### What changed
- Programs listing section labels → `<h2 className="eyebrow">` (visual style unchanged).
- Cards accept `headingLevel` (`2 | 3`):
  - `/events` EventCards → `h2`
  - `/retreats` listing RetreatCards → `h2`
  - Homepage cards stay `h3` under existing section `h2`s
  - Program cards under “Main/Special programs” `h2`s stay `h3`
- Archive list titles → `h2`

### Files
- `components/programs/ProgramsListing.tsx`
- `components/cards/EventCard.tsx`
- `components/cards/ProgramCard.tsx`
- `components/cards/RetreatCard.tsx`
- `components/ArchiveList.tsx`
- `app/(site)/events/page.tsx`
- `app/(site)/retreats/page.tsx`

### SEO benefit
Correct outline improves how Google and screen readers interpret page structure; no visual redesign.

### Trade-offs
None material. Multiple `h2`s on listing pages (one per card) is intentional and valid.

---

## H4 — `robots.txt` / thank-you conflict

### Why needed
`Disallow: /thank-you` prevented Google from fetching the page, so the page’s `noindex` meta was never seen — risking “Indexed, though blocked by robots.txt”.

### What changed
Removed `"/thank-you"` from `disallow`. Page still uses `noIndex: true` via `buildMetadata`.

### Files
- `app/robots.ts`

### SEO benefit
Crawlers can read `noindex` and keep the thank-you URL out of the index correctly.

### Trade-offs
The thank-you URL is crawlable (but not indexable). That is the recommended pattern.

---

## H5 — Sitemap `lastModified` honesty

### Why needed
Every URL claimed `lastModified: new Date()` on each generation, training Google to ignore `lastmod`.

### What changed
- Program/retreat slug queries return `{ slug, _updatedAt }`.
- Sitemap sets `lastModified` only from Sanity `_updatedAt`.
- Static paths **omit** `lastModified` (valid) rather than inventing timestamps.

### Files
- `sanity/lib/queries.ts`
- `sanity/lib/fetch.ts` (`getProgramSlugEntries`, `getRetreatSlugEntries`)
- `app/sitemap.ts`

### SEO benefit
`lastmod` becomes a trustworthy recrawl hint for content that actually changed.

### Trade-offs
Static marketing/legal pages no longer advertise a lastmod until you later wire CMS `_updatedAt` for those documents (optional follow-up).

---

## H6 — Homepage title / Open Graph consistency

### Why needed
Homepage `<title>` fell back to the layout default while `og:title` / `twitter:title` collapsed to bare site name, and the default title omitted the strongest local keyword (Saranda).

### What changed
- Homepage `generateMetadata` sets  
  `title: "Classical Hatha Yoga in Saranda, Albania"`  
  (CMS `seo.title` still overrides via `seo`).
- `buildMetadata` OG/Twitter fallback when no title is  
  `` `${siteName} · Classical Hatha Yoga` ``  
  matching the root layout default pattern.

### Files
- `app/(site)/page.tsx`
- `lib/seo.ts`

### SEO benefit
Consistent titles across HTML/social; stronger local relevance in SERPs and share previews.

### Trade-offs
Document title becomes  
`Classical Hatha Yoga in Saranda, Albania · {brand}`  
via the layout template — slightly longer, intentionally keyword-rich. CMS SEO title still wins when set.

---

## Suggested post-deploy checks

1. Open `/robots.txt` — confirm `/thank-you` is **not** disallowed.
2. Open `/sitemap.xml` — program/retreat URLs should show real `lastmod` when CMS has `_updatedAt`.
3. View-source on `/events`, `/programs/{slug}`, `/retreats/{slug}` — confirm JSON-LD scripts.
4. Run Google Rich Results Test on an upcoming event URL and a program URL.
5. Confirm body text still uses Montserrat (WOFF2) in DevTools → Network → Font.
