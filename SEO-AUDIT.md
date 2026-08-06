# SEO Audit — Nava Hatha Yoga

**Date:** 6 August 2026
**Stack:** Next.js 16 (App Router) + Sanity CMS, deployed to Cloudflare Workers via OpenNext
**Scope:** Full codebase review — no live crawl or Lighthouse run was performed; findings are based on source analysis.

---

## Overall Assessment

The SEO foundation is solid. The site has: a shared `buildMetadata()` helper with per-page titles, descriptions and canonical URLs (`lib/seo.ts`), `metadataBase` set in the root layout, a dynamic sitemap (`app/sitemap.ts`), a robots file (`app/robots.ts`), noindex on form/utility pages, Organization JSON-LD, a skip link, `lang="en"`, one `<h1>` per page via `PageHero`, and descriptive alt text on almost all images. Internal linking (header nav, footer, cards, cross-links between programs/events/contact) is healthy.

The issues below are ordered by impact. The two biggest themes are **content hidden until JavaScript hydrates** (hurts Core Web Vitals, a ranking factor) and **unoptimized, eagerly-loaded media** (images and a 728 KB font).

---

## Critical Issues

### C1. Above-the-fold content is server-rendered invisible (`opacity: 0`) until JS hydrates

**Where:** `components/ui/MotionReveal.tsx`, `components/ui/Motion.tsx`, used on every page — including around the homepage `<h1>` (`app/(site)/page.tsx` line 110).

**Problem:** `MotionReveal` / `MotionStagger` use framer-motion with `initial="hidden"`, and the `fadeUp` variant (`lib/utils.ts` line 347) is `{ opacity: 0, y: 16 }`. Framer-motion serializes the initial variant into the SSR HTML, so the hero headline — the page's LCP element — arrives from the server with inline `opacity: 0` and only becomes visible after React hydrates and the `whileInView` animation runs. Consequences:

- **LCP is delayed** until full JS download + hydration. Core Web Vitals are a ranking signal, and this affects every page.
- Users on slow connections see a blank hero for seconds.
- Any crawler or preview service that doesn't execute JS sees an invisible page (Google does execute JS, but rendering is deferred and budgeted).

**Fix:**
1. Never wrap the `<h1>`/hero (or anything above the fold) in a JS-driven reveal. On the homepage, remove `MotionReveal` from the hero block (lines 110–147 of `app/(site)/page.tsx`) or render it with `initial={false}`.
2. For below-the-fold reveals, replace framer-motion entry animations with a CSS-only approach that is visible by default and animates via `@keyframes` + `animation-timeline: view()` or an IntersectionObserver adding a class — with the **non-animated state being fully visible** (progressive enhancement), e.g. start visible and only hide+animate when JS adds a `js-enabled` class.
3. At minimum, add a `<noscript>`-safe fallback: a global CSS rule that forces `[style*="opacity: 0"]` content visible is hacky; the correct fix is (1)/(2).

### C2. All local program images are eagerly loaded and bypass image optimization

**Where:** `components/ui/LocalProgramImage.tsx` (lines 54, 56, 70–72, 87–89).

**Problem:** every local program image is rendered with:

- `loading={priority ? undefined : "eager"}` — this **disables native lazy loading for every below-the-fold image**. The `/programs` page renders 13 program cards, all fetched immediately on page load. This inflates initial page weight, competes with the LCP resource, and hurts LCP/INP.
- `unoptimized` — skips Next.js image optimization entirely, so no responsive `srcset`, no AVIF/WebP conversion for the JPG/PNG sources, and the `sizes` prop does nothing. `bhastrika-kriya.jpg` (444 KB), `childrens-program.jpg` (172 KB) and `upa-yoga.jpg` (124 KB) are served at full size to every device. Additionally, when both a desktop and mobile variant exist, **both** `<Image>` elements are eager-loaded and only hidden with CSS (`hidden lg:block` / `lg:hidden`), so mobile users download the desktop image too.

**Fix:**
1. Remove `loading="eager"` — delete the `loading={priority ? undefined : "eager"}` prop entirely so non-priority images fall back to Next's default (`lazy`). Keep `priority` only for the image in the sidebar of the program detail page hero area if it is above the fold.
2. Remove `unoptimized`. OpenNext for Cloudflare supports image optimization (via a Cloudflare Images loader or the built-in worker route). Configure `images.loader`/`loaderFile` in `next.config.mjs` for Cloudflare Images, or if you keep local files pre-optimized, at least keep the `srcset` generation by not passing `unoptimized`.
3. For the desktop/mobile art-direction case, use a `<picture>` element with `<source media="(min-width: 1024px)">` so only one asset downloads, instead of two CSS-toggled `<Image>` components.

