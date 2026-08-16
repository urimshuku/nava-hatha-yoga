# CMS Reorganization Plan — Nava Hatha Yoga

This plan follows [CMS-AUDIT.md](./CMS-AUDIT.md). Implementation must not change website design, slugs, SEO fallbacks, or production documents.

---

## CURRENT vs PROPOSED navigation

### Current

```
Content
├── Site Settings
├── Home Page
├── About Page
├── Programs Page
├── Events Page
├── Contact Page
├── Register Page
├── Retreats Page
├── Programs          ← generic list
├── Events            ← generic list
├── How to add a retreat
├── Retreat template
├── Retreats          ← generic list
└── Legal Pages
```

### Proposed (max 2 levels)

```
Content
├── Home
├── Programs
│   ├── Programs page          ← landing copy for /programs
│   ├── Surya Kriya
│   ├── Angamardana
│   ├── Yogasanas
│   ├── Upa Yoga
│   ├── Bhuta Shuddhi
│   ├── Surya Shakti           ← on the live site; keep visible
│   ├── Children's Program
│   ├── Bhastrika Kriya
│   ├── Jala Neti
│   ├── Thoppukarnam
│   ├── Shanmukhi Mudra
│   ├── Eye Care Practices
│   └── Pavanamuktasana
├── Retreats
│   ├── Retreats page
│   ├── How to add a retreat
│   ├── Retreat template
│   └── (each retreat by title)
├── Events
│   ├── Events page
│   └── (each event by title, soonest first)
├── About
├── Contact
└── Site Settings
    ├── Site Settings          ← brand, contact, program-wide notices, default SEO
    ├── Registration form      ← /register copy
    └── Legal pages
```

Rules:

- Top level follows the website: Home, Programs, Retreats, Events, About, Contact, then Site Settings.
- Contact stays top-level because it is a primary site page.
- Register and Legal are not in the main nav; they live under Site Settings.
- Programs are named documents, ordered by prominence (not `_createdAt`). Extra/unknown programs still appear after the known list.
- New programs can still be created from the Studio create menu (program is not a singleton).
- No “Pages → Marketing → Homepage” nesting.

---

## Proposed source folders

```
sanity/
  schemas/
    documents/          one file per document type
    objects/            one file per object
    index.ts
  structure/
    index.ts            desk + singletons
    programs.ts         program nav order + list builder
    retreats.ts
    events.ts
  queries/
    index.ts            re-exports
    fragments.ts        seo + image projections
    pages.ts            singletons + legal
    programs.ts
    events.ts
    retreats.ts
  lib/
    client.ts
    image.ts
    fetch.ts            unchanged role (ISR fetch + placeholders)
    types.ts
  env.ts
  components/
    RetreatHowTo.tsx
```

App imports stay `@/sanity/lib/fetch` and `@/sanity/lib/types` so Next.js pages do not churn.

`sanity.config.ts` will import schemas from `./sanity/schemas` and structure from `./sanity/structure`.

---

## Schema changes (safe)

| Change | Why |
|---|---|
| Human titles: Home, About, Programs page, … | Match the website |
| Field `title`s only — never rename `name`s | Preserve data |
| Program fields reordered to match the page | 1:1 editing |
| Groups: Content + SEO (most documents) | Fewer tabs |
| Home: merge Hero + Sections into Content | Same |
| Site Settings: Content + SEO; program defaults as a fieldset | One settings home |
| Events/Retreats: Content + SEO (retreats); events stay Content-only | Events have no per-page SEO |
| Register: keep step groups (they match the form) | Exception |
| Program preview: title + “Program” + image | Scannable |
| SEO object: optional social image; no canonical; no noindex on public pages | Requested, additive |
| Hide unused fields (`hero.image`, `event.registrationLink`, `event.teacher`) | Still in schema |
| Descriptions on confusing fields | Short, editorial |
| New fields with fallbacks to today’s hardcoded strings | 1:1 without visual change |

### New fields (all optional, fallbacks = current site text)

- `programsPage`: main programs heading, special programs heading, special programs lead
- `contactPage`: hero small label
- `registerPage`: hero small label, title, description
- `eventsPage`: archive hero fields
- `retreatsPage`: coming-soon small label, what-to-expect small label, archive hero fields
- `aboutPage`: teacher section heading
- `seo.image`: social image

### Will not do

- Delete fields or documents
- Rename field names or document `_id`s
- Change program slugs or URLs
- Change Phase-1 SEO fallback strings
- Convert related programs to references (would break `/about` links)
- Move private sessions off Home (used on two pages; one source stays Home, with a note)
- Put navigation in the CMS
- Change website CSS/layout
- Deploy
- Write `orderRank` into production (would reorder `/programs`)

---

## Content-source alignment

- Website continues: **CMS value if present → existing code fallback**.
- Fallbacks stay as resilience, aligned with current production wording.
- New CMS fields are wired so an editor change publishes to the site.
- Unused CMS fields are hidden, not deleted.
- `lib/placeholders.ts` remains the offline/dev fallback, not a second editorial tool.

---

## Naming convention (going forward)

| Use | For |
|---|---|
| Program / Programs | Practice pages and listings |
| Event / Events | Dated workshops and sessions |
| Retreat / Retreats | Immersive dated offerings |
| Teacher | About-page person (not a document type) |
| Location | Where something is offered |
| Site Settings | Global brand, contact, program-wide notices |

Do not mix programme / course / offering for the same type.

---

## Verification (Phase D)

- `npm run typecheck`
- `npm run lint`
- Sanity config loads (schema + structure compile)
- `npm run build` if environment allows
- Primary routes still exist with the same paths
- SEO helpers still prefer CMS `seo` then Phase-1 strings
- No deploy
