# SEO Phase 1 Implementation Plan — Nava Hatha Yoga

**Date:** 11 August 2026  
**Status:** Plan only — do not implement yet  
**Supersedes for Phase 1:** city landers, informational guides, special-program SEO pushes, and `/contact` as an organic priority (see decisions below)

**Companion strategy:** `KEYWORD-ARCHITECTURE.md`, `PAGE-KEYWORD-MAP.md`, `TOPIC-CLUSTERS.md`, `CONTENT-GAPS.md`

---

## 0. Phase 1 decisions (refinements)

| Decision | Implication for Phase 1 |
|----------|-------------------------|
| No new pages | Work only on the nine URLs below |
| No city landing pages | Do not build Prishtina, Corfu, Korçë, Gjirokastër, Tirana, or Saranda URLs yet. Saranda remains the strongest **future** candidate only when there is a real teaching/event/retreat proposition |
| No informational guides | No `/guides/*` in Phase 1 |
| Keywords are **semantic targets** | Titles/H1s/copy use natural language; exact-match strings are not required |
| No keyword stuffing | Prefer clarity and positioning over density |
| Preserve Classical Hatha positioning | Authentic, traditional, certified teacher, taught as intended, inner transformation |
| Never optimize toward | Gym / power / hot / weight-loss yoga, workouts, Pilates, stretching, teacher training, meditation apps |
| Special programs | Leave SEO light until Search Console / research shows demand |
| `/contact` | Conversion utility, not a Phase 1 organic SEO landing page |
| Keep architecture rules | One primary topic per page; no cannibalization of another page’s primary topic |

### Phase 1 URL set (only)

1. `/`  
2. `/programs`  
3. `/programs/surya-kriya`  
4. `/programs/angamardana`  
5. `/programs/yogasanas`  
6. `/programs/upa-yoga`  
7. `/programs/bhuta-shuddhi`  
8. `/retreats`  
9. `/about`

---

## 1. Impact ranking (do highest first)

Expected SEO + registration impact for Phase 1 work:

| Rank | Page | Why |
|------|------|-----|
| 1 | `/` | Category hub; widest query surface; feeds all programs |
| 2 | `/programs/surya-kriya` | Highest-priority practice commercial page |
| 3 | `/programs/angamardana` | Strong commercial practice page |
| 4 | `/programs/yogasanas` | Core classical practice; defends against “class/stretch” misread via copy tone, not new pages |
| 5 | `/programs` | Catalog + internal-link hub |
| 6 | `/programs/upa-yoga` | Beginner entry → registrations |
| 7 | `/programs/bhuta-shuddhi` | Transformation-intent practice |
| 8 | `/retreats` | Owns retreat topic; product still thin — metadata + clarity first |
| 9 | `/about` | Trust / teacher topic; supports conversion, lower direct commercial volume |

Within each page, prefer this order of work:

1. Title + meta description (CMS `seo` fields where possible)  
2. H1 / hero title alignment (natural language)  
3. Internal links + anchor text  
4. Light on-page copy improvements / FAQ  
5. Code fallbacks only where CMS cannot express the change  

---

## 2. Ownership legend

| Label | Meaning |
|-------|---------|
| **Sanity CMS** | Edit live documents in Studio (`seo`, hero, body fields) |
| **Code** | Change Next.js fallbacks, hardcoded strings, link structure, FAQ UI if none exists |
| **Both** | CMS for live content + code so placeholders/fallbacks stay aligned |

---

## 3. Page plans

### 3.1 `/` — Home

| Field | Value |
|-------|-------|
| **Primary search topic** | Classical Hatha Yoga in Albania (semantic; Saranda as supporting place signal, not a separate page yet) |
| **Secondary search topics** | authentic Classical Hatha Yoga; traditional practices; programs in Saranda; inner transformation; in-person Classical Hatha |

