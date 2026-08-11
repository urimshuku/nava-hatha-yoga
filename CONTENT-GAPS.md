# Content Gaps — Nava Hatha Yoga

**Date:** 10 August 2026  
**Companion docs:** `KEYWORD-ARCHITECTURE.md`, `PAGE-KEYWORD-MAP.md`, `TOPIC-CLUSTERS.md`  
**Status:** Strategy backlog only — do not implement in this phase  

---

## 1. Executive gap summary

Technical SEO is in place and **23 indexable URLs** already cover brand, programs, retreats listing, events, about, and contact. The largest organic gaps are:

1. **No local city landing pages** for Saranda, Tirana, Prishtina, Corfu, Korçë, Gjirokastër  
2. **Almost no informational / educational pages** beyond a homepage intro block  
3. **No published retreat detail / Saranda retreat commercial page** despite strong retreat keywords  
4. **Weak separation** between Albania-wide vs Saranda-specific commercial intent on current home title strategy  
5. **No dedicated pages** for travel audiences from Kosovo / North Macedonia / Greece beyond contact mentions  

---

## 2. Missing landing pages (commercial / local)

These are high-intent pages meant to rank and convert.

| Priority | Planned URL (suggested) | Primary keyword (reserved) | Intent | Why missing matters | Links into |
|----------|-------------------------|----------------------------|--------|---------------------|------------|
| **P0** | `/locations/saranda` | Classical Hatha Yoga Saranda | Know-local / Do-register | Highest-priority city; currently diluted on home | Home, Programs, Events, Contact |
| **P0** | `/retreats/saranda` *or first Sanity retreat detail* | Yoga Retreat Saranda | Do-visit / Do-register | Explicit P0 term with no dedicated owner | Retreats hub, Programs, Contact |
| **P0** | `/locations/tirana` | Classical Hatha Yoga Tirana | Know-local / Do-register | Capital demand + existing teaching footprint | Home, Events, Contact |
| **P1** | `/locations/prishtina` | Classical Hatha Yoga Prishtina | Know-local / travel | Kosovo travel audience | Retreats, Contact, core programs |
| **P1** | `/locations/corfu` | Classical Hatha Yoga Corfu | Know-local / travel | Greece / Corfu day-travel or retreat travel | Retreats, Saranda, Contact |
| **P2** | `/locations/korce` | Classical Hatha Yoga Korçë | Know-local | Priority city coverage | Contact, Programs |
| **P2** | `/locations/gjirokaster` | Classical Hatha Yoga Gjirokastër | Know-local | Priority city coverage | Contact, Programs |
| **P1** | `/locations` (optional index) | Classical Hatha Yoga locations Albania | Navigational | Hub for city landers | All location pages |

### Local landing page brief (when built later)

Each city page should answer:

- Is authentic Classical Hatha Yoga available here / reachable from here?  
- Which programs are offered or reachable?  
- How do travelers join (events, private, retreat)?  
- Who teaches (link About)?  
- Clear CTA to Contact / upcoming Events  

**Do not** create thin pages that only swap the city name. Require unique logistics, proof, and CTAs.

---

## 3. Missing informational pages (TOFU / education)

