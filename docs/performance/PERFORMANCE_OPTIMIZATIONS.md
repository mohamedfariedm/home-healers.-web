# Performance Optimizations

**Date:** 2026-11-12  
**Constraint:** Zero intentional visual redesign; preserve layout, motion intent, and functionality.

Parallel implementation used independent agents with non-overlapping file ownership, then sequential integration + rebuild.

## Summary of impact (measured)

| Area | Before | After |
| --- | --- | --- |
| Booking First Load JS | ~712 kB | ~168 kB |
| Success First Load JS | ~613 kB | ~124 kB |
| Invoice First Load JS | ~283 kB | ~126 kB |
| Contact First Load JS | ~286 kB | ~255 kB (map deferred) |
| Homepage TTFB (lab) | ~360 ms | ~60 ms (after ISR warm) |
| `/about` mobile LCP | ~96,983 ms | ~9,008 ms |
| `/about` desktop Perf | 62 | 93 |
| `/booking` desktop Perf | 69 | 85 |
| `/doctors-apply` mobile Perf | 82 | 92 |
| Avg Perf delta (44 paired audits) | — | **+4.3** points |

## Optimizations implemented

### 1. Booking route code-splitting — Agent B (`12d406b7-da47-4e59-a96e-2f20b94d6606`)

**Files**

- `src/app/[locale]/(SharedLayout)/booking/_components/booking-flow.tsx`
- `src/app/[locale]/(SharedLayout)/booking/_components/steps/step6-confirmation.tsx`

**Change**

- Steps 2–6 and modals loaded via `next/dynamic`.
- Step 1 kept static for first-paint readiness.
- `@react-pdf/renderer` moved behind `await import()` inside receipt download.

**Expected / measured**

- Expected: large unused-JS + TBT reduction on `/booking`.
- Measured: FLJS 712→168 kB; unused JS savings 1310→333 KiB; mobile Perf 40→45; desktop 69→85; LCP mobile 10152→7535 ms.

### 2. Success + invoice on-demand PDF/canvas — Agent (`2a2990b2-8e47-4961-b607-dbda5810210f`)

**Files**

- `src/components/success.tsx`
- `src/components/invoiceView.tsx`

**Change**

- Dynamic `import("@react-pdf/renderer")` for receipt generation.
- Dynamic `import("html2canvas")` + `import("jspdf")` inside invoice download.

**Measured:** Success FLJS 613→124 kB; Invoice 283→126 kB.

### 3. Homepage / about / contact / LCP image splits — Agent (`f5f060c8-41c0-45a8-8949-faf1631ebcc2`)

**Files**

- `src/app/[locale]/(SharedLayout)/(homepage)/page.tsx`
- `src/app/[locale]/(SharedLayout)/about/page.tsx`
- `src/app/[locale]/(SharedLayout)/contact/page.tsx`
- `src/app/[locale]/(SharedLayout)/contact/_components/DeferredMap.tsx` *(follow-up fix)*
- `src/app/[locale]/(SharedLayout)/blog/[blogID]/_components/BlogSection.tsx`
- `src/components/LandingPage/sections/LandingHero.tsx`

**Change**

- Dynamic import `AboutApp`, `Bannar` (home); below-fold About sections.
- Contact map via client `DeferredMap` (`ssr: false`) — fixed Next 15 restriction on `ssr:false` in Server Components.
- Blog + landing hero `<img>` → `next/image` with `priority` + `sizes`.

### 4. Caching / ISR + i18n trim — Agent (`c0bbdcf4-1c6b-45e0-b370-24d5fe7cce01`)

**Files**

- `src/app/api/api.ts`
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/(SharedLayout)/layout.tsx`
- Marketing pages (`homepage`, `about`, `contact`, `blog`, `categories`, `offers`, `privacy`, `terms`, plus later detail pages)
- `src/Providers/index.tsx`
- New: `blog/layout.tsx`, `blog/[blogID]/layout.tsx`

**Change**

- Public GETs: `next: { revalidate: 60 }` (auth/`noCache`/mutations stay `no-store`).
- Replaced many `force-dynamic` exports with `revalidate = 60`.
- Removed root `headers()` blog-canonical path (moved to blog layouts) so the whole tree is not forced dynamic.
- Removed unused `aboutUs` from global client i18n namespaces; dropped unused `RamadanProvider` wrap.

**Measured:** Homepage TTFB ~360→~60 ms after warm cache.

### 5. Asset compression (photo-SVGs / World Cup) — main agent + scripts

**Files / assets**

- `scripts/extract-svg-rasters.mjs`, `scripts/rasterize-about-svg.mjs`
- `public/assets/images/homehellers/about-composed.webp` (full composition, 20.2 MB → 63 KB)
- `public/assets/images/homehellers/hero.webp`, `landing_page_01.webp`, `articles/1.webp`
- `public/world-cup-logo.webp`, `public/worldCup-aside.webp`
- References updated in `DownloadApp.tsx`, `image-url.ts`, `AboutAppTwoColumns.tsx`, `MapComponent.tsx`, `WorldCupLogoBadge.tsx`, `WorldCupAside/index.tsx`
- Hero quality 90→80 in `Hero.tsx`

**Change**

- Extracted embedded rasters / Chrome-rasterized full about composition to WebP at display sizes.
- Kept original SVGs/PNGs on disk; runtime references prefer WebP.

**Measured:** `/about` mobile LCP 96983→9008 ms; desktop Perf 62→93.

### 6. Additional route ISR coverage — main agent

Converted remaining content detail pages from `force-dynamic` to `revalidate = 60`:

- `blog/[blogID]`, `categories/[slug]`, `categories/[slug]/[serviceSlug]`, `offers/[slug]`, `doctors-apply`, `[slug]` landing

Kept `force-dynamic` for booking, invoice, success/failed/canceled, review, invite-doctor, offer book.

## Reverted / avoided changes

| Idea | Outcome |
| --- | --- |
| Replace about fallback with photo-only `about.webp` | Rejected initially (lost SVG chrome). Replaced with **composed** `about-composed.webp` instead. |
| Delete unused MP4s from `public/` | Not deleted (safe deploy-size win) — left for explicit product decision |
| A11y color-contrast / larger tap targets | Deferred — would change visual design |
| Remove Framer Motion site-wide | Deferred — high regression risk vs motion preservation requirement |
| Fabricate HTTPS Best Practices on localhost | Not done; documented as environment artifact |

## Build verification

- `yarn build` succeeded after fixes (`DeferredMap` client wrapper required for `ssr: false`).
- Production server served audited routes with HTTP 200 after warm-up.
- Visual QA screenshots: `docs/performance/screenshots/` (home, about, booking).