| | Current | Proposed |
|--|---------|----------|
| **Title** | Absolute pattern: `Classical Hatha Yoga in Saranda, Albania · Nava Hatha Yoga` (CMS `homePage.seo.title` can override) | `Classical Hatha Yoga in Albania · Nava Hatha Yoga` — natural, national topic; Saranda remains in description/body |
| **Meta description** | Falls back to hero supporting quote or site description about Classical Hatha Yoga in Saranda | `Authentic Classical Hatha Yoga in Albania — traditional practices taught as intended in Saranda, for clarity, balance, and inner transformation.` |
| **H1** | `Nava Classical Hatha Yoga` (hero headline) | **Keep** `Nava Classical Hatha Yoga` (brand-first hero; do not force “Albania” into H1) |

**Existing content that should remain**
- Brand H1 and supporting Sadhguru quote  
- Intro “What is Classical Hatha Yoga?” block + video  
- Featured programs, upcoming events, private sessions, final contact CTA  
- Positioning around traditional form / inner stability  

**Content that should be improved**
- Intro body: one clear sentence that practices are offered in Albania, based in Saranda, taught in traditional form (human tone)  
- Featured section description: tie programs to registration, not generic “offerings” filler  
- Ensure hero CTAs prioritize programs + events (conversion)  

**Missing content**
- Short FAQ block (see below) — only if added without cluttering the first viewport  
- Explicit internal links from intro to the five core program pages (not only featured cards)  

**Suggested FAQ questions**
1. What is Classical Hatha Yoga?  
2. Is this the same as gym or power yoga?  
3. Where are classes held?  
4. Which practice should I start with?  
5. How do I register for a program?  

**Internal links to add**
- Intro or FAQ → `/programs/surya-kriya`, `/programs/angamardana`, `/programs/yogasanas`, `/programs/upa-yoga`, `/programs/bhuta-shuddhi`  
- Intro → `/about` (teacher / authenticity)  
- Featured/closing → `/programs`, `/retreats` (light)  

**Recommended anchor text**
- `Surya Kriya` → `/programs/surya-kriya`  
- `Angamardana` → `/programs/angamardana`  
- `Yogasanas` → `/programs/yogasanas`  
- `Upa Yoga` → `/programs/upa-yoga`  
- `Bhuta Shuddhi` → `/programs/bhuta-shuddhi`  
- `Classical Hatha Yoga programs` → `/programs`  
- `About the teacher` → `/about`  

**Conversion CTA**
- Primary: explore programs / view upcoming events  
- Secondary: contact / register interest  

**Cannibalization considerations**
- Home owns the **Albania Classical Hatha** topic; do not title it only as a single practice  
- Do not create a competing “Classical Hatha Yoga Saranda” page in Phase 1; keep Saranda as place context  
- Do not use `/about` wording that steals the Albania category topic  

**Exact fields / files**

| Change | Where | Ownership |
|--------|-------|-----------|
| SEO title | Sanity `homePage.seo.title` | **Sanity CMS** |
| SEO description | Sanity `homePage.seo.description` | **Sanity CMS** |
| Absolute-title fallback logic | `app/(site)/page.tsx` `generateMetadata` | **Code** (align fallback with proposed title if CMS empty) |
| Placeholder SEO/copy | `lib/placeholders.ts`, `scripts/generate-seed.mjs` | **Code** |
| Intro body / FAQ | `homePage.intro`, new FAQ only if schema/UI added | **Sanity CMS** and possibly **Code** if FAQ component needed |
| Internal links in intro | `homePage.intro.body` portable text | **Sanity CMS** |

**Impact rank:** #1

---

### 3.2 `/programs`

| Field | Value |
|-------|-------|
| **Primary search topic** | Classical Hatha Yoga programs in Albania |
| **Secondary search topics** | traditional Hatha practices; main programs; how to choose a practice; private sessions |

