# Production SEO Low Verification

**Site:** https://navahathayoga.com  
**Checked:** 9 August 2026 (post Low Priority deploy)  
**Method:** Live HTTP header/HTML fetches. No code changes.  
**Compared against:** `SEO-AUDIT.md`, `SEO-LOW-PRIORITY-REPORT.md`, `PRODUCTION-SEO-MEDIUM-VERIFICATION.md`

---

## Deploy alignment

| Item | Value |
|------|--------|
| Local `HEAD` | `a785590048ec2c506bd051e50a685ffe06a23644` |
| `origin/main` | `a785590048ec2c506bd051e50a685ffe06a23644` |
| Commit | `a785590` — *Implement low priority SEO improvements* |
| Deployed site vs push | **Yes — appears to match** (`favicon.ico` 200, image/PDF cache headers, no `Host:` in app robots block, footer labels as `p.eyebrow`) |

---

## Executive verdict

**Low Priority fixes that were implemented (L1, L2, L4, L5) are live and verify cleanly.** Critical / High / Medium SEO behavior remains intact. No new 403 / 415 / 500 responses; intentional unknown path still returns **404**.

Skipped audit items (L3 locale, L6 PWA icons, L7 Search Console token) were not deployed by design and are out of scope for this pass.

---

## Checklist

| # | Check | Result |
|---|--------|--------|
| 1 | `/images/*` Cache-Control as intended | ✅ Passed |
| 2 | `/pdfs/*` Cache-Control as intended | ✅ Passed |
| 3 | `/favicon.ico` HTTP 200 with icon content type | ✅ Passed |
| 4 | `robots.txt` no longer includes `Host` | ✅ Passed |
| 5 | Existing robots allow/disallow rules remain correct | ✅ Passed |
| 6 | Footer Explore / Legal / Contact are no longer `<h2>` | ✅ Passed |
| 7 | Footer navigation and visual appearance unchanged | ✅ Passed |
| 8 | Critical, High, and Medium SEO fixes remain intact | ✅ Passed |
| 9 | No new 403, 404, 415, or 500 errors introduced | ✅ Passed |
| 10 | Canonicals, structured data, sitemap, noindex, OG, CF transforms, YouTube facade still work | ✅ Passed |

**Summary:** 10 ✅ Passed · 0 ⚠ Warning · 0 ❌ Failed

---

## Detailed results

### 1. `/images/*` Cache-Control — ✅ Passed

| URL | `Cache-Control` |
|-----|-----------------|
| `/images/og-default.png` | `public,max-age=604800,stale-while-revalidate=86400` |
| `/images/nava-logo-symbol-v2.webp` | `public,max-age=604800,stale-while-revalidate=86400` |
| `/images/programs/bhastrika-kriya.webp` | `public,max-age=604800,stale-while-revalidate=86400` |

Matches `SEO-LOW-PRIORITY-REPORT.md` / `public/_headers`.

### 2. `/pdfs/*` Cache-Control — ✅ Passed

| URL | Status | `Cache-Control` | Type |
|-----|--------|-----------------|------|
| `/pdfs/nava-hatha-yoga-full-program-guidelines.pdf` | **200** | `public,max-age=86400` | `application/pdf` |

### 3. `/favicon.ico` — ✅ Passed

| Check | Result |
|-------|--------|
| HTTP | **200** |
| `Content-Type` | `image/vnd.microsoft.icon` |
| File | MS Windows icon resource — 16×16 + 32×32 PNG-compressed icons (~1932 bytes) |

### 4. No `Host` in robots.txt — ✅ Passed

App-generated robots block has **no** `Host:` line. Live file ends with:

```
User-Agent: *
Allow: /
Disallow: /studio
Disallow: /api/

Sitemap: https://navahathayoga.com/sitemap.xml
```

(Cloudflare-managed bot rules above the app block are unrelated and unchanged.)

### 5. Allow / Disallow rules — ✅ Passed

| Rule | Present |
|------|---------|
| `Allow: /` | Yes |
| `Disallow: /studio` | Yes |
| `Disallow: /api/` | Yes |
| `Disallow: /thank-you` | **No** (correct after H4) |
| `Sitemap: https://navahathayoga.com/sitemap.xml` | Yes |

### 6. Footer labels not `<h2>` — ✅ Passed

On `/` and `/events`:

- **0** `<h2>Explore|Legal|Contact</h2>`
- **6** `<p class="…eyebrow…">` labels (mobile + desktop layouts)

### 7. Footer nav / appearance — ✅ Passed

- `<footer>` present  
- Labels still use `eyebrow` styling  
- Explore / Legal / Contact link sets still include `/programs`, `/retreats`, `/about`, `/contact`, legal policy links, WhatsApp, Instagram, email  
- Dual mobile/desktop footer structure preserved (intentional; only heading tags demoted)

### 8. Critical / High / Medium intact — ✅ Passed

| Prior area | Live evidence |
|------------|----------------|
| C1 hero visibility | Homepage `<h1>` present; no hero `opacity:0` |
| H6 homepage title | `Classical Hatha Yoga in Saranda, Albania · Nava Hatha Yoga` |
| H1 WOFF2 | Montserrat `.woff2` → **200** |
| H2 JSON-LD | Home: Event + org; Events: 5 Events; Surya Kriya: Course + BreadcrumbList + Event |
| LocalBusiness | `@id`, logo/image (webp), geo, priceRange |
| H4 / M7 noindex | `/register`, `/thank-you`: `noindex, nofollow`; **no** canonical |
| H5 sitemap | 10 URLs without lastmod; 13 with **4 distinct** program timestamps |
| M1 WebP logos | Homepage uses `nava-logo-symbol-v2.webp` (0 `.png` symbol refs) |
| M2 YouTube facade | Thumbnail + play aria; **no** `iframe_api` / embed before click |
| M4 event `<dl>` | `/events`: **0** `<dl>` |
| M6 program OG | Surya Kriya uses Sanity OG URL (not only default) |
| Default OG | Homepage `og:image` = `/images/og-default.png` |

### 9. No new error statuses — ✅ Passed

Sampled HTML routes, favicon, images, PDF, CF transforms, OG URLs, YT thumbnail:

- No **403 / 415 / 500**  
- Unknown path `/this-page-does-not-exist-low-verify` → **404** (expected)  
- Core routes and assets → **200**

### 10. Canonicals / schema / sitemap / noindex / OG / CF / YouTube — ✅ Passed

| Check | Result |
|-------|--------|
| Homepage canonical | `https://navahathayoga.com` |
| Register / thank-you canonical | Absent (correct) |
| Structured data | Event / Course / Breadcrumb / org present as above |
| Sitemap | 23 URLs; lastmod pattern unchanged |
| OG images | Default + program-specific URLs → **200** |
| CF transforms | Logo + Sadhguru WebP transforms → **200** |
| YouTube click-to-load | Facade only in initial HTML (`i.ytimg.com`, `Play video:`, `aspect-video`; no player scripts) |

---

## Notes

1. Favicon uses `image/vnd.microsoft.icon` (standard ICO MIME); equivalent to the requested icon content type.  
2. Cloudflare-managed robots preamble still appears above the app rules; app `Host:` removal is verified.  
3. L3 / L6 / L7 remain intentionally unimplemented per `SEO-LOW-PRIORITY-REPORT.md`.

---

*Verification only — no application code was changed in this pass.*
