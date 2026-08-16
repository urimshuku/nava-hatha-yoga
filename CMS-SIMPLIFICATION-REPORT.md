# CMS Simplification Report — Nava Hatha Yoga

Implementation of [CMS-AUDIT.md](./CMS-AUDIT.md) and [CMS-REORGANIZATION-PLAN.md](./CMS-REORGANIZATION-PLAN.md). Nothing was deployed.

---

## 1. What was wrong before

- The Studio desk did not follow the website. Site Settings was first; “Programs Page” was a different item from “Programs”.
- Programs were a generic document list. An editor could not open **Surya Kriya** by name.
- Field order inside program documents did not match the page (related links and image sat above “What is this practice?”).
- Several website phrases were hardcoded while nearby copy lived in Sanity (Programs listing headings, Contact/Register heroes, archive pages, “Coming Soon” / “What to expect” labels).
- The same sentences often existed in three places: Sanity, `lib/placeholders.ts`, and `lib/constants.ts` / `lib/seo-phase1.ts`.
- A few CMS fields were stored and queried but never shown (`homePage.hero.image`, `event.teacher`, `event.registrationLink`).
- Source files mixed documents with objects (`sanity/schemaTypes`) and kept all GROQ in one file.

---

## 2. New CMS navigation

```
Home
Programs
  Programs page
  Surya Kriya
  Angamardana
  Yogasanas
  Upa Yoga
  Bhuta Shuddhi
  Surya Shakti
  Children's Program
  Bhastrika Kriya
  Jala Neti
  Thoppukarnam
  Shanmukhi Mudra
  Eye Care Practices
  Pavanamuktasana
Retreats
  Retreats page
  How to add a retreat
  Retreat template
  (each retreat by title)
Events
  Events page
  (each event by title)
About
Contact
Site Settings
  Site Settings
  Registration form
  (legal pages by title)
```

Maximum depth is two levels. Singletons still cannot be duplicated or deleted.

Studio program order is the requested prominence order. The live `/programs` grid still follows each program’s **Order on the Programs page** field (`orderRank`) so production listing order was not rewritten.

---

## 3. New folder organization

```
sanity/
  schemas/
    documents/     one file per page or collection type
    objects/
    index.ts
  structure/
    index.ts
    programs.ts
    retreats.ts
    events.ts
  queries/
    index.ts
    fragments.ts
    pages.ts
    programs.ts
    events.ts
    retreats.ts
  lib/
    client.ts
    image.ts
    fetch.ts
    types.ts
  env.ts
  components/RetreatHowTo.tsx
```

Next.js pages still import `@/sanity/lib/fetch` and `@/sanity/lib/types`.

---

## 4. Schema changes

- Document titles: Home, About, Contact, Programs page, Events page, Retreats page, Registration form, Legal page.
- Groups reduced to **Content** + **SEO** on most pages. Register keeps Health / Disclaimer / Agreement / Guidelines because those match the form. Events have a single untitled form (no extra tabs).
- Program fields reordered to match the page: hero → what-is → about → benefits → before → after → sidebar → page settings → SEO.
- Home fields grouped as Hero, Highlights, Intro, Featured programs, Upcoming events, Private sessions, Contact.
- Program preview: title + “Program” (or “Special program”) + image.
- SEO object: optional **Social Image**. Canonical URLs remain automatic. No public noindex toggle (Register and Thank You stay noindex in code).
- Short editor descriptions added where a field could be confusing.

---

## 5. Fields removed

**None.** No field names or document IDs were deleted.

---

## 6. Fields retained (hidden or explained)

| Field | Handling |
|---|---|
| `homePage.hero.image` | Hidden. Not shown on the homepage. Data kept. |
| `event.registrationLink` | Hidden. Site always uses `/register`. Data kept. |
| `event.teacher` | Hidden. Not shown on cards. Data kept. |
| `event.time` | Hidden when session rows exist (unchanged). |
| `event.image` | Visible as “Image for Search Results” (JSON-LD / sharing). |
| About highlight `eyebrow` / `stat` / `body` / logo flag | Hidden. Ribbon only uses titles. Data kept. |
| `priceLabel` on programs | Kept. Sidebar price remains off on the website. |

---

## 7. Fields renamed

Only **Studio titles** changed (for example `heroEyebrow` → “Small Label”, `slug` → “Page URL”). Field `name`s are unchanged so existing documents keep working.

---

## 8. Data migrations performed

**None.** No production documents were rewritten. New fields are optional; empty values fall back to the current website wording.

---

## 9. Website content moved from hardcoded → CMS