| | Current | Proposed |
|--|---------|----------|
| **Title** | `Programs & Offerings · Nava Hatha Yoga` | `Classical Hatha Yoga Programs in Albania · Nava Hatha Yoga` |
| **Meta description** | `Explore the Classical Hatha Yoga programs and offerings at Nava Hatha Yoga, each taught in its original, traditional form.` | `Explore Classical Hatha Yoga programs in Albania — traditional practices taught as intended, from Upa Yoga and Surya Kriya to Yogasanas, Angamardana, and Bhuta Shuddhi.` |
| **H1** | `Classical Hatha Yoga practices` | `Classical Hatha Yoga programs` (or keep close variant: `Classical Hatha Yoga practices` if brand prefers “practices”; either is fine if title carries “programs in Albania”) |

**Existing content that should remain**
- Split of main vs special programs  
- Program cards with short intros  
- Free offerings + private sessions sections  

**Content that should be improved**
- Hero description: state Albania + traditional form + registration path in 1–2 natural sentences  
- Special programs: keep visible but do not SEO-expand in Phase 1  
- Clarify beginner path toward Upa Yoga in hero or short lead line  

**Missing content**
- Optional short “How to choose” blurb linking to five core programs  
- FAQ (short)  

**Suggested FAQ questions**
1. Which Classical Hatha program should I begin with?  
2. Are these fitness or workout classes?  
3. Are programs taught in their original form?  
4. How do private sessions work?  

**Internal links to add**
- Hero/lead → five core program URLs  
- Lead → `/about`  
- Private sessions CTA already → `/contact` (keep; conversion, not SEO focus)  

**Recommended anchor text**
- `Learn Surya Kriya` → `/programs/surya-kriya`  
- `Angamardana` → `/programs/angamardana`  
- `Yogasanas` → `/programs/yogasanas`  
- `Start with Upa Yoga` → `/programs/upa-yoga`  
- `Bhuta Shuddhi` → `/programs/bhuta-shuddhi`  
- `Meet the teacher` → `/about`  

**Conversion CTA**
- Card → program page → Register interest / upcoming events  
- Private session → `/contact`  

**Cannibalization considerations**
- Must stay **programs catalog** topic; do not use the same title pattern as Home’s Albania category title without the “programs” qualifier  
- Do not give special programs equal SEO emphasis in Phase 1  

**Exact fields / files**

| Change | Where | Ownership |
|--------|-------|-----------|
| SEO title / description | `programsPage.seo` | **Sanity CMS** |
| Hero title / description | `programsPage.heroTitle`, `heroDescription` | **Sanity CMS** |
| Code fallbacks | `app/(site)/programs/page.tsx`, `lib/placeholders.ts` | **Code** |

**Impact rank:** #5

---

### 3.3 `/programs/surya-kriya`

| Field | Value |
|-------|-------|
| **Primary search topic** | Surya Kriya in Albania |
| **Secondary search topics** | learn Surya Kriya; Surya Kriya in Saranda; classical solar practice; traditional yogic process |

| | Current | Proposed |
|--|---------|----------|
| **Title** | `Surya Kriya · Nava Hatha Yoga` | `Learn Surya Kriya in Albania · Nava Hatha Yoga` |
| **Meta description** | Program `shortIntro` (etymology of Surya/kriya…) | `Learn Surya Kriya in Albania — a classical inner energy process taught in its traditional form, for balance, clarity, and inner stability.` |
| **H1** | `Surya Kriya` | **Keep practice name as H1:** `Surya Kriya` — put place/intent in title + intro sentence, not a stuffed H1 |

**Existing content that should remain**
- What is / About the Practice / Benefits / Before / After / Medical notice  
- Sidebar events + register interest  
- Practice integrity and traditional framing  

**Content that should be improved**
- Opening `shortIntro` or first “What is” paragraph: natural line that this is offered in Albania (Saranda base) and taught as intended  
- Soft differentiation from Surya Shakti **without** a new guide page — one careful sentence max  
- CTA labels clarity  

