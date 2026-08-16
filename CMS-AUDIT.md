# CMS Audit — Nava Hatha Yoga

Audit of the Sanity CMS against the live website ([navahathayoga.com](https://navahathayoga.com)). No production data was mutated. Studio documents were inspected via schemas, GROQ queries, Next.js pages, and the public site.

---

## 1. Current CMS structure

### Document types (singletons)

| Schema name | Studio title | Document ID | Website |
|---|---|---|---|
| `siteSettings` | Site Settings | `siteSettings` | Header, footer, contact details, program-wide notices, default SEO |
| `homePage` | Home Page | `homePage` | `/` |
| `aboutPage` | About Page | `aboutPage` | `/about` |
| `programsPage` | Programs Page | `programsPage` | `/programs` (hero + free offerings only) |
| `eventsPage` | Events Page | `eventsPage` | `/events` |
| `retreatsPage` | Retreats Page | `retreatsPage` | `/retreats` |
| `contactPage` | Contact Page | `contactPage` | `/contact` |
| `registerPage` | Register Page | `registerPage` | `/register` (overlays `lib/register-content.ts`) |

Singletons already cannot be duplicated or deleted. That part is sound.

### Document types (collections)

| Schema name | Studio title | Website |
|---|---|---|
| `program` | Programs | `/programs/*` and cards on Home / Programs |
| `event` | Events | `/events`, home upcoming list, program “Sessions for…” |
| `retreat` | Retreats | `/retreats`, `/retreats/[slug]` |
| `legalPage` | Legal Pages | `/terms-of-service`, `/privacy-policy`, `/cookie-policy` |

### Objects

`aboutSection`, `blockContent`, `ctaLink`, `disclaimerItem`, `disclaimerSection`, `guidelineBlock`, `guidelineList`, `guidelineSection`, `imageWithAlt`, `seo`.

All objects are used. None are orphaned.

---

## 2. Current Studio navigation

Top-level desk today:

1. Site Settings
2. Home Page
3. About Page
4. Programs Page *(landing copy only)*
5. Events Page *(landing copy only)*
6. Contact Page
7. Register Page
8. Retreats Page *(landing copy only)*
9. Programs *(generic document list)*
10. Events *(generic document list)*
11. How to add a retreat
12. Retreat template
13. Retreats *(generic document list)*
14. Legal Pages

Problems:

- The desk does not follow the website (Home → Programs → Retreats → Events → About → Contact).
- Site Settings is first; it should be last.
- “Programs Page” is a different item from “Programs”. An editor looking for Surya Kriya has to know the difference.
- Programs are a technical list, not named pages.
- Retreat how-to, template, and list are three sibling items.
- Depth is already shallow, but grouping is developer-centric (`* Page` suffixes, generic lists).

---

## 3. Current schema / source folders

```
sanity/
  schemaTypes/          documents mixed with objects/
    objects/
    index.ts
  structure.ts          entire desk in one file
  lib/
    queries.ts          all GROQ in one file
    fetch.ts
    client.ts
    image.ts
    types.ts
  env.ts
  components/RetreatHowTo.tsx
```

This is already small and workable. It is not mysterious, but names are uneven (`schemaTypes` vs `structure.ts` vs `lib/queries.ts`).

---

## 4. Page ↔ CMS mapping

| Website URL | CMS document | Type | Main editable sections | Hardcoded / fallback remaining | Issues |
|---|---|---|---|---|---|
| `/` | `homePage` | singleton | Hero, highlights, intro, featured programs, upcoming events, private sessions, contact CTA, SEO | Nav; many `??` fallbacks in the page; `PHASE1_HOME_SEO`; hero image unused | Hero image is in CMS but not rendered. Private sessions live on Home but also appear on `/programs`. |
| `/programs` | `programsPage` + all `program` + `homePage.privateCorporate` | singleton + collection | Hero, free offerings; program cards from `program`; private sessions from Home | “Main programs” / “Special programs” headings; special-programs lead | Listing headings not in CMS. Private sessions are edited on Home, not Programs. |
| `/programs/[slug]` | `program` + `siteSettings` (bonus, medical, default before-notes) | collection | Hero, what-is, about, benefits, before/after, bonus/medical, sidebar | Section titles (“About the Practice”, “Benefits”); sidebar CTAs; after-program fallback copy; `PHASE1_PROGRAM_SEO` context/related; local images | Field order in Studio ≠ page order. Related programs are free-text links, not program picks. Triple fallback (CMS → site settings → `lib/constants.ts`). |
| `/retreats` | `retreatsPage` + `retreat` | singleton + collection | Hero, coming soon / list, expectations, listing CTA, partner programs | “Coming Soon” / “What to expect” eyebrows; archive button | Partner programs are on this page (correct). Individual retreats are a separate list. |
| `/retreats/[slug]` | `retreat` | collection | Title, dates, location, price, body, gallery, sidebar, cancellation, SEO | “Retreat” / “Past retreat” eyebrows; Register button label | Fine. Template document is excluded from the site. |
| `/retreats/archive` | none | — | — | Entire page copy | No CMS document. |
| `/events` | `eventsPage` + `event` | singleton + collection | Hero, empty state, contact strip | “View past events”; Register / WhatsApp labels | Event cards are the events themselves (no per-event URL). |
| `/events/archive` | none | — | — | Entire page copy | No CMS document. `getPastEvents` also merges empty placeholder past events. |
| `/about` | `aboutPage` | singleton | Hero, optional intro, teacher story, highlight ribbon, sections, CTA, SEO | “About the Teacher” heading; teacher photo/story fallbacks in `lib/teacher-story.ts` | Highlight cards store eyebrow/stat/body that the ribbon does not display (titles only). |
| `/contact` | `contactPage` + `siteSettings` | singleton | Hero, form heading, locations, quick message; email/phone/WhatsApp from settings | Eyebrow always “Contact”; “Contact details” / “Quick message” labels; Explore/See upcoming links | Missing `heroEyebrow` field. |
| `/register` | `registerPage` | singleton | Health, disclaimer, agreement, guidelines | Entire hero; step UI labels | CMS overlays `lib/register-content.ts`. Dual source of truth. |
| `/thank-you` | none | — | — | Entire page | Intentional (transactional, noindex). Keep in code. |
| `/terms-of-service` `/privacy-policy` `/cookie-policy` | `legalPage` by slug | collection | Title, body, SEO | Eyebrow always “Legal”; fallback from `lib/legal-content.json` | Fine as a collection of three pages. |
| Header / Footer | `siteSettings` (brand, contact, social) | singleton | Brand name, tagline, email, phone, WhatsApp, social | `NAV_LINKS`, “Upcoming Events” button, Explore/Legal headings, WhatsApp prefill | Navigation should stay in code. |

---

## 5. Inconsistency catalog (A–H)

### A. On the website, not editable in Sanity

| Location | Content | Notes |
|---|---|---|
| Header / Footer | Nav labels and “Upcoming Events” | Keep in code (navigation). |
| `/programs` | “Main programs”, “Special programs”, special lead | Should be CMS. |
| `/contact` | Eyebrow “Contact” | Should be CMS. |
| `/register` | Hero eyebrow/title/description | Should be CMS. |
| `/events/archive`, `/retreats/archive` | All hero copy | Optional CMS; low frequency. Recommend adding to the Events / Retreats landing documents. |
| `/retreats` | “Coming Soon” and “What to expect” eyebrows | Headings below them are CMS. |
| Program pages | “About the Practice”, “Benefits”, “After the Program”, “Intensity”, “Related:”, sidebar buttons | Section chrome. Keep in code unless an editor needs to rename them. |
| About | “About the Teacher” heading | Should be CMS. |
| Event cards | “Register”, “Register via WhatsApp” | UI chrome. Keep. |
| `/thank-you`, 404 | Full copy | Keep in code. |

### B. Editable in Sanity, ignored by the website

| Field | Used for | Website display |
|---|---|---|
| `homePage.hero.image` | Queried | **Not rendered.** Homepage hero is text-only. |
| `event.registrationLink` | Queried | **Not used.** Register always goes to `/register?event=…`. |
| `event.teacher` | Queried | **Not shown** on cards. |
| `aboutPage.highlightCards[].eyebrow/stat/body/showCertificationLogo` | Stored | Ribbon shows **titles only**. Extra fields are unused on the site. |
| `event.image` | JSON-LD / social, not the card | Card uses the program symbol, not this image. Keep for structured data. |

### C. CMS value vs hardcoded different value

Not a live mismatch when CMS is populated: pages prefer CMS, then placeholders, then `PHASE1_*` / `lib/constants.ts`.

Risk: if CMS is empty or a field is blank, a **different** string from code appears. That is three sources for the same sentence (CMS, placeholders, Phase-1 SEO). Fallbacks should match CMS intent, not invent a second voice.

Register form: CMS wins when filled; otherwise `lib/register-content.ts`. If those two diverge, the site silently shows whichever is filled.

### D. CMS section with no website section

- Home hero image (see B).
- Event teacher, event external registration link.
- About highlight card body/stat/eyebrow (ribbon is title-only).

### E. Website section with no CMS section

- Programs listing headings.
- Contact / register / archive heroes (partial).
- Global nav.

### F. Titles / labels differ

| CMS | Website |
|---|---|
| Home Page | Home |
| Programs Page | Programs & Offerings |
| Retreats Page | Retreats & Partner Programs |
| “Eyebrow” | Small label above the title |
| `orderRank` title “Order” | Not shown; controls list order |
| “Hero highlights” | No heading on the site (three quotes under the hero) |

### G. CMS field order ≠ website order

**Program document (worst case).** Site order:

1. Title / short intro / context
2. What is…
3. About the Practice
4. Benefits
5. Before the Program
6. After the Program
7. Bonus + Medical notice (from Site Settings)
8. Sidebar: image, video, intensity, price, sessions, related

Studio order today: title, slug, published, category, order, image, short intro, context, related programs, what-is, about, benefits, intensity, after, sessions, before, video, price, SEO.

**Home:** already close (hero → highlights → intro → featured → events → private → CTA). Groups split this across “Hero” and “Sections” tabs.

**Event card vs Studio:** card shows location, dates, title, description, schedule, age, intensity, notes, price, register. Studio starts with title/published/dates, then schedule, then location/price, then teacher (unused), then description.

### H. Same content in code and Sanity

| Content | CMS | Code |
|---|---|---|
| Almost every page hero | Page documents | `lib/placeholders.ts` |
| Program body copy | `program` | `programSeeds` in placeholders |
| Contact / location / WhatsApp | `siteSettings` | `CONTACT` in `lib/constants.ts` |
| SEO titles/descriptions | `seo` | `lib/seo-phase1.ts` |
| Register legal/guidelines | `registerPage` | `lib/register-content.ts` |
| Teacher story | `aboutPage.teacherStory` | `lib/teacher-story.ts` |
| Legal body | `legalPage` | `lib/legal-content.json` |
| Before-program notes, bonus, medical, prices, videos, intensity | program / site settings | `lib/constants.ts` maps by slug |
| Private session cards | `homePage.privateCorporate` | component `DEFAULT_*` |
| Free offerings | `programsPage.freeOfferings` | component `DEFAULT_ITEMS` |
| Hero highlights | `homePage.highlights` | component `DEFAULT_ITEMS` |

This is the core 1:1 problem: **CMS is primary, but code still carries a full second website.**

---

## 6. Unused / confusing CMS pieces

Keep (do not delete without a migration):

| Item | Why keep |
|---|---|
| `homePage.hero.image` | May contain production assets; not displayed. Hide from editors. |
| `event.registrationLink` | Historical; site uses `/register`. Hide from editors. |
| `event.teacher` | Historical; not displayed. Hide from editors. |
| `event.time` | Legacy schedule; already hidden when `sessions` exist. |
| `event.image` | Used in Event JSON-LD. Keep, label clearly. |
| About highlight extra fields | Data may exist; ribbon only needs titles. Simplify the object to title (+ optional unused fields hidden). |
| `retreat-test-preview` | Operational template. Keep, nest under Retreats. |

No unused **schemas**. No unused **queries** of published types.

`getPastEvents` concatenates `placeholderPastEvents` (empty) with CMS events — harmless but noisy.

---

## 7. Duplicate sources of truth (priority)

1. **Page copy:** Sanity document vs `lib/placeholders.ts` vs inline `?? "…"`.
2. **SEO:** Sanity `seo` vs `lib/seo-phase1.ts` vs `SITE_DESCRIPTION`.
3. **Programs:** Sanity vs `programSeeds` vs `lib/constants.ts` (prices, videos, intensity, before-notes).
4. **Register:** Sanity vs `lib/register-content.ts`.
5. **Teacher story:** Sanity vs `lib/teacher-story.ts`.
6. **Legal:** Sanity vs `lib/legal-content.json`.

Fallbacks are justified for local/dev and CMS outage. They must not disagree with intended production copy.

---

## 8. Confusing organization (editor view)

- “Page” documents vs “the actual programs/events/retreats”.
- Private Sessions edited on Home, shown on Programs.
- Bonus / medical / default before-notes live in Site Settings → “Program pages”, not on the program.
- Related programs are URL + label, not “pick a program”.
- `relatedPrograms` on Bhuta Shuddhi can point at `/about` (not a program) — references-only would be wrong.
- Register is a long technical form; it does not belong next to Home in the desk.

---

## 9. Naming

Used consistently: **Program**, **Event**, **Retreat**, **Teacher** (in copy, not a document type).

Avoided in schemas: programme, course, offering (except “free offerings” and private-session “offerings”, which match the website).

Keep that vocabulary.

---

## 10. SEO / technical (must preserve)

- Canonical URLs are generated from the path. **Do not add a CMS canonical field.**
- `seo` object is title + description only. No social image field yet (requested; additive).
- Phase-1 SEO strings are fallbacks when CMS SEO is empty. Keep them; do not change the strings.
- Structured data: LocalBusiness, Event, Course, Breadcrumb — driven by CMS + `lib/structured-data.ts`.
- Sitemap uses program/retreat slugs from Sanity.
- `/register` and `/thank-you` are noindex in code. Do not expose a general noindex toggle on public pages.
- Program slugs and URLs must not change.

---

## 11. Migration risks

| Change | Risk | Approach |
|---|---|---|
| Reorder schema fields | None (order is Studio-only) | Safe |
| Rename field `name`s | Data loss | **Do not rename names.** Only change `title` / descriptions |
| Delete unused fields | Production may still store values | **Hide, do not delete** |
| Related programs → references | Breaks `/about` links; needs migration | **Keep** `ctaLink` |
| Move private sessions to Site Settings | Duplicate until migrated | Keep on Home; label that it also appears on Programs |
| Folder moves (`schemaTypes` → `schemas`) | Import paths | Update `sanity.config.ts` and internal imports only |
| Change `orderRank` in production | Would reorder the live Programs grid | **Do not write production data.** Studio nav can use a fixed prominence order independently of `orderRank` |
| New SEO image field | Additive | Optional; only used when set |

---

## 12. What is already good

- Singletons with fixed IDs and disabled duplicate/delete.
- Most field titles are already human (`What is this practice?`, `After the Program`).
- Program `orderRank` already exists (website listing is not `_createdAt`).
- GROQ queries match displayed fields with only a few unused extras.
- Legal, register, and retreat template workflows exist.
- Canonicals, sitemap, and JSON-LD are not CMS-manual.

---

## 13. Live website notes (public pages)

Programs listing order on production (main): Upa Yoga, Surya Kriya, Surya Shakti, Yogasanas, Angamardana, Bhuta Shuddhi, Children’s Program — then specials. That is CMS `orderRank` / category, not the requested Studio prominence order. Studio nav will use the requested prominence; the live grid stays as stored in Sanity until an editor changes Order.
