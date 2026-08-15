# SEO Geographic Keyword Expansion Report — Nava Hatha Yoga

**Date:** 15 August 2026  
**Status:** Implemented locally + Sanity CMS patched — **Next.js not deployed**  
**Site:** https://navahathayoga.com  
**Builds on:** Phase 1 SEO architecture (not replaced)

---

## 1. Executive summary

This update expands geographic and program keyword relevance without publishing thin city pages or program × city URLs.

Albania remains the primary geographic target. Tirana and Saranda are supporting teaching context on existing pages. Korçë, Gjirokastër, Vlorë, and Corfu are reserved in the architecture and listed on Contact as upon-request locations only.

Phase 1 technical SEO, structured data foundations, sitemap/canonical logic, image optimization, SSR, H1 structure, and spiritual/practice copy were preserved. No doorway pages were created.

---

## 2. New Level 1 keywords

| Primary | Secondary | Owner |
|---------|-----------|-------|
| Classical Hatha Yoga Albania | Hatha Yoga Albania | `/` (existing) |
| Classical Hatha Yoga Tirana | Hatha Yoga Tirana | Reserved: `/locations/tirana` |
| Classical Hatha Yoga Saranda | Hatha Yoga Saranda | Reserved: `/locations/saranda` |
| Classical Hatha Yoga Korca | Hatha Yoga Korca | Reserved: `/locations/korca` |
| Classical Hatha Yoga Gjirokaster | Hatha Yoga Gjirokaster | Reserved: `/locations/gjirokaster` |
| Classical Hatha Yoga Vlora | Hatha Yoga Vlora | Reserved: `/locations/vlora` |
| Classical Hatha Yoga Corfu | Hatha Yoga Corfu | Reserved: `/locations/corfu` |
| Hatha Yoga Retreat Albania | Yoga Retreat Saranda | `/retreats` owns Albania; Saranda retreat URL reserved |

Semantic spelling variants (not separate topics): Korça / Korca / Korçë · Gjirokastër / Gjirokaster · Vlorë / Vlora.

---

## 3. New Level 2 keywords

**Core (Albania primary; Tirana + Saranda strong secondaries)**

1. Surya Kriya Albania  
2. Angamardana Albania  
3. Yogasanas Albania  
4. Upa Yoga Albania  
5. Bhuta Shuddhi Albania  

**Additional (Albania primary; Tirana secondary)**

6. Children's Program Albania  
7. Bhastrika Kriya Albania  
8. Jala Neti Albania  
9. Thoppukarnam Albania  
10. Shanmukhi Mudra Albania  
11. Eye Care Practices Albania  
12. Pavanamuktasana Albania  

Surya Shakti Albania was already mapped on `/programs/surya-shakti` and received light Albania alignment so the existing URL is not left untitled. It is kept distinct from Surya Kriya.

---

## 4. Complete geographic keyword hierarchy

```
Albania (national hub)                → /
  Hatha Yoga Albania                  → / (secondary)

Tirana                                → reserved /locations/tirana
Saranda                               → reserved /locations/saranda
Korçë / Korca                         → reserved /locations/korca
Gjirokastër / Gjirokaster             → reserved /locations/gjirokaster
Vlorë / Vlora                         → reserved /locations/vlora
Corfu                                 → reserved /locations/corfu

Retreats Albania                      → /retreats
Yoga Retreat Saranda                  → reserved until a real retreat exists
```

Full city register: `KEYWORD-ARCHITECTURE.md` §10.

---

## 5. Complete program keyword hierarchy

See the matrix in `KEYWORD-ARCHITECTURE.md` §11. Summary:

| Program URL | Primary | Strong secondaries |
|-------------|---------|-------------------|
| `/programs/surya-kriya` | Surya Kriya Albania | Tirana, Saranda |
| `/programs/angamardana` | Angamardana Albania | Tirana, Saranda |
| `/programs/yogasanas` | Yogasanas Albania | Tirana, Saranda |
| `/programs/upa-yoga` | Upa Yoga Albania | Tirana, Saranda |
| `/programs/bhuta-shuddhi` | Bhuta Shuddhi Albania | Tirana, Saranda |
| `/programs/childrens-program` | Children's Program Albania | Tirana (+ Children's Yoga Tirana; Classical Hatha Yoga for Children Tirana) |
| `/programs/bhastrika-kriya` | Bhastrika Kriya Albania | Tirana |
| `/programs/jala-neti` | Jala Neti Albania | Tirana |
| `/programs/thoppukarnam` | Thoppukarnam Albania | Tirana |
| `/programs/shanmukhi-mudra` | Shanmukhi Mudra Albania | Tirana |
| `/programs/eye-care-practices` | Eye Care Practices Albania | Yogic Eye Care Practices Albania; Tirana variants |
| `/programs/pavanamuktasana` | Pavanamuktasana Albania | Tirana |

No `/programs/{slug}/tirana` or `/programs/{slug}/saranda` URLs.

