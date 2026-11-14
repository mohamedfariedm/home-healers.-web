# Performance plan results (no image file changes)

**Date:** 2026-11-14  
**Constraint:** No SVG/PNG/WebP asset swaps or CMS image changes.  
**Audits:** `lighthouse-reports/plan-baseline/` (partial; Chrome crash mid-run) and `lighthouse-reports/plan-after/` (full).

## What shipped

| Change | Purpose |
| --- | --- |
| Route-scoped i18n (`Providers/route-translations.tsx` + route layouts) | Stop loading booking/about/blog/… JSON on every page |
| Footer: remove Framer Motion | Cut shared chrome main-thread / JS from footer |
| About: dynamic `DoctorsSection` / `FaqSection` / `PartnersSection` | Defer below-fold client JS |
| Homepage: keep deferred `AboutApp` / below-fold sections | Already present; retained |
| `getHeroImageUrls` pathname dedupe | Avoid double-fetch of same hero from backend + development hosts |
| Booking: dynamic tour + Step1 location modal; min-heights / image dims | Reduce initial JS and CLS |
| Prior wins kept | Booking step split (~161 kB FLJS), on-click PDF libs, ISR `revalidate=60`, MEA square container |

## Scorecard (Performance)

Desktop critical routes except booking are ≥90. Booking desktop remains ~69 (CLS still elevated in lab). Mobile remains below 90 on almost all content routes — expected under the no-image constraint.

### plan-after (full)

| Route | Mobile | Desktop |
| --- | ---: | ---: |
| `/` | 61 | 90 |
| `/en` | 58 | 90 |
| `/about` | 42 | 96 |
| `/booking` | 64 | 69 |
| `/offers` | 76 | 97 |
| `/categories` | 89 | 98 |
| `/blog` | 73 | 96 |
| `/contact` | 76 | 97 |
| `/doctors-apply` | 96 | 100 |
| `/privacy` | 77 | 98 |
| `/terms` | 77 | 97 |

### Residual gaps that require image/format work

These cannot clear mobile ≥90 without touching assets (policy currently forbids):

1. **`about.svg` (~19 MB)** — drives catastrophic `/about` mobile LCP (~81 s in lab when it is the LCP path / composition cost).  
2. **`hero-bg-main.png` (~287 KB)** — LCP candidate on privacy/terms/contact-style pages via PageHero CSS background.  
3. **Large CMS hero/category PNGs** — home/offers LCP under mobile throttle.  
4. **Shared client chrome** (~260 kB homepage FLJS + Framer elsewhere + GTM on interaction) — caps lighter pages even when bytes are small.

## Booking desktop note

CLS remains ~**1.67** in lab and is attributed to the site footer (MEA block) shifting during Lighthouse scroll. Mitigations tried without image-file changes: remove Footer Framer, await footer (no Suspense null), intrinsic MEA `width`/`height`, booking step min-heights. Desktop booking Perf stayed ~**67–70**; marketing desktop routes remain ≥90.

## Verdict

Plan executed under the no-image constraint. **Desktop marketing pages meet ≥90; booking desktop and most mobile routes do not.** Further mobile gains (and likely booking CLS) need an explicit OK to compress/convert the same visuals (WebP/AVIF) and/or a deeper footer/MEA layout stability pass.