| Priority | Planned URL (suggested) | Primary keyword (reserved) | Cluster | Questions answered |
|----------|-------------------------|----------------------------|---------|-------------------|
| **P0** | `/guides/what-is-classical-hatha-yoga` | What is Classical Hatha Yoga | Classical Hatha Yoga | Definition; tradition; who it’s for |
| **P0** | `/guides/classical-hatha-yoga-vs-modern-yoga` | Classical Hatha Yoga vs modern yoga | Classical Hatha Yoga | Why not gym/power/hot yoga |
| **P0** | `/guides/what-is-surya-kriya` | What is Surya Kriya | Surya Kriya | Definition without stealing “Surya Kriya Albania” |
| **P1** | `/guides/surya-kriya-vs-surya-shakti` | Surya Kriya vs Surya Shakti | Surya Kriya | Differentiation |
| **P1** | `/guides/what-is-angamardana` | What is Angamardana | Angamardana | Definition / who it’s for |
| **P1** | `/guides/what-are-yogasanas` | What are Yogasanas | Yogasanas | Classical asana vs stretch class |
| **P1** | `/guides/what-is-upa-yoga` | What is Upa Yoga | Upa Yoga | Beginner entry |
| **P1** | `/guides/what-is-bhuta-shuddhi` | What is Bhuta Shuddhi | Bhuta Shuddhi | Purification intent |
| **P1** | `/guides/inner-transformation-through-hatha-yoga` | inner transformation through Classical Hatha Yoga | Classical Hatha Yoga | Audience #2 intent |
| **P2** | `/guides/upa-yoga-for-beginners` | Upa Yoga for beginners | Upa Yoga | First practice path |
| **P2** | `/guides/surya-kriya-benefits` | Surya Kriya benefits | Surya Kriya | Benefits intent |
| **P2** | `/guides/angamardana-benefits` | Angamardana benefits | Angamardana | Benefits intent |
| **P2** | `/guides/prepare-body-for-classical-hatha-yoga` | prepare body for Classical Hatha Yoga | Angamardana | Reframe fitness seekers |
| **P2** | `/guides/yogasanas-vs-gym-yoga` | Yogasanas vs gym yoga | Yogasanas | Disambiguation |
| **P2** | `/guides/classical-hatha-yoga-retreat-albania` | Classical Hatha Yoga retreat guide Albania | Retreats | Educate then convert to `/retreats` |
| **P3** | Optional special-practice explainers | What is {Practice} | Satellite | Only if GSC demand appears |

### Informational page rules

- Never use `{Practice} Albania` as the informational primary — that belongs to `/programs/{slug}`.  
- Always end with CTA to the matching program page + Contact.  
- Explicitly exclude teacher-training and app/meditation intents.

---

## 4. Missing commercial pages

| Priority | Gap | Suggested owner | Primary keyword (reserved) | Notes |
|----------|-----|-----------------|----------------------------|-------|
| **P0** | Saranda retreat product page | `/retreats/saranda` or published `/retreats/[slug]` | Yoga Retreat Saranda | Requires real retreat offering or clear “join waitlist / inquire” commercial intent |
| **P1** | Private sessions lander | `/private-sessions` *or* stronger section with unique URL | private Classical Hatha Yoga sessions Albania | Site already promotes private/group sessions; no dedicated indexable lander |
| **P1** | How to register / join | `/join` or enhanced `/contact` sections | how to register for Classical Hatha Yoga Albania | Keep `/register` noindex; organic page should explain process then CTA |
| **P2** | Partner programs B2B page | `/retreats/partners` | partner Classical Hatha Yoga retreat Albania | If partner demand is material; else keep as section on `/retreats` |
| **P2** | Multi-city schedule hub | Could remain `/events` | — | Only split if events volume overwhelms one URL |

### Commercial pages that should **not** be created

| Tempting idea | Why not |
|---------------|---------|
| Yoga teacher training Albania | Explicitly out of scope |
| Hot / power / weight-loss yoga pages | Brand-negative |
| Meditation app alternatives | Wrong product |
| Generic “best yoga Albania” listicle farm | Thin / off-positioning unless tightly Classical Hatha framed under existing hubs |

---

## 5. Missing local pages (city × intent)

### Priority city coverage matrix

| City | Classical Hatha lander | Program × city pages | Retreat angle |
|------|------------------------|----------------------|---------------|
| Saranda | **Missing (P0)** | Optional later for Surya Kriya Saranda as secondary on program page first | **Missing Yoga Retreat Saranda (P0)** |
| Tirana | **Missing (P0)** | Optional `Surya Kriya Tirana` only with proven demand | Point to Albania retreats + Tirana events |
| Prishtina | **Missing (P1)** | Avoid until demand | Travel to Saranda / Albania retreat |
| Corfu | **Missing (P1)** | Avoid until demand | Travel / Corfu ↔ Saranda |
| Korçë | **Missing (P2)** | Avoid | Contact / visiting teacher narrative |
| Gjirokastër | **Missing (P2)** | Avoid | Contact / visiting teacher narrative |

**Rule:** Launch city × program URLs only after the city lander exists and Search Console shows meaningful `{program} {city}` demand. Until then, keep city modifiers as **secondaries** on the national program page.