---

## 6. Changes made to each existing page

### `/`

- **Title:** unchanged — `Classical Hatha Yoga in Albania`  
- **Meta:** unchanged Albania primary; Saranda & Tirana remain supporting context  
- **H1:** unchanged — `Nava Classical Hatha Yoga`  
- **Copy:** intro geo paragraph now uses natural “Saranda and Tirana”, keeps program links, and adds “other teaching locations may be arranged upon request” → `/contact`  
- **Not done:** no city-name dump; no Korçë/Vlorë/Corfu list on the homepage (would cannibalize reserved landers)

### `/programs`

- Unchanged (already owns Classical Hatha Yoga programs Albania)

### `/programs/surya-kriya` … core five

- **Titles:** Albania primary kept (`Learn Surya Kriya in Albania`, etc.)  
- **Meta / context line:** supporting Saranda + Tirana in natural sentences  
- Surya Kriya context is more specific because placeholder/CMS events show sessions in both cities: “Teaching is based in Saranda, with sessions also held in Tirana when scheduled.”  
- Other core programs: “teaching based in Saranda and Tirana” (site-wide main teaching locations), not invented class calendars  
- **H1s:** still the practice names  
- Related links preserved

### Additional program pages

- New Albania titles, meta descriptions, context lines, and related links  
- H1s remain practice names  
- No city stuffing in titles

### `/programs/surya-shakti`

- Light Albania title/meta/context + related link to Surya Kriya (differentiation)

### `/contact`

- **Title:** `Register for Classical Hatha Yoga in Albania`  
- **Meta:** Albania + Saranda/Tirana + upon-request locations (no city dump in the title)  
- **H1:** still `Get in touch`  
- Upon-request list uses local spellings: Vlorë, Gjirokastër, Korçë  
- Internal links: Explore programs · See upcoming events  
- Form location labels use accented display names; submitted values stay ASCII

### `/events`

- **Title:** `Classical Hatha Yoga Events in Albania`  
- **Meta / hero:** Saranda and Tirana as in-person session context  
- **H1:** still `Upcoming events`

### `/events/archive`

- Title aligned to past-events Albania intent  
- H1 unchanged: `Past events`

### `/about` and `/retreats`

- Unchanged ownership (teacher; Hatha Yoga Retreat Albania)  
- Yoga Retreat Saranda still not claimed as a primary

### `/register`

- Remains `noindex`  
- Description already mentioned Saranda & Tirana (pre-existing uncommitted change)

---

## 7. Changes made in Sanity

Patched via `scripts/patch-seo-geo-expansion.mjs` (production dataset, succeeded):

| Document | Fields |
|----------|--------|
| `homePage` | `seo.title/description` (Albania primary retained); intro geo paragraph replaced with linked version + upon-request → contact; events section description |
| `contactPage` | `seo.title/description`; hero description; `teachingLocations.otherLocations` spellings |
| `eventsPage` | `seo.title/description`; hero description |
| All 13 programs | `seo.title`, `seo.description`, `contextLine`, `relatedPrograms` |

`scripts/sync-cms-recent.mjs` and `scripts/generate-seed.mjs` were aligned so a later sync will not overwrite this expansion.

**Warning:** CMS title/meta can appear on the live site at the next ISR refresh (~60s) even before a Next.js deploy. Context lines, related links, and the home “upon request” sentence require the code deploy to render.

---

## 8. Internal-linking changes

| From | To | Anchor / placement |
|------|----|--------------------|
| Home intro | Five core programs, About, Contact | Upa Yoga, Surya Kriya, Yogasanas, Angamardana, Bhuta Shuddhi, meet the teacher, upon request |
| Contact sidebar | `/programs`, `/events` | Explore programs · See upcoming events |
| Children's Program | Upa Yoga, `/programs` | Related |
| Bhastrika Kriya | Jala Neti, Upa Yoga | Related |
| Jala Neti | Bhastrika Kriya, Surya Kriya | Related |
| Thoppukarnam | Upa Yoga, Children's Program | Related |
| Shanmukhi Mudra | Eye Care Practices, Upa Yoga | Related |
| Eye Care Practices | Shanmukhi Mudra, Yogasanas | Related |
| Pavanamuktasana | Yogasanas, Upa Yoga | Related |
| Surya Shakti | Surya Kriya, Upa Yoga | Related |
| Core five | Existing related links | Unchanged pattern |

No footer keyword lists. No sitewide exact-match city anchors.

---

## 9. Keywords reserved but NOT implemented as pages

- Classical Hatha Yoga Tirana / Saranda / Korca / Gjirokaster / Vlora / Corfu  
- Hatha Yoga {those cities} as page primaries  
- Yoga Retreat Saranda as a dedicated URL  
- `{Program} Tirana` / `{Program} Saranda` as separate URLs  
- Informational “What is {Practice}” guides  
- Classical Hatha Yoga Prishtina (previously reserved; unchanged)

