# CMS 1:1 Final Verification

Date: 16 August 2026  
Scope: CMS alignment only. No design, CSS, slug, URL, SEO wording, structured-data, canonical, sitemap, or production-copy changes. **Not deployed.**

Principle applied: if editorial text is visible on the website, that same current value now exists in Sanity. Code fallbacks remain for resilience only.

---

## What was done

1. Audited production Sanity against live website fallbacks.
2. Populated empty CMS fields with the **current production wording** (`setIfMissing` only — existing values were not overwritten).
3. Clarified Studio labels for Private Sessions and Program-wide Content.
4. Marked hidden historical fields as **LEGACY / STORED / NOT CURRENTLY DISPLAYED**, and stopped querying unused event/home/about fields so they cannot override the website.
5. Made essential populated editorial fields required in Studio.
6. Did **not** change `orderRank` or the live `/programs` order.

Checks:

- `npm run typecheck` — pass
- `npm run lint` — pass (0 errors; 2 existing warnings in `cloudflare-env.d.ts`)
- `npm run build` — pass

---

## 1. Were any visible website values coming from code because the CMS field was empty?

**Yes, before this pass.** After populate, **no** for normal editorial content.

Empty CMS fields that were driving visible website text via fallbacks:

| Document | Empty field | Website was showing |
|---|---|---|
| `programsPage` | `mainProgramsHeading` | Main programs |
| `programsPage` | `specialProgramsHeading` | Special programs |
| `programsPage` | `specialProgramsLead` | Practices that support specific aspects of health and wellbeing. |
| `programsPage` | `freeOfferings` | Entire Free offerings section |
| `contactPage` | `heroEyebrow` | Contact |
| `contactPage` | `teachingLocations.mainHeading` | Main teaching locations |
| `contactPage` | `teachingLocations.mainLocations` | Tirana, Saranda. |
| `contactPage` | `teachingLocations.otherHeading` | Other teaching locations upon request |
| `registerPage` | `heroEyebrow` | Registration |
| `registerPage` | `heroTitle` | Program registration |
| `registerPage` | `heroDescription` | Please complete the form below… |
| `eventsPage` | archive hero / empty copy | Archive / Past events / empty-state copy |
| `retreatsPage` | `heroEyebrow` | Retreats & Partner Programs |
| `retreatsPage` | `comingSoonEyebrow` | Coming Soon |
| `retreatsPage` | `expectationsEyebrow` | What to expect |
| `retreatsPage` | `partnerPrograms` | Entire Partner Programs section |
| `retreatsPage` | `listingCta` + archive copy | Stored for when those views appear |
| `aboutPage` | `teacherSectionTitle` | About the Teacher |
| `aboutPage` | `highlightCards` | Ribbon titles |
| `homePage` | `highlights` | Three highlight lines + closing quote |
| `homePage` | featured/events headings & CTAs | Programs / Upcoming events labels |
| `homePage` | `privateCorporate.lead`, offerings, CTA | Private Sessions body (heading was already in CMS) |
| `siteSettings` | bonus / medical title / discount / experience note / Instagram / default SEO | Program-page boxes + Instagram |
| Programs | `intensity` (core programs) | Medium / High / Low from `lib/constants.ts` |
| Programs | some `videoTitle` | “[Title] on YouTube” |
| Programs | `beforeProgramTitle` (except Jala Neti / Eye Care) | Before the Program |
| Legal pages | `seo.title` / `seo.description` | Page title + site description |

Those fields are now populated. Fallbacks remain as emergency copies of the same wording.

---

## 2. Which CMS fields were populated?

All writes used `setIfMissing`. Existing production values were left unchanged.

**Home (`homePage`)**

- `highlights` (3 items + closing quote)
- `featuredProgramsSection.eyebrow` / `title` / `ctaLabel`
- `upcomingEventsSection.eyebrow` / `title` / `emptyTitle` / `emptyDescription` / `ctaLabel`
- `privateCorporate.lead` / `offerings` / `cta`