---

## High Priority

### H1. Body font ships as a 728 KB uncompressed TTF

**Where:** `assets/fonts/Montserrat[wght].ttf` (728 KB), loaded in `lib/fonts.ts` via `next/font/local`.

**Problem:** the body font is a variable TTF with no compression. WOFF2 compresses the same font to roughly 100–150 KB. This delays text rendering and consumes most of the mobile bandwidth budget, directly harming LCP/FCP. (The Cormorant Garamond heading fonts are already small WOFFs — fine.)

**Fix:** convert to WOFF2 (`npx fonttools ttLib.woff2 compress "assets/fonts/Montserrat[wght].ttf"` or `google-webfonts-helper`), update the `src` path in `lib/fonts.ts` to the `.woff2` file, and consider subsetting to `latin` + `latin-ext` glyph ranges while you're at it.

### H2. No structured data for events, programs, or breadcrumbs

**Where:** `components/StructuredData.tsx` renders one site-wide `HealthAndBeautyBusiness` node only.

**Problem:** the site's core entities have no schema markup:

- **Events** (`/events`, event cards) — no `schema.org/Event` markup, so events cannot appear in Google's event rich results, which is a significant missed opportunity for a class/workshop business.
- **Programs** (`/programs/[slug]`) — no `Course`/`Service`/`Offer` markup despite having titles, descriptions, prices and images.
- **No `BreadcrumbList`** anywhere, despite clear hierarchies (`Programs → Surya Kriya`).
- The `LocalBusiness` node is also thin: no `image`, no `logo`, no `geo` coordinates, no `openingHours`, no `priceRange`.

**Fix:**
1. In `EventCard` data flow (or better, on the `/events` page server component), emit one `Event` JSON-LD node per upcoming event with `name`, `startDate`/`endDate` (ISO 8601 with timezone), `location` (`Place` with `address`), `offers` (`price`, `priceCurrency: "EUR"`, `url`), `organizer`, and `eventAttendanceMode`.
2. On `app/(site)/programs/[slug]/page.tsx`, add a `Course` (or `Service`) JSON-LD node using `program.title`, `program.shortIntro`, the program image URL, and `offers` from `getProgramPriceLabel`.
3. Add `BreadcrumbList` JSON-LD to program and retreat detail pages (`Home → Programs → {title}`).
4. Enrich the site-wide node in `StructuredData.tsx`: add `image`/`logo` (absolute URL to `/images/nava-hatha-yoga-logo.png`), `geo` (`GeoCoordinates` for Saranda), and `priceRange`.
5. Validate everything with Google's Rich Results Test after implementing.

### H3. Broken heading hierarchy on listing pages (`h1` → `h3` with no `h2`)

**Where:**
- `/programs`: `ProgramsListing.tsx` renders the section labels "Main programs" / "Special programs" as `<p className="eyebrow">` (lines 13, 19), then `ProgramCard` uses `<h3>` (line 24). The page has an `<h1>` and `<h3>`s but no `<h2>`.
- `/events`: `PageHero` renders the `<h1>`, then `EventCard` titles are `<h3>` (line 246) with no intervening `<h2>`.
- `/events/archive`: same pattern via `ArchiveList.tsx` (line 13).

**Problem:** skipped heading levels weaken the document outline that search engines and screen readers use to understand page structure.

**Fix:**
1. In `ProgramsListing.tsx`, change "Main programs" and "Special programs" from `<p className="eyebrow">` to `<h2 className="eyebrow">` (the visual style is a class, so appearance is unchanged).
2. On `/events` and `/events/archive`, either add a visually-hidden `<h2 className="sr-only">Upcoming events</h2>` above the card list, or demote card titles: change `EventCard`, `ProgramCard`, `RetreatCard` and `ArchiveList` titles from `<h3>` to `<h2>` when they appear directly under the page `<h1>`. The simplest consistent rule: card titles become `<h2>` on listing pages. If cards are reused in contexts that already have an `<h2>` (e.g. homepage sections), pass a `headingLevel` prop.

### H4. `robots.txt` blocks `/thank-you`, which conflicts with its `noindex` meta tag

