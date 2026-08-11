# Icon Production Fix Report

**Date:** 11 August 2026  
**Site:** https://navahathayoga.com  
**Scope:** Isolated fix for `/icon` and `/apple-icon` HTTP 500s only — no other SEO changes  

---

## Root cause

`app/icon.tsx` and `app/apple-icon.tsx` used `next/og` **`ImageResponse`** plus `fs.readFile` for Cormorant WOFF fonts at request time.

That is the same failure class previously seen with dynamic `/opengraph-image` on **OpenNext / Cloudflare Workers** (runtime `ImageResponse` + filesystem font loading is unreliable on Workers). Production returned **HTTP 500** for `/icon` and `/apple-icon`, while `/favicon.ico` (static) remained healthy.

---

## Fix applied

Prefer static assets (same strategy as the OG image fix):

1. **Removed** dynamic `app/icon.tsx` and `app/apple-icon.tsx`.
2. **Added** static branded PNGs via Next metadata file conventions:
   - `app/icon.png` — 32×32, saffron (`#C9A86A`) rounded tile with cream Nava symbol  
   - `app/apple-icon.png` — 180×180, cream (`#FAF6EE`) field with gold (`#B08D57`) Nava symbol  
3. **Preserved** `app/favicon.ico` unchanged.
4. **Rewrites** in `next.config.mjs` so short paths stay valid for crawlers/manifest:
   - `/icon` → `/icon.png` (internal rewrite → **200**)  
   - `/apple-icon` → `/apple-icon.png` (internal rewrite → **200**)  
5. **Manifest** continues to reference `/icon` and `/apple-icon` (`app/manifest.ts` unchanged in intent).

Branding uses the existing Nava logo symbol (`public/images/nava-logo-symbol-v2.png`), aligned with the favicon approach and site colors from the previous ImageResponse designs.

---

## Files changed

| File | Change |
|------|--------|
| `app/icon.tsx` | **Deleted** (ImageResponse) |
| `app/apple-icon.tsx` | **Deleted** (ImageResponse) |
| `app/icon.png` | **Added** static 32×32 PNG |
| `app/apple-icon.png` | **Added** static 180×180 PNG |
| `next.config.mjs` | Added rewrites for `/icon` and `/apple-icon` |
| `app/favicon.ico` | Unchanged |
| SEO Phase 1 pages / CMS | **Not modified** |

---

## Local verification

| Check | Result |
|-------|--------|
| `npm run typecheck` | **Pass** |
| `npm run lint` | **Pass** (0 errors; pre-existing `cloudflare-env.d.ts` warnings only) |
| `npm run build` | **Pass** — routes include `○ /icon.png`, `○ /apple-icon.png` |

---

## Production verification (post-deploy)

**Worker version:** `076bcd76-8d92-4709-ab33-e3145a8a3274`

| URL | Status | Content-Type | Notes |
|-----|--------|--------------|-------|
| `/favicon.ico` | **200** | `image/vnd.microsoft.icon` | Preserved |
| `/icon` | **200** | `image/png` | PNG magic OK (757 bytes) |
| `/apple-icon` | **200** | `image/png` | PNG magic OK (6239 bytes) |
| `/icon.png` | **200** | `image/png` | Underlying static route |
| `/apple-icon.png` | **200** | `image/png` | Underlying static route |

### Metadata (no regressions observed)

Homepage still emits:

- `<link rel="icon" href="/favicon.ico?…" …>`
- `<link rel="icon" href="/icon.png?…" sizes="32x32" type="image/png"/>`
- `<link rel="apple-touch-icon" href="/apple-icon.png?…" sizes="180x180" type="image/png"/>`

Document title still Phase 1 value: `Classical Hatha Yoga in Albania · Nava Hatha Yoga`.  
`/manifest.webmanifest` returns **200** and still lists `/icon` + `/apple-icon`.

---

## Outcome

| Before | After |
|--------|-------|
| `/icon` → 500 | `/icon` → **200** `image/png` |
| `/apple-icon` → 500 | `/apple-icon` → **200** `image/png` |
| `/favicon.ico` → 200 | `/favicon.ico` → **200** (unchanged) |

No other SEO implementation was modified.