| Content | CMS field | Fallback if empty |
|---|---|---|
| Programs “Main programs” / “Special programs” / lead | `programsPage` | Previous hardcoded strings |
| Contact small label | `contactPage.heroEyebrow` | “Contact” |
| Register hero | `registerPage` hero fields | Previous hardcoded strings |
| About “About the Teacher” | `aboutPage.teacherSectionTitle` | “About the Teacher” |
| Retreats “Coming Soon” / “What to expect” labels | `retreatsPage` | Previous hardcoded strings |
| Events / retreats archive heroes | `eventsPage` / `retreatsPage` archive fields | Previous hardcoded strings |
| Optional social image | `seo.image` | Existing page image or site default |

Private Sessions still lives on **Home** (one source) and is reused on Programs. The Home field now says so.

---

## 10. Unused CMS content — how it was handled

- Unused visual fields: **hidden, not deleted**.
- Unused About highlight extras: **hidden, not deleted**.
- Event image: **kept and labelled** because structured data uses it.
- Retreat template document: **kept** under Retreats, still excluded from the public site.

---

## 11. 1:1 mapping results

| URL | CMS | Status |
|---|---|---|
| `/` | Home | Aligned. Hero image unused (hidden). |
| `/programs` | Programs page + each Program | Listing headings now editable. Private Sessions edited on Home. |
| `/programs/[slug]` | Named program under Programs | Field order matches the page. Bonus/medical still in Site Settings (shared across programs). |
| `/retreats` | Retreats page + retreats | Partner programs stay on the landing page. |
| `/retreats/[slug]` | Named retreat | Unchanged behaviour. |
| `/retreats/archive` | Retreats page → Past retreats fields | Now editable. |
| `/events` | Events page + events | Cards are the events. |
| `/events/archive` | Events page → Past events fields | Now editable. |
| `/about` | About | Teacher heading now editable. |
| `/contact` | Contact + Site Settings contact details | Small label now editable. |
| `/register` | Site Settings → Registration form | Hero now editable; form copy already was. |
| Legal URLs | Site Settings → legal pages | Unchanged. |
| `/thank-you` | — | Intentionally code-only (noindex). |

---

## 12. Remaining hardcoded website content (and why)

Keep in code (navigation, chrome, or resilience):

- Header/footer nav and “Upcoming Events”
- “Register” / “Register via WhatsApp” / “View past events” buttons
- Program section titles that match the CMS field names (“About the Practice”, “Benefits”, “After the Program”)
- Sidebar buttons “View upcoming events” / “Register interest”
- Phase-1 SEO strings (`lib/seo-phase1.ts`) — used only when CMS SEO is empty; **not changed**
- Placeholders (`lib/placeholders.ts`, `lib/constants.ts`, `lib/register-content.ts`, `lib/teacher-story.ts`, `lib/legal-content.json`) — used if Sanity is empty or down. They match current production wording.

Editors should treat Sanity as the source of truth. Code fallbacks exist so the site still renders.

---

## 13. SEO verification

- Canonical URLs still generated from the real path.
- `seo.title` / `seo.description` still override page defaults; Phase-1 strings still apply when CMS SEO is empty.
- Optional `seo.image` is used for Open Graph/Twitter **only when set**; otherwise existing page/default images remain.
- Sitemap, robots, Course / Event / LocalBusiness / Breadcrumb JSON-LD unchanged in behaviour.
- Program URLs in the production build: `/programs/angamardana`, `/programs/bhastrika-kriya`, `/programs/bhuta-shuddhi`, and 10 further program slugs (13 total). Unchanged.
- `/register` remains noindex.
- No deploy, so production HTML is unchanged until you ship this branch.

---

## 14. Build / typecheck / lint results

| Check | Result |
|---|---|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass (2 existing warnings in `cloudflare-env.d.ts`, unrelated) |
| `npm run build` | Pass — 38 static pages generated, including `/studio` and all program routes |

---

## 15. Remaining recommendations

1. In Studio, open each **Program** and set **Order on the Programs page** if you want the live grid to match the new Studio prominence (Surya Kriya first). This was not written into production data.
2. Fill the new optional fields (listing headings, archive copy, social image) only if you want to change them; empty = current site text.
3. After you review Studio locally (`npm run dev` → `/studio`), deploy when ready. This work does not deploy itself.
4. Register form copy still has a code fallback. If you edit it in Sanity, that published value is what the site shows.
5. Do not delete hidden fields later without checking historical documents.

---

## Naming convention (current)

| Term | Meaning |
|---|---|
| Program | A practice page (`/programs/…`) |
| Event | A dated session on `/events` |
| Retreat | A dated immersive offering (`/retreats/…`) |
| Teacher | Person on About (not a separate document type) |
| Site Settings | Brand, contact, program-wide notices, registration form, legal |
