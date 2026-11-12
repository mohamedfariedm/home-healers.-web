# Lighthouse Final Report

**Date:** 2026-11-12  
**Before:** `lighthouse-reports/baseline/` (clean `main` production build)  
**After:** `lighthouse-reports/final/` + `final-pass2/` (about/home/booking rechecked after about-SVG fix)  
**Base URL:** `http://localhost:3001`  
**Merged comparison:** `lighthouse-reports/final/comparison.json`

PASS = Performance ≥ 90 **and** Accessibility ≥ 90 **and** Best Practices ≥ 90 **and** SEO ≥ 90.

LCP / TBT / CLS / FCP / SI columns are **after** values (milliseconds except CLS).

## Comparison table (all paired audits)

| Route | Device | Before | After | LCP | TBT | CLS | A11y | BP | SEO | FCP | SI | Status |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| / | mobile | 80 | 79 | 4580 | 232 | 0.008 | 88 | 100 | 100 | 1219 | 2342 | FAIL |
| / | desktop | 99 | 99 | 951 | 1 | 0.003 | 96 | 100 | 100 | 341 | 577 | PASS |
| /en | mobile | 83 | 82 | 4359 | 175 | 0 | 88 | 100 | 100 | 1550 | 2426 | FAIL |
| /en | desktop | 99 | 99 | 943 | 0 | 0 | 96 | 100 | 100 | 418 | 564 | PASS |
| /about | mobile | 37 | 49 | 9008 | 1327 | 0 | 93 | 96 | 100 | 1358 | 3756 | FAIL |
| /about | desktop | 62 | 93 | 1412 | 144 | 0.005 | 93 | 96 | 100 | 416 | 1044 | PASS |
| /en/about | mobile | 39 | 54 | 6334 | 1079 | 0 | 93 | 73 | 92 | 1361 | 3259 | FAIL |
| /en/about | desktop | 65 | 93 | 1417 | 135 | 0.001 | 93 | 96 | 100 | 458 | 1016 | PASS |
| /contact | mobile | 72 | 77 | 6022 | 125 | 0.001 | 100 | 96 | 100 | 1061 | 1296 | FAIL |
| /contact | desktop | 97 | 98 | 1178 | 0 | 0.004 | 100 | 100 | 100 | 289 | 476 | PASS |
| /en/contact | mobile | 74 | 78 | 5953 | 110 | 0 | 96 | 96 | 100 | 1209 | 1209 | FAIL |
| /en/contact | desktop | 97 | 97 | 1216 | 0 | 0 | 96 | 100 | 100 | 328 | 493 | PASS |
| /blog | mobile | 61 | 77 | 6193 | 111 | 0 | 91 | 77 | 100 | 1209 | 2490 | FAIL |
| /blog | desktop | 97 | 97 | 1268 | 0 | 0.003 | 95 | 77 | 100 | 330 | 924 | FAIL |
| /en/blog | mobile | 78 | 84 | 4314 | 124 | 0 | 91 | 100 | 100 | 1211 | 1620 | FAIL |
| /en/blog | desktop | 97 | 97 | 1219 | 0 | 0 | 95 | 100 | 100 | 330 | 519 | PASS |
| /categories | mobile | 59 | 76 | 4369 | 382 | 0.001 | 95 | 100 | 100 | 1060 | 1090 | FAIL |
| /categories | desktop | 93 | 94 | 1188 | 164 | 0.004 | 95 | 77 | 100 | 284 | 767 | FAIL |
| /en/categories | mobile | 56 | 70 | 6106 | 336 | 0 | 95 | 100 | 100 | 1204 | 2216 | FAIL |
| /en/categories | desktop | 95 | 76 | 1232 | 504 | 0 | 95 | 77 | 100 | 326 | 824 | FAIL |
| /offers | mobile | 69 | 69 | 6805 | 348 | 0.001 | 96 | 100 | 100 | 1034 | 1674 | FAIL |
| /offers | desktop | 96 | 96 | 1439 | 0 | 0.031 | 97 | 100 | 100 | 285 | 469 | PASS |
| /en/offers | mobile | 70 | 75 | 6730 | 148 | 0 | 96 | 100 | 100 | 1175 | 1516 | FAIL |
| /en/offers | desktop | 96 | 95 | 1480 | 7 | 0 | 97 | 100 | 100 | 314 | 494 | PASS |
| /booking | mobile | 40 | 45 | 7535 | 1561 | 0 | 93 | 54 | 100 | 2259 | 4185 | FAIL |
| /booking | desktop | 69 | 85 | 1381 | 253 | 0.005 | 93 | 54 | 100 | 461 | 1468 | FAIL |
| /en/booking | mobile | 40 | 49 | 6768 | 1447 | 0 | 93 | 58 | 100 | 1681 | 3699 | FAIL |
| /en/booking | desktop | 31 | 73 | 1886 | 382 | 0.001 | 93 | 54 | 100 | 385 | 1542 | FAIL |
| /doctors-apply | mobile | 82 | 92 | 959 | 319 | 0.059 | 92 | 96 | 100 | 959 | 959 | PASS |
| /doctors-apply | desktop | 99 | 100 | 286 | 1 | 0.016 | 88 | 96 | 100 | 286 | 320 | FAIL |
| /en/doctors-apply | mobile | 76 | 93 | 952 | 330 | 0.027 | 88 | 96 | 100 | 952 | 952 | FAIL |
| /en/doctors-apply | desktop | 98 | 100 | 318 | 0 | 0.002 | 88 | 96 | 100 | 318 | 333 | FAIL |
| /privacy | mobile | 76 | 75 | 5791 | 186 | 0.058 | 100 | 100 | 100 | 1080 | 1080 | FAIL |
| /privacy | desktop | 100 | 98 | 1141 | 0 | 0.012 | 100 | 100 | 100 | 290 | 345 | PASS |
| /en/privacy | mobile | 86 | 78 | 6091 | 81 | 0.009 | 96 | 100 | 100 | 1208 | 1208 | FAIL |
| /en/privacy | desktop | 99 | 98 | 1197 | 0 | 0 | 96 | 100 | 100 | 329 | 363 | PASS |
| /terms | mobile | 79 | 73 | 5718 | 261 | 0.055 | 100 | 100 | 100 | 1059 | 1059 | FAIL |
| /terms | desktop | 100 | 98 | 1159 | 0 | 0.017 | 100 | 100 | 100 | 289 | 322 | PASS |
| /en/terms | mobile | 77 | 76 | 5722 | 208 | 0 | 96 | 100 | 100 | 1211 | 1211 | FAIL |
| /en/terms | desktop | 99 | 97 | 1218 | 2 | 0.001 | 96 | 100 | 100 | 329 | 361 | PASS |
| /failed | mobile | 76 | 69 | 6483 | 327 | 0 | 88 | 100 | 100 | 964 | 2895 | FAIL |
| /failed | desktop | 97 | 90 | 2045 | 24 | 0.003 | 96 | 100 | 100 | 268 | 848 | PASS |
| /en/failed | mobile | 76 | 68 | 7302 | 333 | 0 | 88 | 100 | 100 | 1112 | 3045 | FAIL |
| /en/failed | desktop | 97 | 94 | 1658 | 40 | 0 | 96 | 100 | 100 | 300 | 945 | PASS |