**Missing content**
- FAQ on the program page  
- Link to `/about` for teacher trust  

**Suggested FAQ questions**
1. What is Surya Kriya?  
2. How is Surya Kriya different from a sun salutation workout?  
3. Can I learn Surya Kriya in Albania?  
4. How do I register?  

**Internal links to add**
- Body/FAQ → `/programs`, `/about`, `/programs/upa-yoga` (possible preparation/entry), `/retreats` (light)  
- Keep `/events` and `/contact` CTAs  

**Recommended anchor text**
- `All Classical Hatha Yoga programs` → `/programs`  
- `About the teacher` → `/about`  
- `Upa Yoga` → `/programs/upa-yoga`  
- `Classical Hatha Yoga retreats` → `/retreats`  

**Conversion CTA**
- Register interest → `/contact`  
- View upcoming events → `/events`  

**Cannibalization considerations**
- Do not title this page as generic Classical Hatha Yoga Albania  
- Keep Surya Shakti on its own URL; avoid “Surya Albania” ambiguity in titles  

**Exact fields / files**

| Change | Where | Ownership |
|--------|-------|-----------|
| SEO title / description | Sanity program `surya-kriya` → `seo.title`, `seo.description` | **Sanity CMS** |
| shortIntro / whatIs / about | same program document | **Sanity CMS** |
| H1 | `program.title` (keep `Surya Kriya`) | **Sanity CMS** (do not rename practice) |
| FAQ UI | `app/(site)/programs/[slug]/page.tsx` + possible schema | **Both** if FAQ is new pattern |
| Fallbacks | `lib/placeholders.ts` | **Code** |

**Impact rank:** #2

---

### 3.4 `/programs/angamardana`

| Field | Value |
|-------|-------|
| **Primary search topic** | Angamardana in Albania |
| **Secondary search topics** | learn Angamardana; body mastery through yoga; prepare for Classical Hatha; Angamardana in Saranda |

| | Current | Proposed |
|--|---------|----------|
| **Title** | `Angamardana · Nava Hatha Yoga` | `Learn Angamardana in Albania · Nava Hatha Yoga` |
| **Meta description** | Etymology-focused `shortIntro` | `Learn Angamardana in Albania — a classical yogic system for mastery over the body, taught in its traditional form to build strength, vitality, and readiness for Hatha Yoga.` |
| **H1** | `Angamardana` | **Keep** `Angamardana` |

**Existing content that should remain**
- Full practice sections, benefits, before-notes (including health cautions), CTAs  

**Content that should be improved**
- Reframe any fitness-sounding lines toward **yogic mastery / preparation for Hatha**, not workout or weight-loss marketing (benefits list in CMS may mention weight-loss — de-emphasize or rephrase in Phase 1 copy review)  
- Add Albania/Saranda context naturally in intro  

**Missing content**
- FAQ  
- Link to Yogasanas / Surya Kriya as related classical practices (careful, non-cannibalizing)  

**Suggested FAQ questions**
1. What is Angamardana?  
2. Is Angamardana a gym workout?  
3. Who is it for?  
4. How do I join a program in Albania?  

**Internal links to add**
- `/programs`, `/about`, `/programs/yogasanas`, `/contact` (CTA)  

**Recommended anchor text**
- `Classical Hatha Yoga programs` → `/programs`  
- `Yogasanas` → `/programs/yogasanas`  
- `About the teacher` → `/about`  

**Conversion CTA**
- Register interest / upcoming events  

**Cannibalization considerations**
- Do not position as weight-loss or generic fitness landing  
- Keep primary topic Angamardana, not Classical Hatha Yoga Albania  

**Exact fields / files**

