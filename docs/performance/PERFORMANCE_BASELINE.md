# Performance Baseline

**Date:** 2026-11-12  
**Environment:** Local production build (`next build` + `next start -p 3001`)  
**App:** Home Healers (Next.js 15.2.8 App Router, React 18)  
**Tooling:** Lighthouse 13.6.0 via `chrome-launcher` (simulated mobile + desktop)  
**Label:** `lighthouse-reports/baseline/`  
**Runs per route/device:** 1 (noise-limited; treat ±2–5 Performance points as variance)

## Methodology

1. Stashed in-progress optimizations to measure clean `main` HEAD (`ecd1c25`).
2. Built production artifacts with `yarn build`.
3. Served with `yarn start -p 3001`.
4. Audited routes with `scripts/lighthouse-full-audit.mjs` (`LIGHTHOUSE_LABEL=baseline`).
5. Categories: Performance, Accessibility, Best Practices, SEO.
6. Mobile = Lighthouse default mobile emulation + throttling. Desktop = 1350×940 + desktop throttling.

**Caveats**

- Localhost HTTP fails Lighthouse `is-on-https` on some interactive pages (depresses Best Practices). Production HTTPS will not have this penalty.
- Deep-link routes `/home`, `/doctor`, `/service`, `/reservation` often return app-handoff HTML; baseline `/home` audits returned null scores and were excluded from later runs.
- Transactional routes needing live tokens (`/invoice/*`, `/success/*`, `/review/*`, `/invite-doctor/*`) were not audited without real IDs.
- Dynamic CMS routes (offer/blog/category/landing slugs) were not discovered in this baseline run (API discovery returned empty extras); representative static/marketing routes were covered.

## Architecture snapshot (at baseline)

| Area | Finding |
| --- | --- |
| Rendering | Nearly all pages `force-dynamic`; ClientAPI GETs used `cache: "no-store"` |
| i18n | `ar` (default, unprefixed) + `en` (`/en/...`) |
| Fonts | Alexandria via `next/font/google` (`display: swap`) |
| Analytics | GTM / GA4 / Clarity deferred until interaction or 3.5s idle |
| Heavy FLJS | Booking ~712 kB, Success ~613 kB, Contact ~286 kB, Homepage ~259 kB |
| Assets | Photo-SVGs up to ~20 MB (`about.svg`), unused videos ~8 MB in `public/` |

## Route inventory

### Audited in baseline (AR + EN where listed)

| Route pattern | Notes |
| --- | --- |
| `/`, `/en` | Homepage |
| `/about`, `/en/about` | About |
| `/contact`, `/en/contact` | Contact + maps |
| `/blog`, `/en/blog` | Blog index |
| `/categories`, `/en/categories` | Categories index |
| `/offers`, `/en/offers` | Offers index |
| `/booking`, `/en/booking` | Booking wizard |
| `/doctors-apply`, `/en/doctors-apply` | Doctor application |
| `/privacy`, `/en/privacy` | Privacy |
| `/terms`, `/en/terms` | Terms |
| `/failed`, `/en/failed` | Payment failed shell |
| `/home`, `/en/home` | Deep-link (failed / null scores) |

### Present in app but not fully scored in baseline

| Route pattern | Reason |
| --- | --- |
| `/categories/[slug]`, `/categories/[slug]/[serviceSlug]` | Need live slugs; not auto-discovered this run |
| `/offers/[slug]`, `/offers/[slug]/book` | Need live slugs |
| `/blog/[blogID]` | Need live slug |
| `/[slug]` landing CMS | Need live landing slug |
| `/invoice/[slug]`, `/success/[slug]`, `/canceled/[slug]`, `/failed/[slug]` | Need order/invoice refs |
| `/review/[reservationId]`, `/reservations/review/[reservationId]` | Need reservation IDs |
| `/invite-doctor/[token]` | Need invite token |
| `/doctor/*`, `/service/*`, `/reservation/*` | Deep-link / app handoff |

## Baseline Lighthouse scores (selected)

Full raw table: `lighthouse-reports/baseline/summary.md`

| Route | Device | Perf | A11y | BP | SEO | LCP (ms) | TBT (ms) | CLS |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | mobile | 80 | 88 | 100 | 100 | 4655 | 184 | 0 |
| `/` | desktop | 99 | 96 | 100 | 100 | 878 | 6 | 0.003 |
| `/about` | mobile | 37 | 93 | 73 | 100 | 96983 | 4478 | 0 |
| `/about` | desktop | 62 | 93 | 73 | 100 | 3627 | 277 | 0.003 |
| `/booking` | mobile | 40 | 93 | 58 | 100 | 10152 | 1792 | 0 |
| `/booking` | desktop | 69 | 93 | 58 | 100 | 2173 | 344 | 0.003 |
| `/contact` | mobile | 72 | 100 | 96 | 92 | 5731 | 280 | 0.083 |
| `/offers` | mobile | 69 | 96 | 100 | 100 | 7130 | 312 | 0 |
| `/categories` | mobile | 59 | 95 | 100 | 100 | 5859 | 784 | 0 |
| `/blog` | mobile | 61 | 91 | 77 | 100 | 5689 | 685 | 0 |

## Initial Core Web Vitals / lab metrics (homepage mobile)

| Metric | Baseline | Target |
| --- | --- | ---: |
| LCP | 4.7 s | ≤ 2.5 s |
| FCP | 1.2 s | ≤ 1.8 s |
| TBT | 184 ms | ≤ 200 ms |
| CLS | 0 | ≤ 0.1 |
| Speed Index | 2.4 s | ≤ 3 s |
| TTFB (doc) | ~360 ms | — |
| Main-thread work | ~5.3 s | — |
| Total byte weight | ~3.2 MB | — |

INP was not measured by Lighthouse lab; field INP / interaction testing required separately.

## Main bottlenecks (ranked)

1. **20 MB `about.svg` photo-SVG** loaded as About fallback → catastrophic mobile LCP (~96 s) and ~22 MB page weight on `/about`.
2. **Booking mega-bundle** (~712 kB FLJS) including all steps, maps modals, and `@react-pdf/renderer` → TBT 1.8–2.0 s mobile.
3. **Success / invoice PDF + canvas libs** in initial JS (`success` ~613 kB FLJS).
4. **Site-wide `force-dynamic` + `cache: "no-store"`** → elevated TTFB on every request.
5. **Shared client hydration** (i18n namespaces + Framer Motion + layout chrome) → ~5 s main-thread work on marketing pages.
6. **Contact Google Maps** in critical JS path (~286 kB FLJS).
7. **Accessibility** shortfalls: color-contrast, target-size, aria-required-children (homepage mobile A11y 88).
8. **Best Practices** depressed on localhost by HTTPS + third-party cookie audits (GTM/Clarity) + missing source maps.

## Parallel workers used for discovery

| Worker | Focus | Agent |
| --- | --- | --- |
| A | Route inventory + architecture | explore `2a040c3f-c5ad-49c9-b6e2-ad660bf2e21e` |
| B | JS / hydration opportunities | explore `6802885e-b9cf-41be-9bc0-0a6659182ea7` |
| C | Images / fonts / assets | explore `7ee0d4d0-c2d3-4249-8885-8ff2bda1d014` |
