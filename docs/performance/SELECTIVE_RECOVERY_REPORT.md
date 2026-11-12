# Selective Recovery Report

**Date:** 2026-11-12  
**Goal:** Restore original design and functionality after Lighthouse optimization, retaining only verified design-safe performance improvements.  
**Priority:** Original design/functionality > Lighthouse scores.  
**Git commits/pushes/deploys:** None authorized beyond an accidental backup snapshot documented below.

---

## 1. Verified backup

| Item | Value |
|------|--------|
| **Design baseline** | `ecd1c25` — *handel updates on invoice* |
| **Pre-recovery WIP snapshot** | `c7cd502` / branch `backup/pre-selective-recovery` |
| **Filesystem mirror** | `D:\homeHellars-Website-backup-pre-selective-recovery` (`src/`, `docs/`, `scripts/`, key `public` assets) |
| **Existing stash (untouched)** | `stash@{0}: On main: lightHouse` |
| **Current `main` tip** | `c7cd502` (see note below) |

### Important Git note

While creating the mandatory backup, staging the full tree produced commit **`c7cd502`** on `main` (`BACKUP: pre-selective-recovery WIP…`). That commit **is** the recoverable pre-recovery snapshot and is also pointed to by `backup/pre-selective-recovery`.

Recovery edits were then applied in the **working tree** (no further commits). `main` is therefore **ahead of `origin/main` by 1** (the backup commit). A mixed/hard reset was **not** used (blocked / forbidden by recovery rules).

### How to restore the pre-recovery WIP (if needed)

```bash
# Option A — checkout the backup branch (detached or new branch from it)
git switch -c restore-lighthouse-wip backup/pre-selective-recovery

# Option B — restore files into the current worktree from the backup ref
git restore --source=backup/pre-selective-recovery --worktree --staged .

# Filesystem mirror (code/assets/docs without full lighthouse-reports bulk)
# D:\homeHellars-Website-backup-pre-selective-recovery
```

### How to continue from the recovered working tree (when you authorize)

Keep working-tree recovery as-is. Optionally later (with your approval): move `main` back to `ecd1c25` and create a new recovery commit so history is clean—**not done in this pass**.

---

## 2. What was restored (exact)

Restored from `ecd1c25` via selective `git checkout ecd1c25 -- <paths>`:

### Images / visual references

- `Hero.tsx` — `rating.svg`, quality **90**, `HeroCarousel` (not deferred)
- `DownloadApp.tsx` — `landing_page_01.svg` + Framer motion
- `AboutAppTwoColumns.tsx` — `about.svg` background composition
- `image-url.ts` — hero fallback `hero.svg`
- `MapComponent.tsx` — marker `hero.svg`
- `globals.css` — banner `hero-bg-main.png` / `hero-layer-2.png`; removed CSS reveal/hh-* motion layer
- `WorldCupLogoBadge.tsx` — original `world cup logo.png` + dimensions
- `WorldCupAside/index.tsx` — original `worldCup aside.png` + dimensions
- `doctors-apply/page.tsx` — restored medical-pattern overlay (kept `revalidate = 60`)

### Animations (Framer Motion)

Homepage, AboutUs, layout, blog, categories, landing, forms, invoice, etc., including:

`AboutApp`, `AppRating`, `Bannar`, `BeCloser`, `Card`, `OurStory`, `ReservationReviewsSection`, AboutUs sections/cards, `Footer`, `MobileMenu`, `LanguageChanger`, `BlogAnimationSection`, `CategoriesGrid`, `LandingHero`, `doctor-registration-form`, `invoiceView`, booking step/modals, …

### Functional architecture

- `Providers/index.tsx` — full i18n namespaces, `ThemeProvider`, `RamadanProvider`, immediate `Toaster`
- `Providers/theme-provider.tsx` — restored (was deleted)
- `[locale]/layout.tsx` — `force-dynamic`, blog canonical link, preconnects as baseline
- `booking/page.tsx` — direct `BookingFlow` (no `ssr:false` shell)
- `contact/page.tsx` — non-deferred map wiring
- Shared layout / homepage / about pages as baseline where previously rewritten

### `next.config.mjs`

- Removed `productionBrowserSourceMaps: true` (Lighthouse BP-only; not a UX win)

---

## 3. What was removed (exact)

### Unused campaign source (orphaned after restore)