| Change | Where | Ownership |
|--------|-------|-----------|
| `seo`, `shortIntro`, `benefits`, `whatIs`, `aboutThePractice` | Sanity `angamardana` program | **Sanity CMS** |
| Placeholder benefits copy | `lib/placeholders.ts` | **Code** |
| Shared program template FAQ/links | `app/(site)/programs/[slug]/page.tsx` | **Code** |

**Impact rank:** #3

---

### 3.5 `/programs/yogasanas`

| Field | Value |
|-------|-------|
| **Primary search topic** | Yogasanas in Albania |
| **Secondary search topics** | classical Yogasanas; traditional asana practice; Yogasanas in Saranda; posture and inner wellbeing |

| | Current | Proposed |
|--|---------|----------|
| **Title** | `Yogasanas · Nava Hatha Yoga` | `Classical Yogasanas in Albania · Nava Hatha Yoga` |
| **Meta description** | Asana definition `shortIntro` | `Practice classical Yogasanas in Albania — traditional Hatha Yoga postures taught as intended, to transform body and mind toward lasting wellbeing.` |
| **H1** | `Yogasanas` | **Keep** `Yogasanas` (optional natural subtitle in intro, not a second H1) |

**Existing content that should remain**
- Classical definition, benefits, program structure, CTAs  

**Content that should be improved**
- One clear contrast sentence: this is classical Yogasanas / Classical Hatha — not a stretching or workout class (without naming competitor fads excessively)  
- Albania availability in intro  

**Missing content**
- FAQ  
- Link to Upa Yoga for beginners and Angamardana as related  

**Suggested FAQ questions**
1. What are Yogasanas?  
2. How is this different from a typical yoga stretch class?  
3. Can beginners learn Yogasanas in Albania?  
4. How do I register?  

**Internal links to add**
- `/programs/upa-yoga`, `/programs/angamardana`, `/programs`, `/about`  

**Recommended anchor text**
- `Start with Upa Yoga` → `/programs/upa-yoga`  
- `Angamardana` → `/programs/angamardana`  
- `All programs` → `/programs`  

**Conversion CTA**
- Register interest / events  

**Cannibalization considerations**
- Do not absorb the whole Classical Hatha Yoga Albania topic  
- Avoid “yoga classes Albania” as a fake primary; keep Yogasanas-specific  

**Exact fields / files**

| Change | Where | Ownership |
|--------|-------|-----------|
| Program `seo` + body fields | Sanity `yogasanas` | **Sanity CMS** |
| Placeholders | `lib/placeholders.ts` | **Code** |
| Template links/FAQ | `programs/[slug]/page.tsx` | **Code** |

**Impact rank:** #4

---

### 3.6 `/programs/upa-yoga`

| Field | Value |
|-------|-------|
| **Primary search topic** | Upa Yoga in Albania |
| **Secondary search topics** | Upa Yoga for beginners; introductory Classical Hatha; Upa Yoga in Saranda |

| | Current | Proposed |
|--|---------|----------|
| **Title** | `Upa Yoga · Nava Hatha Yoga` | `Learn Upa Yoga in Albania · Nava Hatha Yoga` |
| **Meta description** | Short activation one-liner | `Learn Upa Yoga in Albania — a simple, powerful Classical Hatha practice that activates the joints, muscles, and energy system, taught in its traditional form.` |
| **H1** | `Upa Yoga` | **Keep** `Upa Yoga` |

**Existing content that should remain**
- Practice explanation, benefits, session CTAs  

**Content that should be improved**
- Explicit “good starting practice” framing toward registrations  
- Albania/Saranda context  

**Missing content**
- FAQ  
- “Next practices” links to Surya Kriya / Yogasanas  

**Suggested FAQ questions**
1. What is Upa Yoga?  
2. Is Upa Yoga suitable for beginners?  
3. Where can I learn Upa Yoga in Albania?  
4. What practice might come next?  

**Internal links to add**
- `/programs/surya-kriya`, `/programs/yogasanas`, `/programs`, `/about`  