**Programs page**

- `mainProgramsHeading`, `specialProgramsHeading`, `specialProgramsLead`, `freeOfferings`

**Contact**

- `heroEyebrow`
- `teachingLocations.mainHeading` / `mainLocations` / `otherHeading`

**About**

- `teacherSectionTitle`
- `highlightCards` (3 ribbon titles)

**Register**

- `heroEyebrow`, `heroTitle`, `heroDescription`

**Events page**

- `archiveEyebrow`, `archiveTitle`, `archiveDescription`, `archiveEmptyTitle`, `archiveEmptyDescription`

**Retreats page**

- `heroEyebrow`, `comingSoonEyebrow`, `expectationsEyebrow`
- `listingCta`
- `partnerPrograms` (full section)
- archive hero / empty copy

**Site Settings**

- `bonusTitle`, `bonusItems`, `discountNote`, `medicalNoticeTitle`, `eventExperienceNote`
- `social` (Instagram)
- `seo.title`, `seo.description`

**Programs**

- `intensity` for: Upa Yoga, Surya Kriya, Surya Shakti, Yogasanas, Angamardana, Children's Program
- `videoTitle` for: Surya Kriya, Surya Shakti, Yogasanas (others already had titles)
- `beforeProgramTitle` = “Before the Program” where missing  
  Jala Neti and Eye Care Practices kept **Pre-Requisite** (`setIfMissing` did not overwrite)

**Legal pages**

- `seo.title` = document title
- `seo.description` = current site description (same string already used as metadata fallback)

---

## 3. Does every important visible editorial value now exist in Sanity?

**Yes, for normal page editorial content.**

Confirmed populated in production Sanity and used by the website queries:

- Home hero, highlights, intro, featured headings, events headings, private sessions, final CTA, SEO
- Programs listing hero, headings, free offerings, private sessions (from Home)
- Every program title, short intro, context line, body sections, before-program notes, after-program body, sidebar sessions, related links, SEO
- Retreats hero, coming soon, what-to-expect, partner programs, SEO
- Events hero, empty state, contact block, archive copy, SEO
- About hero, teacher heading, teacher story, ribbon titles, sections, final CTA, SEO
- Contact hero, form heading, WhatsApp copy, teaching locations, SEO
- Register hero + full form document
- Site Settings brand, contact, program-wide boxes, Instagram
- Legal page titles, bodies, and SEO title/description

Structural headings that are the same on every program page remain code-generated (see question 4). They are not unique editorial copy.

---

## 4. Which content intentionally remains code-only?

These are not unique page copy. They are chrome, generated labels, or assets:

| Content | Why it stays in code |
|---|---|
| Header/footer nav labels (`NAV_LINKS`) | Site chrome, not a CMS page |
| Legal footer link labels | Match routes; page titles live in CMS |
| Logo / certification image alts | Asset constants |
| “About the Practice”, “Benefits”, “After the Program” | Shared section titles on every program page |
| `What is {Program}?` | Generated from the program title |
| “All programs”, “View upcoming events”, “Register interest” | Interface actions |
| Event card “Register” / “Register via WhatsApp” | Always goes to `/register` |
| Partner Programs “Message on WhatsApp” | Button label |
| Form field placeholders (“e.g. Weekday mornings”) | Input chrome |
| Default OG image (`/images/og-default.png`) | Asset fallback |
| 404 / thank-you page copy | Utility pages, not CMS documents |
| Cookie / UI “Close”, “Menu”, etc. | Interface |

Prices exist on program documents but the sidebar price is **intentionally hidden** (`SHOW_PROGRAM_SIDEBAR_PRICE = false`). Stored, not displayed.

---

## 5. Which fallback files remain?

