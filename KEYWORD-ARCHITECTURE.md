# Keyword Architecture — Nava Hatha Yoga

**Date:** 10 August 2026  
**Scope:** Search strategy only — no code, metadata, or page rewrites in this deliverable  
**Site:** https://navahathayoga.com  
**Foundation:** Technical SEO already implemented; this document defines how future content and metadata should target demand  

---

## 1. Strategic summary

Nava Hatha Yoga should rank for people who want **authentic Classical Hatha Yoga** taught in its traditional form — not gym fitness yoga. The architecture is built to convert that demand into **program registrations**, with Saranda as the teaching base and Albania + neighboring markets (Kosovo, North Macedonia, Greece) as the travel catchment.

### Primary business goal

Increase registrations for yoga programs (especially Surya Kriya, Angamardana, Yogasanas, Upa Yoga, Bhuta Shuddhi).

### Audience priority (highest → lower)

1. People searching for authentic Classical Hatha Yoga  
2. People seeking inner transformation  
3. People across Albania  
4. People from Kosovo, North Macedonia, and Greece willing to travel  

### Positioning filters (always on)

| Emphasize | Never chase |
|-----------|-------------|
| Authentic Classical Hatha Yoga | Gym yoga |
| Traditional practices | Power yoga / hot yoga |
| Certified teacher | Yoga workouts / weight-loss yoga |
| Programs taught exactly as intended | Pilates / stretching classes |
| Inner transformation | Yoga teacher training |
| In-person practice | Meditation apps |

### Geographic priority cities

1. Saranda  
2. Tirana  
3. Prishtina  
4. Corfu  
5. Korçë  
6. Gjirokastër  

---

## 2. Keyword hierarchy (top → bottom)

Use this pyramid when choosing a primary keyword for any page. Higher levels win conflicts.

```
L1  Brand / category hubs
    Classical Hatha Yoga Albania
    Classical Hatha Yoga Saranda
    Hatha Yoga Retreat Albania

L2  Core practice hubs (program money pages)
    Surya Kriya Albania
    Angamardana Albania
    Yogasanas Albania
    Upa Yoga Albania
    Bhuta Shuddhi Albania

L3  Supporting practices & conversion
    Other program × Albania terms
    Events / schedule terms
    Teacher / about terms
    Contact / registration terms

L4  Local city landers
    Classical Hatha Yoga + {city}
    {Program} + {city}  (only when demand justifies)

L5  Informational / intent education
    What is Classical Hatha Yoga
    What is Surya Kriya
    Classical Hatha Yoga vs modern yoga
    Inner transformation through Hatha Yoga
```

**Rule:** Every indexable page gets **exactly one** primary keyword. That keyword is never reused as another page’s primary.

---

## 3. Intent model

| Intent | User wants | Funnel | Typical page type |
|--------|------------|--------|-------------------|
| **Know** | Definition, lineage, difference from gym yoga | TOFU | Guides, “what is…”, comparison |
| **Know-local** | Whether authentic practice exists near them | TOFU→MOFU | City landers, Albania overview |
| **Do-evaluate** | Choose a practice / compare programs | MOFU | Program listing, program detail |
| **Do-register** | Book / inquire / travel logistics | BOFU | Contact, events, retreat commercial pages |
| **Do-visit** | Dates, location, how to join a session | BOFU | Events, retreat details, city landers with CTA |

### Intent → conversion path

```
Know (Classical Hatha Yoga)
  → Know-local (Albania / Saranda / Tirana / Prishtina / Corfu…)
    → Do-evaluate (Programs / Surya Kriya / Angamardana…)
      → Do-visit (Events / Retreat)
        → Do-register (Contact / Register flow)
```

---

## 4. Core keyword inventory

### 4.1 Highest-priority commercial terms (owned by existing or planned hubs)

| Primary keyword | Intent | Owner page (current or planned) | Priority |
|-----------------|--------|----------------------------------|----------|
| Classical Hatha Yoga Albania | Do-evaluate / Know-local | `/` (home) | P0 |
| Classical Hatha Yoga Saranda | Know-local / Do-register | Planned: `/locations/saranda` | P0 |
| Surya Kriya Albania | Do-evaluate | `/programs/surya-kriya` | P0 |
| Hatha Yoga Retreat Albania | Do-evaluate | `/retreats` | P0 |
| Yogasanas Albania | Do-evaluate | `/programs/yogasanas` | P0 |
| Angamardana Albania | Do-evaluate | `/programs/angamardana` | P0 |
| Upa Yoga Albania | Do-evaluate | `/programs/upa-yoga` | P0 |
| Bhuta Shuddhi Albania | Do-evaluate | `/programs/bhuta-shuddhi` | P0 |
| Yoga Retreat Saranda | Do-visit / Do-register | Planned: retreat detail or `/retreats/saranda` | P0 |

### 4.2 Brand & category secondary set (never primary on multiple pages)

Use as secondaries / semantics under the correct hub:

- Authentic Classical Hatha Yoga  
- Traditional Hatha Yoga Albania  
- Classical Hatha Yoga teacher Albania  
- Classical Hatha Yoga programs Albania  
- Inner transformation yoga Albania  
- Isha Hatha Yoga tradition (careful: educational/lineage, not brand hijack)  
- In-person Hatha Yoga Saranda  

### 4.3 Local modifiers (attach to hubs, don’t create thin pages without demand)