**Recommended anchor text**
- `Surya Kriya` → `/programs/surya-kriya`  
- `Yogasanas` → `/programs/yogasanas`  
- `Classical Hatha Yoga programs` → `/programs`  

**Conversion CTA**
- Register interest / events  

**Cannibalization considerations**
- Remain the beginner entry page; don’t retitle as generic Classical Hatha Yoga Albania  

**Exact fields / files**

| Change | Where | Ownership |
|--------|-------|-----------|
| Program SEO + copy | Sanity `upa-yoga` | **Sanity CMS** |
| Placeholders / template | `lib/placeholders.ts`, `programs/[slug]/page.tsx` | **Code** |

**Impact rank:** #6

---

### 3.7 `/programs/bhuta-shuddhi`

| Field | Value |
|-------|-------|
| **Primary search topic** | Bhuta Shuddhi in Albania |
| **Secondary search topics** | five-element purification; classical cleansing process; Bhuta Shuddhi in Saranda; inner transformation |

| | Current | Proposed |
|--|---------|----------|
| **Title** | `Bhuta Shuddhi · Nava Hatha Yoga` | `Bhuta Shuddhi in Albania · Nava Hatha Yoga` |
| **Meta description** | Poetic shortIntro only | `Bhuta Shuddhi in Albania — a classical process of elemental purification, taught in its traditional form to support deep inner cleansing and transformation.` |
| **H1** | `Bhuta Shuddhi` | **Keep** `Bhuta Shuddhi` |

**Existing content that should remain**
- Traditional explanation, benefits, CTAs; transformation tone  

**Content that should be improved**
- Ground poetic language with practical “offered in Albania / taught as intended” context  
- Avoid wellness-fad “detox” framing  

**Missing content**
- FAQ  
- Trust link to `/about`  

**Suggested FAQ questions**
1. What is Bhuta Shuddhi?  
2. Is this a modern detox program?  
3. Can I take Bhuta Shuddhi in Albania?  
4. How do I register?  

**Internal links to add**
- `/programs`, `/about`, optionally `/programs/yogasanas` or `/programs/angamardana` as complementary — not substitutes  

**Recommended anchor text**
- `Classical Hatha Yoga programs` → `/programs`  
- `About the teacher` → `/about`  

**Conversion CTA**
- Register interest / events  

**Cannibalization considerations**
- Keep purification/transformation topic on this URL; Home keeps category Albania topic  

**Exact fields / files**

| Change | Where | Ownership |
|--------|-------|-----------|
| Program SEO + copy | Sanity `bhuta-shuddhi` | **Sanity CMS** |
| Placeholders / template | code as above | **Code** |

**Impact rank:** #7

---

### 3.8 `/retreats`

| Field | Value |
|-------|-------|
| **Primary search topic** | Classical Hatha Yoga retreats in Albania |
| **Secondary search topics** | immersive Hatha retreat; retreats in Saranda (supporting only); partner retreat programs |

| | Current | Proposed |
|--|---------|----------|
| **Title** | `Retreats & Partner Programs · Nava Hatha Yoga` | `Classical Hatha Yoga Retreats in Albania · Nava Hatha Yoga` |
| **Meta description** | `Immersive Classical Hatha Yoga retreats and partner programs from Nava Hatha Yoga — coming soon.` | `Classical Hatha Yoga retreats in Albania — immersive traditional practice for deeper transformation. Register your interest; partner collaborations welcome.` |
| **H1** | `Immersive retreats & partner programs` | `Classical Hatha Yoga retreats` (partner programs can stay as H2 / section) |

**Existing content that should remain**
- Coming-soon messaging (honest)  
- What to expect cards  
- Partner programs collaboration block  
- CTAs to contact / programs  

**Content that should be improved**
- Hero copy: Albania + Classical Hatha + transformation; avoid over-promising dated retreat inventory that doesn’t exist  
- Separate participant interest vs partner inquiry more clearly in CTAs if confusing  