| File | Role |
|---|---|
| `lib/placeholders.ts` | Full document fallbacks if a Sanity fetch returns nothing |
| `lib/constants.ts` | Brand, contact, program intensity/notes/bonus/medical/video helpers |
| `lib/seo-phase1.ts` | Phase-1 SEO title/description fallbacks (**kept**) |
| `lib/register-content.ts` | Registration form copy if the Register document is missing/partial |
| `lib/register-config.ts` | Merges CMS register fields over `DEFAULT_REGISTER_CONTENT` |
| `lib/teacher-story.ts` | Teacher story if About CMS story is missing |
| `lib/legal-content.json` + `lib/legal-content.ts` | Legal page bodies if CMS legal documents are missing |
| `lib/seo.ts` | Default OG image |
| Component `DEFAULT_*` in `HeroHighlights`, `FreeOfferingsSection`, `PrivateSessionsSection`, `AboutHighlightCards`, `PartnerProgramsSection` | Section-level resilience if a nested field is empty |
| Page-level `?? "…"` strings | Last-line resilience; now match CMS wording |

---

## 6. Under exactly what conditions are those fallbacks used?

Normal production path: **Sanity document → website.**

Fallbacks activate only if:

1. Sanity is not configured, or
2. The fetch throws (network/API failure), or
3. The document/array result is empty (`null` / `[]`), or
4. A **specific field** is blank — then that field’s string fallback is used.

They do **not** run when the CMS field contains the current production value.

Phase-1 SEO fallbacks still protect `<title>` and meta description if `seo.title` / `seo.description` are missing. Those fields are now populated on every important public page.

---

## 7. Are there still any cases where CMS looks empty but website shows editorial content?

**No, for the editorial fields audited in this pass.**

Remaining cases that can look like “CMS empty / site has text” are intentional:

| Case | Why |
|---|---|
| Home `hero.subtitle` | Intentionally empty; website shows headline only |
| Special-program `intensity` | Intentionally empty; intensity is not shown on those pages |
| Programs without a video | `videoUrl` / `videoTitle` empty; no video UI |
| Home `hero.image` | Hidden; not displayed |
| Event `teacher`, `registrationLink` | Hidden; not displayed |
| About highlight eyebrow/stat/body | Hidden; ribbon uses **Title** only |
| Leftover `homePage.privateCorporate.body` | Not in the Studio schema and not queried. **Cannot override** the visible lead. Stored historical portable text only. |

`event.time` is **not** unused. Current events have no Session Schedule rows, so the legacy `time` field **is** the live schedule on cards. Studio hides `time` only when sessions exist. Prefer adding Session Schedule rows; until then, edit `time`.

---

## 8. Are there still any duplicate sources of truth that could realistically confuse an editor?

Reduced, not fully eliminated.

**Made clear in Studio**

- Private Sessions lives on **Home**, labelled **“Private Sessions — shown on Home and Programs”**, with:  
  “Edit this content here. The same content is displayed on both the Home page and the Programs page.”
- Site Settings fieldset is **Program-wide Content**. Fields say **“Used across multiple program pages.”**
- Program `orderRank` description now states it controls **live `/programs` only**, independent of Studio sidebar order.

**Still duplicated in code (emergency only)**

- `lib/placeholders.ts` mirrors page documents
- `lib/constants.ts` mirrors program-wide boxes / intensity / before-program titles
- `lib/seo-phase1.ts` mirrors SEO strings
- `lib/register-content.ts` mirrors the registration form
- `lib/teacher-story.ts` mirrors the About story

An editor should never need those files. They are for when Sanity is unavailable.

**Still a real editor-order difference**

Studio program list ≠ live `/programs` list. See questions 9–11. This was **not** changed.

---

## 9. What is the current website program order?

Live `/programs` is `orderRank` ascending, then title. Current production:

| orderRank | Program | Group |
|---:|---|---|
| 5 | Upa Yoga | Main |
| 10 | Surya Kriya | Main |
| 20 | Surya Shakti | Main |
| 30 | Yogasanas | Main |
| 40 | Angamardana | Main |
| 50 | Bhuta Shuddhi | Main |
| 55 | Children's Program | Main |
| 60 | Bhastrika Kriya | Special |
| 70 | Jala Neti | Special |
| 80 | Thoppukarnam | Special |
| 90 | Shanmukhi Mudra | Special |
| 100 | Eye Care Practices | Special |
| 110 | Pavanamuktasana | Special |