**Where:** `app/robots.ts` line 10 (`disallow: ["/studio", "/api/", "/thank-you"]`) vs. `app/(site)/thank-you/page.tsx` (`noIndex: true`).

**Problem:** if a URL is disallowed in robots.txt, Google never fetches the page and therefore **never sees the `noindex` directive**. If anyone links to `/thank-you`, it can appear in results as "indexed, though blocked by robots.txt" with no snippet. `noindex` and `Disallow` are mutually exclusive strategies — use one.

**Fix:** remove `"/thank-you"` from the `disallow` array in `app/robots.ts` and rely on the existing `noindex` meta tag (which is the correct mechanism here). Keep `/studio` and `/api/` disallowed — those are fine because they're not meant to be crawled at all and `/studio` also has its own `robots: { index: false }`.

### H5. Sitemap reports a fake `lastModified` for every URL

**Where:** `app/sitemap.ts` lines 25–49 — every entry gets `lastModified: new Date()` (the time the sitemap was generated).

**Problem:** telling Google that every page changed "just now" on every crawl destroys the signal's credibility; Google will learn to ignore your `lastmod`, which slows re-crawling of pages that genuinely changed.

**Fix:** fetch `_updatedAt` from Sanity for each document. Extend `getProgramSlugs()`/`getRetreatSlugs()` (in `sanity/lib/fetch.ts` and `sanity/lib/queries.ts`) to return `{ slug, _updatedAt }` (GROQ: `*[_type == "program"]{ "slug": slug.current, _updatedAt }`) and use that as `lastModified`. For static pages, either omit `lastModified` entirely (valid) or use the page document's `_updatedAt` from the CMS. Also consider dropping `changeFrequency`/`priority` — Google ignores both — but they're harmless.

### H6. Homepage title / og:title inconsistency

**Where:** `lib/seo.ts` lines 34–37, used by `app/(site)/page.tsx` (`generateMetadata` passes no `title`).

**Problem:** on the homepage, `buildMetadata` receives no `title`, so `resolvedTitle` is `undefined`. The `<title>` then falls back to the root layout default ("Nava Hatha Yoga · Classical Hatha Yoga"), but `ogTitle` becomes just `siteName` ("Nava Hatha Yoga"). The document title, `og:title` and `twitter:title` disagree, and the homepage title is generic — it doesn't mention the location ("Saranda, Albania"), which is the site's strongest local-SEO keyword.

**Fix:** in `app/(site)/page.tsx`'s `generateMetadata`, pass an explicit, keyword-bearing title, e.g. `title: "Classical Hatha Yoga in Saranda, Albania"`. In `buildMetadata`, when no title is supplied, build the OG title from the same default the layout uses rather than bare `siteName` so all three stay in sync.

---

## Medium Priority

### M1. Oversized logo and photo assets

**Where:** `public/images/`

- `nava-logo-symbol-v2.png` — 200 KB, displayed at 44–64 px in the header on every page.
- `nava-hatha-yoga-header-logo.png` (292 KB), `nava-hatha-yoga-logo-full.png` (280 KB), `nava-hatha-yoga-logo.png` (240 KB).
- `about/teacher-linda.png` — 452 KB PNG photo.
- `programs/bhastrika-kriya.jpg` — 444 KB (the only program image without a WebP version).

**Problem:** these go through `next/image` (except where `unoptimized` is set — see C2), but the source files are still needlessly heavy, and on Cloudflare the optimization pipeline depends on configuration. The header logo is fetched on every page view.

**Fix:** re-export the logos as either SVG (ideal for a logo) or WebP at 2× the largest displayed size (e.g. 128 px symbol ≈ a few KB). Convert `teacher-linda.png` and `bhastrika-kriya.jpg` to WebP at their maximum rendered dimensions (target < 100 KB each). `cwebp -q 80` or Squoosh will do it.

### M2. YouTube iframe API loads on page load for every page with a video

**Where:** `components/content/YouTubeEmbed.tsx` — `useEffect` calls `loadYouTubeAPI()` and constructs the player immediately on mount (lines 93–128).

**Problem:** `https://www.youtube.com/iframe_api` plus the player iframe (~800 KB+ of third-party JS) download on initial load of the homepage and any program page with a video, even if the visitor never plays it. This is one of the largest third-party costs on the site and hurts LCP/INP/TBT.