- `src/Providers/{deferred-toaster,reveal-observer,route-translations,themed-toaster}.tsx`
- Route i18n `layout.tsx` files under homepage/blog/booking/contact/offers/success/failed/canceled/review/…
- `DeferredHeroCarousel.tsx`, `LazyReservationReviews.tsx`, `booking-flow-shell.tsx`, `DeferredMap.tsx`
- AboutUs splits: `DoctorsBrowser`, `DoctorsCarousel`, `PartnersCarousel`, `PartnersSwiper`, `faq-list`, `lazy-mount`, `reveal`
- `BlogShowMore.tsx`, `MobileDrawer.tsx`, `components/booking/idle.ts`, `lib/image-host.ts`
- Asset conversion scripts: `extract-svg-rasters.mjs`, `optimize-heavy-assets.mjs`, `rasterize-about-svg.mjs`

### Generated WebP assets (unused after reference restore; originals kept)

- `public/assets/images/homehellers/{rating,landing_page_01,hero,about,about-composed}.webp`
- `public/assets/images/shared/hero-banner/{hero-bg-main,hero-layer-2}.webp`
- `public/world-cup-logo.webp`, `public/worldCup-aside.webp`
- `public/assets/images/articles/1.webp` (unreferenced)

### Excess Lighthouse artifacts

- Deleted dirs: `continuation-r1`…`r4`, `final-pass2`, `about-render.html`
- **Kept:** `lighthouse-reports/baseline/`, `lighthouse-reports/final/`, docs under `docs/performance/`, audit scripts `lighthouse-focused.mjs` / `lighthouse-full-audit.mjs` / `gen-comparison-table.mjs`

---

## 4. What was retained (exact)

Design-safe / non-visual (or low-risk) improvements still differing from `ecd1c25`:

| Path | Reason |
|------|--------|
| `src/app/api/api.ts` | Public GET `revalidate: 60`; mutations/auth/`noCache` stay `no-store` |
| Public pages `revalidate = 60` | blog, categories (+slugs), offers (+slug), privacy, terms, doctors-apply, `[slug]` — CMS freshness tradeoff accepted |
| `src/lib/public-payload.ts` | Payload slimming helpers (incl. `slimDoctorForAbout` unused helper kept) |
| `src/components/AnalyticsScripts.tsx` | Interaction-gated + staggered Clarity (no layout change) |
| `BlogSection.tsx` | `next/image` fill for article hero (parent already `relative` + fixed height) |
| Blog detail metadata | Page-level `alternates.canonical` (SEO; non-visual) |
| `src/utils/doctor-helpers.ts` | Fallback image → `doctorMale.jpeg` (unrelated correctness fix) |
| `package.json` / `yarn.lock` | DevDeps `lighthouse`, `chrome-launcher` for audits |

Homepage / about / root layout remain **`force-dynamic`** as in baseline (not forced onto ISR).

---

## 5. Unrelated changes preserved

- `src/utils/doctor-helpers.ts` gender/fallback image fix (not a Lighthouse visual rewrite).

---

## 6. Decision log (significant)

| Decision | Why |
|----------|-----|
| Prefer `ecd1c25` file restore over full tree reset | Avoid wiping retained safe caching; honor no-full-reset rule |
| Restore all Framer surfaces | CSS reveal was not demonstrably equivalent (springs, reduced-motion, mobile simplify) |
| Delete generated WebPs | Proven visual mismatch (`rating.webp`); originals intact |
| Keep API/page `revalidate: 60` | Measurable TTFB benefit; auth skip path present; public CMS only |
| Revert source maps flag | Cost without user-facing benefit |
| Restore providers/i18n wholesale | Route-scoped i18n + Theme/Ramadan removal were functional risks |
| Restore booking without shell | Avoid hydration flash / interaction regressions |
| Keep analytics deferral | Non-visual; reduces main-thread contention |
| Trim continuation LH reports | Artifacts; baseline+final sufficient |

---

## 7. Visual regression verification

Production build: **passed** (`yarn build`, Next.js 15.2.8).

Server: `http://localhost:3001` (recovered build).

| Surface | Result |
|---------|--------|
| `/` AR homepage | Hero, `rating.svg` avatars+stars, nav, CTAs, offers rail render; RTL OK |
| `/en` | LTR copy/nav OK; hero rating badge present |
| `/about` | Page hero banner + content loads (heavy `about.svg` expected) |
| `/booking` | Specialty step SSR/interactive (search, categories, next) — not blank shell |
| `rating.svg` URL | Served from production server |
| Broken WebP refs in `src/` | **None** |

