# Performance Summary

**Project:** Home Healers website  
**Date:** 2026-11-12  
**Mode:** Production local (`next build` / `next start`)  
**Parallel work:** Discovery explore agents + implementation agents (booking JS, page splitting, caching/i18n) with sequential merge

## Coverage

| Metric | Count |
| --- | ---: |
| Distinct routes in paired before/after table | 22 path variants (AR/EN marketing + booking + shells) |
| Mobile audits (paired) | 22 |
| Desktop audits (paired) | 22 |
| Total paired audits | 44 |
| Baseline deep-link `/home` attempts | 4 (null scores — blocked / non-standard) |
| Token/payment detail routes | Not audited (no valid IDs) |

## Scorecard vs 90+ targets

| Outcome | Count |
| --- | ---: |
| Performance ≥ 90 (after) | **21 / 44** |
| All four categories ≥ 90 (after) | **16 / 44** |
| Below Performance 90 | **23 / 44** (mostly mobile) |

Desktop marketing pages largely already ≥90 before; largest gains are booking desktop, about desktop, categories/blog mobile, doctors-apply mobile.

## Improvement statistics (Performance category)

| Stat | Value |
| --- | ---: |
| Average delta | **+4.3** points |
| Median delta | **0** (many desktop pages already ~97–100) |
| Largest gains | `/en/booking` desktop **31→73**; `/about` desktop **62→93**; `/about` mobile LCP **96.9s→9.0s** |

## Most impactful optimizations

1. **Replace 20 MB about photo-SVG with 63 KB composed WebP** — eliminated catastrophic `/about` LCP.
2. **Booking / success / invoice dynamic imports** — FLJS cuts of hundreds of kB; booking desktop Perf +16.
3. **ISR `revalidate: 60` for public GETs + marketing routes** — TTFB ~360→~60 ms when warm.
4. **Defer contact Google Maps** and below-fold home/about sections.
5. **Hero quality 80 + WebP fallbacks** for static marketing images.

## Remaining limitations

- Mobile lab LCP still typically **4–7 s** on content pages under Lighthouse throttling; shared client bundle (~255–260 kB FLJS) + Framer/Swiper hydration dominate.
- Booking remains below 90 on mobile; further gains need Step1 weight reduction and/or less chrome on that route without UX change.
- Accessibility 88 on homepage/doctors-apply cannot be fixed without intentional visual/contrast/tap-target changes.
- Localhost Best Practices understates production HTTPS.
- Field **INP** not measured in this engagement.
- CMS detail URLs should be added to the next automated audit pass.

## Visual / functional verdict

No intentional redesign. Spot-checked home, about, and booking in browser after changes; RTL layout and primary interactions intact. Booking tour modal still presents as before.

## Final overall verdict

**Partial target attainment with material, verified gains.**

The site is **measurably faster** where the worst bottlenecks were (about SVG, booking/success JS, TTFB). It does **not** yet clear 90+ Performance on most **mobile** routes under lab conditions, primarily due to remaining shared JS main-thread cost—not due to faked scores or removed features.

**Recommended next increments (still design-safe):**

1. Replace remaining Framer fade-ins with CSS where motion is opacity-only.  
2. Route-scoped i18n providers for booking/review namespaces.  
3. Slim about RSC payload (doctors/FAQ).  
4. Re-audit with discovered dynamic slugs + median of 3 runs.  
5. Production HTTPS Lighthouse + CrUX for INP.