These remain in the strategy as secondaries or reserved primaries.

---

## 10. Location pages deliberately NOT created

| Reserved URL | Why not created |
|--------------|-----------------|
| `/locations/tirana` | Teaching exists, but no approved unique city lander in the repo |
| `/locations/saranda` | Teaching base exists; a swapped-name lander would still be thin without unique local value |
| `/locations/korca` | Upon-request only |
| `/locations/gjirokaster` | Upon-request only |
| `/locations/vlora` | Upon-request only |
| `/locations/corfu` | Upon-request / travel only |
| `/programs/{slug}/tirana` or `/saranda` | Would cannibalize national program pages |

---

## 11. Cannibalization protections

- Home owns **Classical Hatha Yoga Albania** only  
- Future city pages own **Classical Hatha Yoga {City}** — not assigned to any live URL  
- Each program page owns **{Program} Albania** only  
- Children's Program primary changed from “Classical Hatha Yoga for children Albania” to **Children's Program Albania** (old phrase is semantic support)  
- Eye Care Practices primary is **Eye Care Practices Albania** (yogic eye care is semantic/national secondary)  
- About still owns teacher terms; Retreats still owns Hatha Yoga Retreat Albania  
- Contact owns register/enquiry, not city category terms  
- Informational guides still must not take `{Program} Albania`

---

## 12. Validation results

| Check | Result |
|-------|--------|
| `npm run typecheck` | **Pass** |
| `npm run lint` | **Pass** (0 errors; 2 pre-existing warnings in `cloudflare-env.d.ts`) |
| `npm run build` | **Pass** — 38/38 pages generated |
| Deploy | **Not run** |

Built HTML (placeholder fallback during sandboxed Sanity CDN fetch) showed:

- Unique titles on all affected URLs  
- Unique meta descriptions  
- One H1 per page  
- `index, follow` on marketing pages  
- Single self-referencing canonical  
- Matching OG titles  
- Organization `areaServed`: Albania, Saranda, Tirana  
- Course `hasCourseInstance` present on program pages  
- No `/locations/*` routes  
- `/register` remains noindex by code  

The sandboxed production build could not reach `zji6f648.apicdn.sanity.io` and fell back to placeholders. Placeholder SEO matches the CMS patch strings, so titles/meta in HTML are the intended set.

---

## 13. Warnings or uncertainties

1. **Live CMS vs undeployed code.** Sanity production was patched. Meta tags may update on the live site via ISR before this code is deployed.  
2. **“Teaching based in Saranda and Tirana”** on additional programs uses the site-wide main teaching locations. It does not claim a dated Tirana class for every special practice. Surya Kriya is the only program whose context line mentions Tirana sessions “when scheduled,” matching existing event data.  
3. **Upon-request cities** (Vlorë, Gjirokastër, Korçë, Corfu, Prishtina) are not claimed as regular studios.  
4. **Angamardana benefits** may still include legacy “weight-loss” wording in CMS body — left untouched (not an SEO rewrite of benefits).  
5. **Yoga Retreat Saranda** is still unowned as a URL because no public retreat product exists.  
6. Image alt text was not stuffed with city names.

---

## 14. Recommended future work based on Search Console data

Create a city page only when **all** of the following are true (or GSC demand is clearly dedicated **and** unique local content exists):

1. Recurring teaching, events, or genuine travel/service in that city  
2. Unique local information (venue, how to get there, which programs actually run there)  
3. Search Console shows meaningful impressions/queries for `Classical Hatha Yoga {City}` or `{Program} {City}` that the national page cannot satisfy  

Then, in order:

1. `/locations/saranda` and `/locations/tirana` if unique local briefs can be written  
2. Dated Saranda retreat URL when a real retreat is offered  
3. Corfu only with a real travel proposition  
4. Vlorë / Korçë / Gjirokastër only if teaching becomes recurring  
5. Program × city URLs only after the city lander exists **and** GSC shows dedicated `{Program} {City}` demand  
6. Informational guides (`What is Surya Kriya`, etc.) that must **not** take `{Program} Albania`

---

## Intentionally not implemented

| Item | Why |
|------|-----|
| City landing pages | No unique local content; doorway risk |
| Program × city pages | Cannibalization; insufficient dedicated demand proof |
| New blogs / guides | Out of scope for this task |
| Footer / sitewide city keyword lists | Exact-match spam |
| Claiming regular classes in Korçë, Gjirokastër, Vlorë, Corfu | Only “upon request” is documented |
| Putting Yoga Retreat Saranda in the `/retreats` title | Product is still upcoming; term is reserved |
| Replacing Albania titles with “Tirana Saranda Albania” stacks | Keyword stuffing |
| Gym / power / hot / weight-loss / YTT targeting | Negative topics |

---

**Next step:** Review this report, then commit / push / deploy the Next.js app when ready. No deployment was performed here.