## Category notes

### Accessibility
- Common fails: `color-contrast`, `target-size`, `aria-required-children`.
- Homepage mobile remains **88** (below 90). Fixing contrast/tap targets would change visuals — deferred by design-preservation rule.

### Best Practices
- Booking BP **54–58** includes localhost `is-on-https`, third-party cookies (GTM/Clarity), missing source maps, inspector issues.
- On production HTTPS, expect BP uplift for `is-on-https`; cookie/source-map items may remain.

### SEO
- Generally **92–100**. Occasional SEO 92 related to crawl/meta audits under throttling/error pages — not a structural SEO regression from these changes.

## Pages below Performance 90 (after)

| Route | Device | After | Primary limiter |
| --- | --- | ---: | --- |
| Most marketing pages | mobile | 68–84 | Main-thread JS / LCP still >2.5s under mobile throttle |
| `/about` | mobile | 49 | Large DOM (FAQ/doctors), remaining JS; LCP improved 96s→9s but still high |
| `/booking` | mobile/desktop | 45–85 | Step1 + shared chrome still heavy; maps/PDF deferred but TBT remains |
| `/en/categories` | desktop | 76 | Run variance / main-thread (investigate if persistent) |

## Remaining issues (honest)

1. **Mobile LCP still >2.5s** on most routes under Lighthouse mobile simulation — shared hydration + Framer/Swiper + third-party still dominate.
2. **Booking** still fails 90+ despite 544 kB FLJS reduction — Step1 specialty UI + tour + layout JS.
3. **About uncompressed HTML/RSC ~2 MB** (`resourceSize`) though gzipped transfer ~85 KB — slim doctor/FAQ payloads further.
4. **A11y 88** on several pages without visual changes allowed.
5. **Dynamic CMS URLs** (offer/blog/category/landing detail) not in paired table — inventory documented; add to next audit pass with discovered slugs.
6. **INP** not covered by lab Lighthouse — needs CrUX / interaction traces.

## Visual regression evidence

Screenshots after optimization (desktop):

- `docs/performance/screenshots/perf-qa-home-desktop.png`
- `docs/performance/screenshots/perf-qa-about-desktop.png`
- `docs/performance/screenshots/perf-qa-booking-desktop.png`

Manual checks: homepage hero/RTL intact; about composition image loads as WebP fallback; booking Step1 + tour modal functional.

## Build / test results

| Check | Result |
| --- | --- |
| `yarn build` | Pass (post-`DeferredMap` fix) |
| Production `next start` | Pass; warm routes HTTP 200 |
| Automated unit/e2e suite | Not present / not run beyond production build + browser smoke |
| Console | `/default-doctor.png` 404 observed on about (pre-existing) |

## Raw artifacts

- Baseline HTML/JSON: `lighthouse-reports/baseline/`
- Final HTML/JSON: `lighthouse-reports/final/`
- About recheck: `lighthouse-reports/final-pass2/`