**Missing content**
- FAQ  
- Links to five core programs “practices you may encounter”  
- Do **not** invent a Saranda retreat URL until a real offer exists  

**Suggested FAQ questions**
1. Do you offer Classical Hatha Yoga retreats in Albania?  
2. Where would retreats take place?  
3. Can hotels or venues partner with Nava Hatha Yoga?  
4. How do I register interest?  

**Internal links to add**
- `/programs/surya-kriya`, `/programs/angamardana`, `/programs/yogasanas`, `/programs/upa-yoga`, `/programs/bhuta-shuddhi`  
- `/about`, `/programs`  

**Recommended anchor text**
- `Surya Kriya` / other practice names → program URLs  
- `Meet the teacher` → `/about`  
- `View programs` → `/programs`  

**Conversion CTA**
- Register your interest → `/contact`  
- Partner WhatsApp (existing)  

**Cannibalization considerations**
- This page owns **retreats in Albania**  
- Reserve **Yoga Retreat Saranda** for a future real retreat page — mention Saranda only as likely setting/context, not as a fake dedicated lander  
- Do not compete with Home’s category title  

**Exact fields / files**

| Change | Where | Ownership |
|--------|-------|-----------|
| `retreatsPage.seo`, hero fields, coming soon, expectations | Sanity `retreatsPage` | **Sanity CMS** |
| Fallbacks | `app/(site)/retreats/page.tsx`, `lib/placeholders.ts` | **Code** |
| Program links in body | CMS portable/text fields or code section | **Both** |

**Impact rank:** #8

---

### 3.9 `/about`

| Field | Value |
|-------|-------|
| **Primary search topic** | Classical Hatha Yoga teacher in Albania |
| **Secondary search topics** | certified Classical Hatha teacher; teacher in Saranda; traditional teaching lineage; taught with care |

| | Current | Proposed |
|--|---------|----------|
| **Title** | `About · Nava Hatha Yoga` | `Classical Hatha Yoga Teacher in Albania · Nava Hatha Yoga` |
| **Meta description** | `About Nava Hatha Yoga — Classical Hatha Yoga taught in its original form in Saranda, Albania.` | `Meet the Classical Hatha Yoga teacher behind Nava Hatha Yoga in Albania — certified training, traditional practices taught as intended, based in Saranda.` |
| **H1** | `Classical Hatha Yoga, taught with care.` | **Keep** (strong brand/trust H1). Do not replace with keyword-shaped “Teacher in Albania” |

**Existing content that should remain**
- Teacher story, highlight cards, Isha sections, certification narrative  
- Tone of care, authenticity, lineage  

**Content that should be improved**
- Hero description: teacher + Albania/Saranda + “taught as intended” in natural prose  
- Add internal CTAs (currently mostly external Isha links)  

**Missing content**
- On-page links to `/programs` and core practices  
- FAQ for trust objections  
- Clear conversion CTA to contact / programs  

**Suggested FAQ questions**
1. Who teaches at Nava Hatha Yoga?  
2. What training and certification does the teacher have?  
3. Are programs taught in their original traditional form?  
4. Where is teaching based?  

**Internal links to add**
- `/programs`, five core program pages, `/retreats`, `/` (sparingly)  
- CTA → `/contact` for registration conversations  

**Recommended anchor text**
- `Classical Hatha Yoga programs` → `/programs`  
- `Surya Kriya` → `/programs/surya-kriya`  
- `Register your interest` → `/contact`  
- `Retreats` → `/retreats`  

**Conversion CTA**
- Explore programs / Register interest  

**Cannibalization considerations**
- About owns **teacher/trust** topic  
- Do not set SEO title to the same Albania category title as Home  
- Training/lineage content must not become a “yoga teacher training Albania” acquisition page  

**Exact fields / files**