This is also the order in `MAIN_PROGRAM_SLUGS` / `SPECIAL_PROGRAM_SLUGS` (emergency partition only).

---

## 10. What is the current Studio program order?

`sanity/structure/programs.ts` → `PROGRAM_STUDIO_ORDER` (prominence, not `orderRank`):

1. Surya Kriya  
2. Angamardana  
3. Yogasanas  
4. Upa Yoga  
5. Bhuta Shuddhi  
6. Surya Shakti  
7. Children's Program  
8. Bhastrika Kriya  
9. Jala Neti  
10. Thoppukarnam  
11. Shanmukhi Mudra  
12. Eye Care Practices  
13. Pavanamuktasana  

Specials already match the live list. Core programs do not.

---

## 11. What would need to change to make those two orders identical?

**Nothing was changed.** Choose one of these later; do not do both.

### Option A — safest: no public website change

Keep live `orderRank` as it is (Upa Yoga first on `/programs`).

Change `PROGRAM_STUDIO_ORDER` to:

Upa Yoga → Surya Kriya → Surya Shakti → Yogasanas → Angamardana → Bhuta Shuddhi → Children's Program → (specials unchanged).

Studio would then match the live site. Visitors would see no change.

### Option B — change the public Programs page

Keep Studio prominence (Surya Kriya first).

Rewrite `orderRank` to:

| Proposed orderRank | Program |
|---:|---|
| 5 | Surya Kriya |
| 10 | Angamardana |
| 20 | Yogasanas |
| 30 | Upa Yoga |
| 40 | Bhuta Shuddhi |
| 50 | Surya Shakti |
| 55 | Children's Program |
| 60–110 | specials unchanged |

This **would change** live `/programs`. Do not apply without an explicit go-ahead.

**Recommendation:** Option A, unless the intended public order is Surya Kriya first.

---

## Hidden / legacy fields (cannot override visible content)

| Field | Status |
|---|---|
| `homePage.hero.image` | Hidden. No longer queried. Not rendered. |
| `event.teacher` | Hidden. No longer queried. Not rendered. |
| `event.registrationLink` | Hidden. No longer queried. Register always goes to `/register`. Stored values (often `/contact`) cannot override the button. |
| About highlight `eyebrow` / `stat` / `body` / `showCertificationLogo` | Hidden. No longer queried. Ribbon uses `title` only. |
| `event.time` | **Still displayed** when Session Schedule is empty (current production events). Hidden in Studio only when sessions exist. |
| Leftover `homePage.privateCorporate.body` | Not in schema, not queried. Cannot override `lead`. |
| `retreat.registrationLink` | **Not legacy.** Used on retreat detail pages and structured data. |

---

## Required vs optional (after populate)

Now required (all currently have values):

- Home headline, supporting text, intro heading, featured heading, events heading, private heading/lead, contact heading
- Programs page title, introduction, main/special headings
- Program title, short intro, slug
- Contact title, introduction, form heading
- Register title, introduction
- Events title, introduction
- Retreats title, introduction, coming-soon heading, what-to-expect heading, partner heading
- About title, teacher section heading
- Site Settings brand name, tagline, description, email, medical notice

Left optional on purpose:

- Home subtitle
- SEO social image
- Videos / video titles
- Program intensity (specials have none)
- Coming-soon-only extras beyond the heading already required
- Listing CTA (only when upcoming retreats exist)
- Archive fields (populated, not required)
- Optional About intro, highlight extras

---

## Fallback inventory