**Fix:** implement a click-to-load facade: render a static thumbnail (`https://i.ytimg.com/vi/{videoId}/hqdefault.jpg` via `next/image`) with the play-button overlay you already have; only call `loadYouTubeAPI()` and create the player in the click handler (create with `playerVars: { autoplay: 1 }` so the click still starts playback). The existing overlay/mask design can stay exactly as is.

### M3. 404 page has no metadata and no site chrome

**Where:** `app/not-found.tsx`.

**Problem:** the not-found page exports no `metadata`, so it inherits the root default title ("Nava Hatha Yoga · Classical Hatha Yoga") — confusing in the browser tab and in logs. It also renders its own bare `<main>` outside `app/(site)/layout.tsx`, so there is no header navigation or footer, leaving lost visitors with only a single "Return home" link (weak internal linking recovery).

**Fix:** add `export const metadata: Metadata = { title: "Page not found" }` to `app/not-found.tsx`. Next.js automatically serves 404s with `noindex`, so nothing else is needed for robots. To restore chrome, move the not-found UI into `app/(site)/not-found.tsx` (inside the site layout) and add links to `/programs`, `/events`, and `/contact` alongside "Return home".

### M4. Invalid `<dl>` semantics in event cards

**Where:** `components/cards/EventCard.tsx` line 255 — a `<dl>` whose children are `<div>`s containing plain `<span>`s (via `EventDetailRow`), with no `<dt>`/`<dd>` anywhere.

**Problem:** invalid HTML structure; assistive tech announces a definition list with zero terms. The labels currently live in `sr-only` spans, which partially compensates but the markup is still wrong.

**Fix:** either change the `<dl>` to a plain `<div>` (the `sr-only` label pattern in `EventDetailRow` already provides the semantics), or make `EventDetailRow` render `<dt className="sr-only">{label}</dt><dd>{children}</dd>` inside a `<div>` wrapper (valid since HTML 5.2).

### M5. Gallery images can render with empty alt text

**Where:** `components/content/Gallery.tsx` line 17 (`alt={image.alt ?? ""}`) and `components/ui/SanityImage.tsx` line 49 (`alt={image?.alt || alt || ""}`).

**Problem:** when editors don't fill in the alt field in Sanity, retreat gallery images ship with `alt=""`, i.e. marked decorative. Content photos on retreat pages are not decorative — they carry meaning and image-search value.

**Fix:** two parts. (1) In the Sanity schema for gallery/content images, make the `alt` field required (`validation: (rule) => rule.required()`), so editors must describe images. (2) As a code fallback, pass a derived alt like `` `${retreat.title} — photo ${i + 1}` `` from `Gallery.tsx` instead of `""`. Keep `alt=""` only for genuinely decorative images (the divider, logo-as-decoration cases already do this correctly with `aria-hidden`).

### M6. Every page shares a single generic OG image

**Where:** `lib/seo.ts` `DEFAULT_OG_IMAGE` → `app/opengraph-image.tsx`.

**Problem:** program and retreat pages have their own photos, but all social shares show the same generated brand card. Page-specific images earn more clicks from social/messaging shares (a meaningful discovery channel for a WhatsApp-driven local business).

**Fix:** in `buildMetadata`, accept an optional `image` argument. On `programs/[slug]` and `retreats/[slug]`, pass the Sanity image URL (`urlForImage(program.image).width(1200).height(630).url()`) as the OG image, falling back to `DEFAULT_OG_IMAGE` when absent.

### M7. Canonical URL emitted on noindexed pages

**Where:** `app/(site)/register/page.tsx` and `app/(site)/thank-you/page.tsx` — both call `buildMetadata({ noIndex: true, path: ... })`, which still sets `alternates.canonical`.

**Problem:** `noindex` + self-referencing canonical is a mixed signal (a canonical says "index me under this URL", noindex says "don't index me"). Google usually resolves it correctly, but it's cleaner not to send both.

**Fix:** in `buildMetadata` (`lib/seo.ts`), skip `alternates` when `noIndex` is true: `alternates: noIndex ? undefined : { canonical }`.

---

## Low Priority

### L1. Static assets outside `/_next/static` lack long-lived cache headers

**Where:** `public/_headers` only covers `/_next/static/*`. Files under `/images/*` and `/pdfs/*` fall back to default caching.

**Fix:** add to `public/_headers`:

```
/images/*
  Cache-Control: public,max-age=604800,stale-while-revalidate=86400
/pdfs/*
  Cache-Control: public,max-age=86400
```

(Use versioned filenames if you ever need immutable caching for these.)