| Change | Where | Ownership |
|--------|-------|-----------|
| `aboutPage.seo`, `title`, `heroDescription`, sections | Sanity `aboutPage` | **Sanity CMS** |
| H1 force logic / constant | `ABOUT_PAGE_HERO_TITLE` + `about/page.tsx` | **Code** (keep current H1 behavior) |
| Internal CTA buttons | about page sections or new CTA field | **Both** |
| Placeholders | `lib/placeholders.ts` | **Code** |

**Impact rank:** #9

---

## 4. Cross-page Phase 1 checklist

### Do in Phase 1
- [ ] Set CMS `seo.title` / `seo.description` on all nine pages  
- [ ] Align code fallbacks so empty CMS doesn’t revert to weak titles  
- [ ] Keep practice **H1 = practice name** on program pages  
- [ ] Add natural Albania (and Saranda-as-base) context in intros  
- [ ] Add internal links with descriptive anchors between Home, Programs, five programs, Retreats, About  
- [ ] Soft FAQ where it fits without hurting design  
- [ ] Review Angamardana benefits language for anti-workout positioning  

### Do not in Phase 1
- [ ] New city pages (including Saranda)  
- [ ] New `/guides/*` pages  
- [ ] Special-program SEO campaigns  
- [ ] Treating `/contact` as a ranking project  
- [ ] Exact-match H1 stuffing (`Surya Kriya Albania` as H1, etc.)  
- [ ] Teacher-training or gym-yoga content angles  

---

## 5. Suggested implementation sequence (when approved)

1. **CMS metadata pass** (all 9) — fastest SERP impact  
2. **Code fallback alignment** — `page.tsx` files + placeholders  
3. **Shared program template** — optional FAQ + related links component (code) fed by CMS where possible  
4. **Copy pass** — intros/benefits tone on five programs + home intro + retreats hero + about hero  
5. **Internal linking pass** — portable text + any hardcoded nav CTAs on about/retreats  
6. **QA** — unique titles, no two pages sharing primary topic, positioning check, mobile hero unchanged  

---

## 6. Primary topic registry (Phase 1 lock)

| URL | Primary search topic (semantic) | Example natural title |
|-----|----------------------------------|------------------------|
| `/` | Classical Hatha Yoga in Albania | Classical Hatha Yoga in Albania · Nava Hatha Yoga |
| `/programs` | Classical Hatha Yoga programs in Albania | Classical Hatha Yoga Programs in Albania · … |
| `/programs/surya-kriya` | Surya Kriya in Albania | Learn Surya Kriya in Albania · … |
| `/programs/angamardana` | Angamardana in Albania | Learn Angamardana in Albania · … |
| `/programs/yogasanas` | Yogasanas in Albania | Classical Yogasanas in Albania · … |
| `/programs/upa-yoga` | Upa Yoga in Albania | Learn Upa Yoga in Albania · … |
| `/programs/bhuta-shuddhi` | Bhuta Shuddhi in Albania | Bhuta Shuddhi in Albania · … |
| `/retreats` | Classical Hatha Yoga retreats in Albania | Classical Hatha Yoga Retreats in Albania · … |
| `/about` | Classical Hatha Yoga teacher in Albania | Classical Hatha Yoga Teacher in Albania · … |

No two rows share the same primary topic.

---

## 7. CMS vs code summary

| Work type | Mostly |
|-----------|--------|
| Titles & meta descriptions | **Sanity CMS** (`seo` on each document) |
| H1 / hero titles | **Sanity CMS** (home headline, programs/retreats/about heroes; program `title` unchanged) |
| Intro & benefits copy | **Sanity CMS** |
| Fallback strings if CMS empty | **Code** |
| New FAQ UI / about internal CTAs / related-program link block | **Both** (schema + components) |
| Absolute home title logic | **Code** (`app/(site)/page.tsx`) |

---

**End of Phase 1 plan.**  
Await approval before any CMS edits or code changes.