| File | Content controlled | CMS equivalent | When fallback activates | CMS populated now? | Safe to remove later? |
|---|---|---|---|---|---|
| `lib/placeholders.ts` | Full page documents | Matching singleton/program documents | Fetch fails or document empty | Yes | No — keep as outage copy |
| `lib/constants.ts` `CONTACT` / brand | Footer contact, WhatsApp, Instagram handle | Site Settings | Settings fetch fails or field empty | Yes | No |
| `lib/constants.ts` bonus/medical/discount/notes | Program-page boxes | Site Settings → Program-wide Content | Settings field empty | Yes | Later, if desired |
| `lib/constants.ts` `PROGRAM_INTENSITY_BY_SLUG` | Intensity | Program → Intensity | Field empty | Yes (core only) | Later for core; keep for specials |
| `lib/constants.ts` `getBeforeProgramTitle` | Before-program heading | Program → Before the Program — Section Title | Field empty | Yes | Later |
| `lib/constants.ts` `PROGRAM_VIDEO_*` | Video URL/title | Program video fields | URL/title empty | Titles yes where URL exists | Later |
| `lib/seo-phase1.ts` | SEO title/description | Document `seo` | `seo` empty | Yes on public pages | **No — keep Phase-1** |
| `lib/register-content.ts` | Form legal/health copy | Registration form document | Register fetch fails or field empty | Yes | No |
| `lib/teacher-story.ts` | Teacher story | About → About the Teacher | Story fields empty | Yes | No |
| `lib/legal-content.json` | Legal bodies | Legal page documents | Legal fetch fails | Yes | No |
| `HeroHighlights` `DEFAULT_*` | Home highlights | Home → Highlights | Nested field empty | Yes | Later |
| `FreeOfferingsSection` `DEFAULT_*` | Free offerings | Programs page → Free Offerings | Nested field empty | Yes | Later |
| `PrivateSessionsSection` `DEFAULT_*` | Private sessions | Home → Private Sessions | Nested field empty | Yes | Later |
| `AboutHighlightCards` `DEFAULT_RIBBON_TITLES` | Ribbon | About → Teacher Highlight Ribbon | Fewer than 3 titles | Yes | Later |
| `PartnerProgramsSection` via placeholders | Partner Programs | Retreats page → Partner Programs | Nested field empty | Yes | Later |
| Page `?? "…"` strings | Hero/section labels | Matching page fields | Field empty | Yes | Later |

---

## SEO check (Phase-1 fallbacks preserved)

CMS `seo.title` and `seo.description` now match Phase-1 intent on:

| Page | CMS SEO title |
|---|---|
| `/` | Classical Hatha Yoga in Albania |
| `/programs` | Classical Hatha Yoga Programs in Albania |
| `/retreats` | Classical Hatha Yoga Retreats in Albania |
| `/events` | Classical Hatha Yoga Events in Albania |
| `/about` | Classical Hatha Yoga Teacher in Albania |
| `/contact` | Register for Classical Hatha Yoga in Albania |
| Every `/programs/[slug]` | Matching Phase-1 program title |
| Legal pages | Cookie Policy / Privacy Policy / Terms of Service |
| Site Settings default | Nava Hatha Yoga · Classical Hatha Yoga |

`/register` remains noindex in code. Legal descriptions use the existing site description (not new SEO copy).

---

## Page-by-page 1:1 verification

Focus: meaningful editorial content. Match? = CMS current value equals website current value. Fallback used? = **NO** in normal production now (CMS is populated).

### `/`

| Visible website content | CMS location | CMS field | CMS current value | Match? | Fallback used? |
|---|---|---|---|---|---|
| Hero headline | Home | `hero.headline` | Nava Classical Hatha Yoga | YES | NO |
| Hero supporting text | Home | `hero.supportingText` | Hatha Yoga is not body-bending business… | YES | NO |
| View Upcoming Events / Explore Programs | Home | `hero.primaryCta` / `secondaryCta` | same labels + hrefs | YES | NO |
| Highlight 1–3 + quote | Home | `highlights` | Ancient yogic tools… / In balance. Life unfolds. | YES | NO |
| The Practice / What is Classical Hatha Yoga? | Home | `intro.eyebrow` / `heading` / `body` / `videoTitle` | populated | YES | NO |
| Programs / Practices offered… / View all programs | Home | `featuredProgramsSection` | populated | YES | NO |
| Events / Upcoming events / See all… | Home | `upcomingEventsSection` | populated | YES | NO |
| Private & Corporate Sessions + 3 types | Home | `privateCorporate` | populated | YES | NO |
| Begin your practice | Home | `finalCta` | populated | YES | NO |
| SEO title/description | Home | `seo` | Classical Hatha Yoga in Albania | YES | NO |