| City | Preferred local primary (planned landers) | Secondary modifiers |
|------|-------------------------------------------|---------------------|
| Saranda | Classical Hatha Yoga Saranda | yoga classes Saranda, Hatha Yoga Saranda Albania |
| Tirana | Classical Hatha Yoga Tirana | Hatha Yoga Tirana, Classical Hatha Yoga Tiranë |
| Prishtina | Classical Hatha Yoga Prishtina | Hatha Yoga Kosovo, Classical Hatha Yoga Pristina |
| Corfu | Classical Hatha Yoga Corfu | Hatha Yoga Corfu Greece, yoga retreat Corfu Classical Hatha |
| Korçë | Classical Hatha Yoga Korçë | Hatha Yoga Korca |
| Gjirokastër | Classical Hatha Yoga Gjirokastër | Hatha Yoga Gjirokaster |

### 4.4 Program secondary / semantic banks

Each program page should draw from its bank — not from another program’s primary.

**Surya Kriya:** solar practice, 21-step Surya Kriya, Surya Kriya Saranda, Surya Kriya Tirana, classical sun practice, balance of energies  

**Angamardana:** body mastery yoga, 31 processes Angamardana, Angamardana Saranda, prepare for Hatha Yoga, classical fitness system yoga  

**Yogasanas:** classical yogasanas, traditional asana practice Albania, Yogasanas Saranda, Hatha Yoga postures classical  

**Upa Yoga:** Upa Yoga for beginners, activate joints and energy, Upa Yoga Saranda, introductory Classical Hatha  

**Bhuta Shuddhi:** five elements purification, Bhuta Shuddhi process, elemental cleansing yoga Albania  

**Surya Shakti:** Surya Shakti Albania, dynamic sun salutation classical, Surya Shakti vs Surya Kriya (informational only)  

**Special practices:** own `{Practice} Albania` as primary; keep “Classical Hatha Yoga” as semantic support only  

### 4.5 Explicitly deprioritized / negative keywords

Do not create pages, titles, or blogs for:

- power yoga, hot yoga, Bikram  
- yoga workout, yoga for weight loss, HIIT yoga  
- pilates, stretching class, flexibility class  
- yoga teacher training / YTT / RYT  
- meditation app, Headspace-style queries  
- gym yoga near me (unless refining to Classical Hatha)  

If such queries appear in Search Console, capture with a **clarifying FAQ** on an existing Classical Hatha page — do not build dedicated landing pages.

---

## 5. Cannibalization rules

1. **One primary keyword → one URL.** Forever.  
2. **Program name + Albania** belongs to that program detail URL, not the listing.  
3. **Classical Hatha Yoga Albania** belongs to home; listing uses **Classical Hatha Yoga programs Albania**.  
4. **Classical Hatha Yoga Saranda** does **not** stay as home’s long-term primary once a Saranda location page exists. Until then, Saranda is a *secondary* on home — not a second primary.  
5. **Retreat listing** owns **Hatha Yoga Retreat Albania**; a Saranda retreat experience owns **Yoga Retreat Saranda**.  
6. Informational “What is {Practice}” pages must not use `{Practice} Albania` as primary — that stays on the commercial program page.  
7. Events pages target schedule/intent terms, never program primaries.  
8. About page targets teacher/trust terms, never “Classical Hatha Yoga Albania”.  
9. Legal pages have no commercial primary competition — brand + policy only.  

---

## 6. Priority scoring model

Use on every page map entry:

| Score | Meaning |
|-------|---------|
| **P0** | Direct registration driver; highest-priority terms; build/optimize first |
| **P1** | Strong support for P0 (trust, schedule, secondary programs) |
| **P2** | Useful coverage; special practices, archive, secondary cities |
| **P3** | Required for completeness (legal, thin utility); minimal keyword investment |

Factors: commercial value × audience fit × uniqueness × travel willingness × current page strength.

---

## 7. Existing site coverage vs hierarchy

| Hierarchy level | Coverage today | Gap severity |
|-----------------|----------------|--------------|
| L1 category hubs | Home + retreats listing partially | Medium — Saranda primary not uniquely owned |
| L2 core programs | 5/5 money pages exist | Low — metadata alignment needed later |
| L3 support | Events, about, contact, secondary programs | Medium — weak commercial keyword clarity |
| L4 city landers | None | **High** |
| L5 informational | Only intro block on home | **High** |
| Retreat commercial detail | Listing only; 0 detail URLs | **High** for retreat demand |

Full gaps: see `CONTENT-GAPS.md`.  
Page-level assignments: see `PAGE-KEYWORD-MAP.md`.  
Cluster link model: see `TOPIC-CLUSTERS.md`.

---

## 8. Metadata & content governance (for future implementation)

When metadata/content work begins later:

1. Title and H1 must reinforce the page’s **single primary keyword** (natural language, not stuffing).  
2. Secondary keywords appear in H2s, body, FAQs, and image alt — not as competing H1s.  
3. Internal links use descriptive anchors that match the **target page’s primary**, not the source page’s.  
4. New pages are refused if they cannot claim a unique primary without stealing from this map.  
5. CMS `seo.title` / `seo.description` must be checked against `PAGE-KEYWORD-MAP.md` before publish.  

---

## 9. Success definition (strategy level)

This architecture succeeds when:

- Each money query maps to one clear URL  
- Local travelers from priority cities land on pages that answer “is this near me / can I travel?”  
- Informational seekers are educated toward Classical Hatha (not gym yoga) then routed to programs  
- Program pages are the only owners of `{Program} Albania`  
- Registrations grow from organic landings on P0 URLs  

No implementation in this phase — strategy and mapping only.
