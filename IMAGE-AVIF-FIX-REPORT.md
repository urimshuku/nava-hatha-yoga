# Image AVIF Fix Report — Sadhguru Certification Logo

**Date:** 9 August 2026  
**Issue:** Production SEO warning from `PRODUCTION-SEO-VERIFICATION-V2.md` check 4  
**Status:** Fixed and deployed

---

## Root cause

Cloudflare Image Transformations returns **HTTP 415 Unsupported Media Type** when the **source** image is AVIF and the request uses `/cdn-cgi/image/…format=auto/…`.

| Request | Result |
|---------|--------|
| Raw `/images/Sadhguru_Gurukulam_Logo.avif` | **200** `image/avif` |
| `/cdn-cgi/image/width=…,quality=75,format=auto/images/Sadhguru_Gurukulam_Logo.avif` | **415** |
| Same transform path for PNG / WebP / JPEG sources (e.g. nava logo, program photos) | **200** |

So the asset itself was fine; CF’s resizer does not accept this AVIF as an input for re-encoding. The footer badge used `next/image` with the global Cloudflare loader, which always wraps local paths in `/cdn-cgi/image/…`, so every responsive `srcSet` URL for the badge failed.

This is **not** a failure of the global image pipeline — only of AVIF-as-source through CF transforms.

---

## Exact file and component

| Role | Path |
|------|------|
| Source asset (old) | `public/images/Sadhguru_Gurukulam_Logo.avif` |
| Source asset (new) | `public/images/Sadhguru_Gurukulam_Logo.webp` |
| Component | `components/layout/FooterCertificationLogo.tsx` |
| Src wiring | `lib/local-images.ts` → `FOOTER_CERTIFICATION_LOGO_SRC` / `footerCertificationLogoSrc()` |
| Dimensions / alt | `lib/constants.ts` → `FOOTER_CERTIFICATION_LOGO` |

Rendered as a standard `next/image` with fixed width/height **512×135** and responsive `sizes`.

---

## Chosen fix

**Re-export the badge as WebP** (preferred option) and point the app at the WebP path.

1. Converted the original AVIF → WebP at the same dimensions (**512×135**, RGBA), quality 90.
2. Updated `lib/local-images.ts` and `lib/constants.ts` to `/images/Sadhguru_Gurukulam_Logo.webp`.
3. Updated comments / `public/images/README.txt` so AVIF is not used for this badge under CF transforms.
4. Left the original `.avif` on disk as a rebuild source only (not referenced by the app).
5. **Did not** change `image-loader.ts` or weaken Cloudflare transforms globally.

### Why WebP (not bypass)

- Matches other local assets that already transform successfully through CF.
- Keeps responsive `srcset` / `sizes` via `next/image` + the existing loader.
- No layout change: same intrinsic width/height and CSS classes (`max-w-[9rem]` etc.).
- Bypass would work for this one badge but would special-case the loader or force `unoptimized`, which is less consistent than a compatible source format.

---

## Files changed

| File | Change |
|------|--------|
| `public/images/Sadhguru_Gurukulam_Logo.webp` | **Added** — re-export from AVIF |
| `lib/local-images.ts` | Point footer logo src at `.webp` |
| `lib/constants.ts` | Point `FOOTER_CERTIFICATION_LOGO.src` at `.webp` |
| `components/layout/FooterCertificationLogo.tsx` | Comment update |
| `public/images/README.txt` | Document WebP as active; warn against AVIF + CF |
| `IMAGE-AVIF-FIX-REPORT.md` | This report |

Unrelated SEO work was not modified.

---

## Trade-offs

| Trade-off | Detail |
|-----------|--------|
| Source size | WebP (~18 KB) is larger than the original AVIF (~8 KB), but CF still serves optimized `format=auto` variants to clients. |
| AVIF still on disk | Unused by the app; kept only as a rebuild source. Safe to delete later. |
| No loader exception | Global CF pipeline unchanged; future AVIF local assets would hit the same 415 unless converted first. |

---

## Verification

### Local

| Check | Result |
|-------|--------|
| `npm run typecheck` | Pass |
| `npm run lint` | Pass |
| `npm run build` | Pass |
| `npm run deploy` | Pass — uploaded `Sadhguru_Gurukulam_Logo.webp` |

### Production (post-deploy)

| URL | Status | Content-Type |
|-----|--------|--------------|
| `/images/Sadhguru_Gurukulam_Logo.webp` | **200** | `image/webp` |
| `/cdn-cgi/image/width=180,quality=75,format=auto/images/Sadhguru_Gurukulam_Logo.webp` | **200** | `image/avif` (CF `format=auto`) |
| `/cdn-cgi/image/width=256,quality=75,format=auto/images/Sadhguru_Gurukulam_Logo.webp` | **200** | `image/avif` (CF `format=auto`) |
| `/cdn-cgi/image/width=640,quality=75,format=auto/images/Sadhguru_Gurukulam_Logo.webp` | **200** | `image/avif` (CF `format=auto`) |
| Old AVIF transform path (not used by app) | Still **415** | (expected; unused) |

Homepage HTML references `Sadhguru_Gurukulam_Logo.webp` via `/cdn-cgi/image/…` `srcSet` entries (no active `.avif` badge refs).

---

## Summary

Cloudflare cannot transform AVIF **inputs**; the certification badge was the only live local AVIF going through the CF loader. Re-exporting to WebP restores **HTTP 200** on production transform URLs while preserving dimensions, responsive behavior, and the global image pipeline.