### `/programs`

| Visible website content | CMS location | CMS field | CMS current value | Match? | Fallback used? |
|---|---|---|---|---|---|
| Programs & Offerings | Programs page | `heroEyebrow` | Programs & Offerings | YES | NO |
| Classical Hatha Yoga programs | Programs page | `heroTitle` | Classical Hatha Yoga programs | YES | NO |
| Core programs form the foundation… | Programs page | `heroDescription` | populated | YES | NO |
| Main programs | Programs page | `mainProgramsHeading` | Main programs | YES | NO |
| Special programs + lead | Programs page | `specialProgramsHeading` / `Lead` | populated | YES | NO |
| Free offerings (2 cards) | Programs page | `freeOfferings` | populated | YES | NO |
| Private & Corporate Sessions | **Home** | `privateCorporate` | same block as Home | YES | NO |
| SEO | Programs page | `seo` | Classical Hatha Yoga Programs in Albania | YES | NO |

### `/programs/[slug]` (all 13)

| Visible website content | CMS location | CMS field | Match? | Fallback used? |
|---|---|---|---|---|
| Title, short intro, context line | Program | `title`, `shortIntro`, `contextLine` | YES | NO |
| What is / About / Benefits | Program | `whatIs`, `aboutThePractice`, `benefits` | YES | NO |
| Before the Program / Pre-Requisite | Program | `beforeProgramTitle` + notes (or Site Settings default) | YES | NO |
| After the Program body | Program | `practiceIndependently` | YES | NO |
| Bonus / discount / medical notice | Site Settings | Program-wide Content | YES | NO |
| Intensity (core only) | Program | `intensity` | YES | NO |
| Video label (where video exists) | Program | `videoTitle` | YES | NO |
| Sidebar sessions copy | Program | `privateAndGroupSessions` | YES | NO |
| Related links | Program | `relatedPrograms` | YES | NO |
| SEO title/description | Program | `seo` | YES | NO |

### `/retreats`

| Visible website content | CMS location | CMS field | CMS current value | Match? | Fallback used? |
|---|---|---|---|---|---|
| Retreats & Partner Programs | Retreats page | `heroEyebrow` | Retreats & Partner Programs | YES | NO |
| Classical Hatha Yoga retreats | Retreats page | `heroTitle` | Classical Hatha Yoga retreats | YES | NO |
| Hero description | Retreats page | `heroDescription` | populated | YES | NO |
| Coming Soon / Retreats are on their way | Retreats page | `comingSoonEyebrow` / `Heading` / `Body` | populated | YES | NO |
| What to expect / An invitation to go deeper | Retreats page | `expectationsEyebrow` / `Heading` / cards | populated | YES | NO |
| Partner Programs (full section) | Retreats page | `partnerPrograms` | populated | YES | NO |
| SEO | Retreats page | `seo` | Classical Hatha Yoga Retreats in Albania | YES | NO |

### `/events`

| Visible website content | CMS location | CMS field | Match? | Fallback used? |
|---|---|---|---|---|
| Events / Upcoming events / hero description | Events page | `heroEyebrow` / `heroTitle` / `heroDescription` | YES | NO |
| Empty state (when no upcoming events) | Events page | `emptyTitle` / `emptyDescription` | YES | NO |
| Have a question about an event? | Events page | `contactHeading` / `contactDescription` | YES | NO |
| SEO | Events page | `seo` | YES | NO |
| Event cards | Event documents | title, dates, location, price, notes | YES | NO |