---

## 6. Gaps on existing pages (strategy debt — not implementation)

These are mapping/strategy issues visible from the audit; fix later via content/metadata projects:

| Page | Gap | Strategic fix (later) |
|------|-----|------------------------|
| `/` | Primary should be Albania-wide; Saranda currently dominates title pattern | Retarget primary to Classical Hatha Yoga Albania; move Saranda emphasis to location lander |
| `/programs` | Needs explicit “programs”-qualified primary | Own Classical Hatha Yoga programs Albania |
| `/retreats` | Listing exists but weak product depth | Keep Albania retreat primary; add Saranda retreat URL when ready |
| Core program pages | Titles are practice names only | Align titles/H1s to `{Practice} Albania` primaries without stuffing |
| `/events` | Not in main nav | Discoverability gap for schedule intent |
| `/about` | Strong trust page; must not compete for category Albania term | Lock primary to teacher query |
| Special programs | Thin external demand likely | Maintain pages; don’t expand clusters until data says so |

---

## 7. Funnel coverage gaps

```
TOFU  Informational guides .......... MOSTLY MISSING
MOFU  Programs + category ............ MOSTLY COVERED (needs keyword alignment)
MOFU  Local city intent .............. MISSING
BOFU  Events schedule ................ COVERED
BOFU  Retreat commercial ............. PARTIAL (listing only)
BOFU  Contact / register path ........ COVERED (register noindex by design)
```

**Biggest funnel leak:** travelers and authenticity-seekers who need education or city confirmation before they will open a program page.

---

## 8. Recommended build sequence (when implementation starts)

### Phase A — Protect money terms (metadata/content alignment on existing URLs)
1. Home, Programs, five core program pages, Retreats, About, Contact, Events  
2. Enforce unique primaries from `PAGE-KEYWORD-MAP.md`  

### Phase B — Education pillars
1. What is Classical Hatha Yoga  
2. Classical vs modern yoga  
3. What is Surya Kriya  
4. What is Angamardana / Yogasanas / Upa Yoga / Bhuta Shuddhi (batch)  

### Phase C — Local + retreat commercial
1. Saranda lander  
2. Tirana lander  
3. Yoga Retreat Saranda (when offer exists)  
4. Prishtina + Corfu  
5. Korçë + Gjirokastër  

### Phase D — Depth
1. Benefits / beginners / differentiation guides  
2. Private sessions lander (if needed)  
3. Optional program × city only with demand proof  

---

## 9. Reserved primary keyword locklist (planned pages)

Do **not** assign these as primaries on any existing URL:

- Classical Hatha Yoga Saranda  
- Classical Hatha Yoga Tirana  
- Classical Hatha Yoga Prishtina  
- Classical Hatha Yoga Corfu  
- Classical Hatha Yoga Korçë  
- Classical Hatha Yoga Gjirokastër  
- Yoga Retreat Saranda  
- What is Classical Hatha Yoga  
- Classical Hatha Yoga vs modern yoga  
- What is Surya Kriya  
- Surya Kriya vs Surya Shakti  
- What is Angamardana  
- What are Yogasanas  
- What is Upa Yoga  
- What is Bhuta Shuddhi  
- inner transformation through Classical Hatha Yoga  
- private Classical Hatha Yoga sessions Albania  
- Upa Yoga for beginners  
- Surya Kriya benefits  
- Angamardana benefits  

---

## 10. Measurement triggers to open new pages

Create a new URL only when at least one is true:

1. Reserved primary is strategic P0/P1 in this doc, **or**  
2. Search Console shows sustained queries (≥ meaningful impressions over 28–90 days) with no suitable existing owner, **or**  
3. A real commercial offer launches (e.g., dated Saranda retreat)  

Otherwise expand sections on the existing cluster pillar.

---

## 11. Out of scope (permanent)

- Yoga teacher training landers  
- Hot / power / weight-loss / pilates / stretching class landers  
- Meditation app comparison landers  
- Event detail URLs solely for SEO without product need  
- Duplicate blogs that repeat program page copy under a new URL  

---

**End of strategy pack.**  
Implementation explicitly deferred. Use these four documents as the brief for any future content or metadata project.