Compared against prior QA screenshots under `docs/performance/screenshots/` and baseline design intent: critical image/animation/provider regressions from the optimization campaign are reversed.

**Manual follow-up still recommended:** pixel-diff World Cup PNG vs prior WebP at 2x; scroll-trigger Framer on mobile reduced-motion; dark/Ramadan seasonal chrome if currently inactive.

---

## 8. Functional verification

| Check | Result |
|-------|--------|
| Production build + type/lint gate | Pass (existing warnings only) |
| Nav + language control present | Pass |
| Booking specialty selection UI | Pass |
| ThemeProvider / RamadanProvider mounted | Pass (code restored) |
| Global i18n namespaces restored | Pass |
| Blog canonical in root layout | Pass (restored) |
| Console / broken assets smoke | No broken images spotted on home; SVG rating loads |

Full payment/invoice E2E with live credentials was **not** run (safe test data constraint).

---

## 9. Lighthouse comparison (representative)

Lab: localhost:3001, **1 run** per route/device (`lighthouse-reports/recovery/`). Single-run variance is high—use directionally.

### Home `/` mobile Perf

| Era | Perf | LCP (ms) |
|-----|-----:|---------:|
| Baseline (`ecd1c25` era lab) | 80 | 4655 |
| Optimization final | 78 | 4887 |
| **Recovered** | **94** | **1940** |

Recovered home mobile improved vs prior labs (retained caching/analytics + lab noise). **Not** used as license to re-introduce visual WebP swaps.

### About `/about` mobile Perf

| Era | Perf | LCP (ms) |
|-----|-----:|---------:|
| Baseline | 37 | ~96983 |
| Optimization final | 44 | ~95932 |
| **Recovered** | **42** | **~95779** |

Restoring original `about.svg` brings back the known heavy-LCP characteristic—**accepted** under design-first policy.

### Booking `/booking` mobile Perf

| Era | Perf | Notes |
|-----|-----:|-------|
| Baseline | 40 | |
| Optimization final | 48 | shell/defer experiments |
| **Recovered** | **20** | Full Framer/booking JS restored; 1-run + high CLS in this lab pass |

Scores below 90 are **acceptable** for this recovery. No further perf changes were made after seeing these numbers.

Full table: `lighthouse-reports/recovery/summary.md`.

---

## 10. Remaining issues for manual review

1. **`main` tip is backup commit `c7cd502`** — decide whether to reset tip to `ecd1c25` and recommit recovery (needs your approval).
2. **About page LCP** still dominated by original SVG — design choice; any future asset work needs design-approved exports, not lossy auto-WebP.
3. **Booking mobile lab CLS/Perf** volatile; validate interactions manually on device.
4. **`slimDoctorForAbout`** currently unused after AboutUs restore — safe to delete later or wire intentionally.
5. **Ramadan season** inactive in constants — provider restored but seasonal UI may still be off.
6. **Pixel QA** for World Cup PNGs and DownloadApp SVG animation springs vs memory of pre-campaign site.
7. Do **not** re-enable generated `rating.webp`.

---

## 11. Current tree vs baseline (src)

Files still differing from `ecd1c25` (retained intentionally):

```
package.json
yarn.lock
src/app/api/api.ts
src/components/AnalyticsScripts.tsx
src/lib/public-payload.ts
src/utils/doctor-helpers.ts
src/app/[locale]/(SharedLayout)/[slug]/page.tsx
src/app/[locale]/(SharedLayout)/blog/**
src/app/[locale]/(SharedLayout)/categories/**
src/app/[locale]/(SharedLayout)/doctors-apply/page.tsx
src/app/[locale]/(SharedLayout)/offers/**
src/app/[locale]/(SharedLayout)/privacy/page.tsx
src/app/[locale]/(SharedLayout)/terms/page.tsx
```

Plus docs/scripts/lighthouse report artifacts as documented.

---

## 12. Stop line

Recovery complete for this pass: **original visual/animation/provider architecture restored**, **unsafe generated assets removed**, **safe caching/analytics retained**, **build verified**, **representative Lighthouse captured**.

Awaiting your approval before: commit, push, deploy, or any further performance work.