### `/events/archive` and `/retreats/archive`

Archive hero and empty copy now exist on Events page / Retreats page. Match: YES. Fallback used: NO.

### `/about`

| Visible website content | CMS location | CMS field | Match? | Fallback used? |
|---|---|---|---|---|
| About / page title / introduction | About | `heroEyebrow` / `title` / `heroDescription` | YES | NO |
| About the Teacher | About | `teacherSectionTitle` | YES | NO |
| My name is Linda. / teaser / full story | About | `teacherStory` | YES | NO |
| Ribbon titles | About | `highlightCards[].title` | YES | NO |
| Isha / Sadhguru sections | About | `sections` | YES | NO |
| Explore the practices | About | `finalCta` | YES | NO |
| SEO | About | `seo` | YES | NO |

### `/contact`

| Visible website content | CMS location | CMS field | Match? | Fallback used? |
|---|---|---|---|---|
| Contact / Get in touch / intro | Contact | `heroEyebrow` / `heroTitle` / `heroDescription` | YES | NO |
| Send a message | Contact | `formHeading` | YES | NO |
| Prefer WhatsApp?… | Contact | `quickMessageBody` | YES | NO |
| Teaching locations | Contact | `teachingLocations` | YES | NO |
| Email / phone / WhatsApp / Instagram | Site Settings | contact + social | YES | NO |
| SEO | Contact | `seo` | YES | NO |

### `/register`

| Visible website content | CMS location | CMS field | Match? | Fallback used? |
|---|---|---|---|---|
| Registration / Program registration / intro | Registration form | `heroEyebrow` / `heroTitle` / `heroDescription` | YES | NO |
| Health, disclaimer, agreement, guidelines | Registration form | corresponding fields | YES | NO |

---

## Editor mental model (after this pass)

If you see text on the website:

1. Open the matching page document in Studio (Home, Programs, Retreats, Events, About, Contact).
2. The field label should name that text.
3. The field should already contain the live wording.
4. Fields follow website order as far as the current Studio structure allows.

Exceptions to remember:

- Private Sessions is edited on **Home**, not under Programs.
- Bonus / medical / default before-program notes are in **Site Settings → Program-wide Content**.
- Studio program list order now matches the live `/programs` order (`orderRank` aligned 16 August 2026).

---

## What was not done

- No deploy
- `orderRank` later aligned to Studio prominence (see addendum)
- No design / CSS / URL / SEO-copy / structured-data / sitemap changes
- Fallbacks were **not** deleted
- Hidden historical fields were **not** deleted
- Private Sessions was **not** migrated off Home

---

## Addendum — program orderRank alignment (16 August 2026)

Live `/programs` `orderRank` was updated to match Studio prominence. Specials were already in this order; core programs were reordered. Studio navigation was not changed.

| Program | Old orderRank | New orderRank |
|---|---:|---:|
| Surya Kriya | 10 | 10 |
| Angamardana | 40 | 20 |
| Yogasanas | 30 | 30 |
| Upa Yoga | 5 | 40 |
| Bhuta Shuddhi | 50 | 50 |
| Surya Shakti | 20 | 55 |
| Children's Program | 55 | 58 |
| Bhastrika Kriya | 60 | 60 |
| Jala Neti | 70 | 70 |
| Thoppukarnam | 80 | 80 |
| Shanmukhi Mudra | 90 | 90 |
| Eye Care Practices | 100 | 100 |
| Pavanamuktasana | 110 | 110 |

Website and Studio order are now:

1. Surya Kriya  
2. Angamardana  
3. Yogasanas  
4. Upa Yoga  
5. Bhuta Shuddhi  
6. Surya Shakti  
7. Children's Program  
8. Bhastrika Kriya  
9. Jala Neti  
10. Thoppukarnam  
11. Shanmukhi Mudra  
12. Eye Care Practices  
13. Pavanamuktasana  

Not deployed.