### L2. No `favicon.ico` for legacy consumers

**Where:** `app/icon.tsx` serves `/icon` (and the layout emits the `<link>` tag), but some crawlers, feed readers, and older tooling request `/favicon.ico` directly, which 404s.

**Fix:** add a small `favicon.ico` to the `app/` directory (Next serves it automatically) or to `public/`.

### L3. `og:locale` is `en_GB`

**Where:** `lib/seo.ts` line 54 and `app/layout.tsx` line 28.

**Problem:** harmless, but the site targets Albania with English content; `en_GB` is an arbitrary choice. If an Albanian (`sq`) version of the site is ever added, you'll need `hreflang` alternates — with a single language today, nothing is required.

**Fix:** optionally change to `en`. If/when a Albanian translation launches, add `alternates.languages` (`{ en: ..., sq: ... }`) in `buildMetadata` and localized sitemap entries.

### L4. Non-standard `host` directive in robots.txt

**Where:** `app/robots.ts` line 13.

**Problem:** `Host:` is a legacy Yandex directive; Google ignores it. Harmless, but it implies canonical-host handling that actually needs to happen at the redirect level (which you already do via the 308 www→apex Cloudflare redirect script — good).

**Fix:** remove the `host` field for cleanliness, or leave it; no ranking impact either way.

### L5. Footer uses six `<h2>` headings for link-list labels

**Where:** `components/layout/Footer.tsx` (lines 56–89 and 141–173 — mobile and desktop layouts each render "Explore", "Legal", "Contact").

**Problem:** every page's outline ends with duplicated boilerplate headings, and since mobile+desktop layouts are both in the DOM (CSS-toggled), each label appears twice. This is noise rather than harm.

**Fix:** either demote them to `<p className="eyebrow">` with `aria-hidden` alternatives, or (better for a11y) keep them as headings but render one layout via a container query/single markup structure rather than two parallel DOM trees.

### L6. Manifest icons are minimal

**Where:** `app/manifest.ts` — only 32×32 and 180×180 icons, no `purpose: "maskable"`, no 512×512.

**Fix:** add a 192×192 and 512×512 icon (can be generated from the logo symbol) with `purpose: "any"` and `"maskable"` variants. Only matters for PWA installs and some Android surfaces; zero classic-SEO impact.

### L7. Search-engine verification not configured in code

**Where:** no `verification` key in the root metadata.

**Fix:** if Google Search Console / Bing Webmaster verification isn't already done via DNS, add `verification: { google: "..." }` to the root `generateMetadata` in `app/layout.tsx`. Search Console is essential for monitoring everything else in this report.

---

## What Is Already Good (no action needed)

- **Canonical URLs** on every indexable page via `buildMetadata`, with `metadataBase` and a single production host (`https://navahathayoga.com`), and a 308 www→apex redirect script for Cloudflare. No duplicate-content risk found; no query-parameter or trailing-slash inconsistencies.
- **Sitemap and robots** exist, are dynamic, reference each other, and exclude the right things (`/studio`, `/api/`).
- **Noindex** correctly applied to `/register` and `/thank-you` (see H4 for the one conflict) and to the Sanity Studio.
- **One `<h1>` per page**, provided by `PageHero`/page heroes, with sensible `<h2>` sections on the homepage, about, retreats and program detail pages.
- **Alt text discipline** is generally strong: program/retreat images use the entity title, brand logos use `decorative`/`aria-hidden` where appropriate, icons are `aria-hidden`.
- **Accessibility basics:** skip-to-content link, `aria-label` on the primary nav and mobile menu button, `aria-expanded` state, form labels (in the form components), `prefers-reduced-motion` handling.
- **ISR-style caching** (60 s revalidate on all Sanity fetches) keeps content fresh without per-request cost.
- **Internal linking:** header/footer nav, cards linking to detail pages, cross-links from programs to events/contact, archive back-links. Consider adding breadcrumb UI alongside the BreadcrumbList schema in H2, but link coverage is complete.

## Suggested Order of Work

1. C1 (motion/hidden content) and C2 (image loading) — biggest Core Web Vitals wins.
2. H1 (font) — one-file change, large payload reduction.
3. H4 (robots/noindex conflict) and H6 (homepage title) — tiny fixes.
4. H2 (structured data) and H5 (sitemap lastmod) — indexing/rich-result gains.
5. H3 (headings), then M1–M7, then the L items opportunistically.
