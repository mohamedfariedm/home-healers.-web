# Performance Change Audit (Read-Only)

**Status:** Optimization work STOPPED. This document is an investigation only.  
**Date:** 2026-11-12  
**Priority:** Original design and functionality over Lighthouse scores.  
**Action taken:** None beyond writing this report. No restores, resets, commits, pushes, or deploys.

---

## 1. Git comparison baseline

| Item | Value |
|------|--------|
| **Baseline commit** | `ecd1c25` — *handel updates on invoice* (2026-11-09) |
| **Current HEAD** | Same as baseline (`ecd1c25`). All Lighthouse work is **uncommitted** in the working tree. |
| **Comparison command** | `git diff ecd1c25` / `git diff HEAD` (equivalent while HEAD == baseline) |
| **Branch** | `main` |
| **Related stash** | `stash@{0}: On main: lightHouse` (exists; not inspected as the primary baseline; treat as optional recovery artifact) |

### Why this baseline

- `ecd1c25` is the tip of `main` before the uncommitted Lighthouse campaign.
- There are **no intermediate commits** between baseline and current tree for this work; the entire optimization surface is working-tree + untracked files.
- Do **not** assume every dirty file is purely performance-related without classification (see inventory). Most tracked diffs align with the Lighthouse effort; a few (e.g. invoice/doctor helpers) need verification against intent.

### Diff scale (tracked)

| Metric | Count |
|--------|------:|
| Modified tracked files | **71** |
| Deleted tracked files | **1** (`src/Providers/theme-provider.tsx`) |
| Insertions / deletions (tracked) | **+2467 / −1819** |
| Untracked files (approx.) | **~467** (dominated by `lighthouse-reports/` JSON/HTML + screenshots) |

---

## 2. Executive verdict

The Lighthouse work mixed **real caching/bundle wins** with **high visual-risk asset replacements** and **broad animation/provider refactors**. Several generated WebP files (notably `rating.webp`) do **not** match original SVG/PNG composition. User confirmation: keep `/assets/images/homehellers/rating.svg`; do not use the generated `rating.webp`.

**Design and interaction fidelity are at risk.** Do not treat the working tree as “safe to ship” without selective revert of image + motion + provider changes.

---

## 3. High-risk changes (priority)

### 3.1 Image replacements (VISUAL RISK — confirmed / likely)

| Active reference | Original still on disk | Generated asset | Why risky | Recommendation |
|------------------|------------------------|-----------------|-----------|----------------|
| `Hero.tsx` → `rating.webp` | `rating.svg` (149 KB) | `rating.webp` (6 KB) | User: generated image ≠ original SVG | **REVERT reference to `rating.svg`**; delete or ignore WebP |
| `DownloadApp.tsx` → `landing_page_01.webp` | `landing_page_01.svg` (1.5 MB) | WebP 12 KB | Rasterization of complex SVG; composition/quality likely changed | **REVERT to SVG** or re-export with visual QA |
| `image-url.ts` + map marker → `hero.webp` | `hero.svg` (1.4 MB) | WebP 68 KB | Fallback + Google Maps pin; soft edges/alpha may differ | **Investigate**; prefer SVG for marker if crispness matters |
| `AboutAppTwoColumns.tsx` → `about-composed.webp` (+ `next/image`) | `about.svg` (20 MB) | `about.webp` / `about-composed.webp` (~62 KB) | Background-image → `Image` fill; composed raster ≠ vector layers | **REVERT path + rendering approach** after visual QA |
| `globals.css` → `hero-bg-main.webp`, `hero-layer-2.webp` | matching `.png` | WebP smaller | Banner atmosphere / soft gradients often degrade | **Investigate / likely revert** |
| `WorldCupLogoBadge` → `world-cup-logo.webp` | `world cup logo.png` (2.8 MB) | 18 KB; dims 256×384 (was 1024×1536) | Compression + metadata size change; CSS still constrains height | **Investigate**; size win is large but visual QA required |
| `WorldCupAside` → `worldCup-aside.webp` | `worldCup aside.png` (2.7 MB) | 180 KB; 800×1200 | Same | **Investigate** |
| Untracked `articles/1.webp` | — | — | **Not referenced in `src/`** | **UNNECESSARY** — discard |

**Originals were not deleted** — recovery of references is low-cost if code is reverted.

### 3.2 Loading / deferred UI (VISUAL + FUNCTIONAL RISK)

| Change | Risk | Notes |
|--------|------|-------|
| `Hero` → `DeferredHeroCarousel` | VISUAL / FUNCTIONAL | Carousel may mount late; LCP image quality lowered **90 → 75** |
| `booking/page.tsx` → `booking-flow-shell` (`ssr: false` pattern) | FUNCTIONAL / VISUAL | Booking UI hydration flash / SEO / CLS |
| `DeferredMap` / contact map dynamic load | FUNCTIONAL / VISUAL | Map appears later; marker uses `hero.webp` |
| Homepage `LazyReservationReviews` / deferred sections | VISUAL | Below-fold delay; verify no empty layout jump |
| `AnalyticsScripts` deferral | FUNCTIONAL (analytics) | May delay tracking; usually SAFE for UX if intentional |

### 3.3 Global providers / i18n / theme (FUNCTIONAL RISK)

| Change | Classification | Detail |
|--------|----------------|--------|
| Removed `ThemeProvider` + deleted `theme-provider.tsx` | FUNCTIONAL RISK | Forced light theme removed; next-themes stack gone |
| Removed `RamadanProvider` from tree | FUNCTIONAL RISK | Ramadan seasonal behavior may no longer wrap the app |
| Global i18n namespaces → `"common"` only + per-route `RouteTranslations` | FUNCTIONAL RISK | Missing route layout = missing client strings |
| Blog canonical `<link>` removed from `[locale]/layout.tsx` | FUNCTIONAL / SEO RISK | Unrelated to Core Web Vitals; may hurt SEO |
| `force-dynamic` → `revalidate = 60` on root layout | FUNCTIONAL RISK (data freshness) | Pages/API can serve stale CMS data up to 60s |
| `ClientAPI` `no-store` → `next: { revalidate: 60 }` (with skipCache for auth/mutations) | FUNCTIONAL RISK | Correctness depends on `skipCache` covering all private GETs |
| `productionBrowserSourceMaps: true` | SAFE-ish / cost | Best Practices score; increases build artifact size |

### 3.4 Framer Motion → CSS reveal (VISUAL RISK)

~20+ components replaced `framer-motion` with `.reveal` / `.reveal-item` + `RevealObserver` and new keyframes in `globals.css` (`hh-fade-in`, `hh-star-pulse`, `hh-cta-wiggle`, etc.).

**Risk:** Spring physics, reduced-motion shortcuts, and mobile `simplifyMotion` paths were removed or approximated. Animations will feel different even if end states look similar.

---

## 4. Categorized inventory

Legend: **Retain / Revert / Investigate / Discard** = recommendation only (not executed).

### 4.1 SAFE — likely keep (after smoke test)

| File / area | Why changed | Necessary? | Rec |
|-------------|-------------|------------|-----|
| `src/app/api/api.ts` (selective revalidate) | Cut TTFB / RSC wait | Yes for perf, if auth skip is complete | **Investigate then retain** |
| Route `revalidate = 60` on public pages | ISR vs force-dynamic | Yes for TTFB | **Investigate then retain** |
| `src/lib/public-payload.ts` / cached helpers | Payload caching | Likely | **Investigate** |
| `AnalyticsScripts.tsx` defer | Reduce main-thread contention | Likely | **Retain** if analytics still fire |
| `next.config.mjs` source maps | Lighthouse BP | Optional | **Revert** if build size matters; not a UX fix |
| DevDeps: `lighthouse`, `chrome-launcher` | Local audits | Dev-only | **Retain or move to optional** — not runtime |

### 4.2 VISUAL RISK — image & CSS references

| File | Change | Rec |
|------|--------|-----|
| `Hero.tsx` | `rating.webp`, quality 75, deferred carousel | **Revert rating**; investigate quality/carousel |
| `DownloadApp.tsx` | WebP screenshot + CSS reveal | **Revert image**; investigate motion |
| `AboutAppTwoColumns.tsx` | `about-composed.webp` + `next/image` | **Revert** to prior SVG background approach unless pixel-matched |
| `src/lib/image-url.ts` | hero fallback WebP | **Revert** to `.svg` unless verified |
| `MapComponent.tsx` | marker `hero.webp` | **Revert** or QA marker |
| `globals.css` | hero-banner WebP URLs + reveal CSS | **Revert WebP URLs**; reveal CSS tied to motion rewrite |
| `WorldCupLogoBadge.tsx` / `WorldCupAside` | PNG→WebP + width/height | **Investigate** |
| Untracked WebPs under `public/` | Generated assets | **Discard unused**; keep originals |

### 4.3 VISUAL RISK — motion / layout components (framer removal)

Modified (representative):

- Homepage: `AboutApp`, `AboutAppTwoColumns`, `AppRating`, `Bannar`, `BeCloser`, `Card`, `DownloadApp`, `OurStory`, `ReservationReviewsSection`, …
- AboutUs: `DoctorsSection`, `FaqSection`, `FeaturesSection`, `PartnersSection`, cards, faq-item, `index`
- Layout: `Footer`, `MobileMenu`, `LanguageChanger`
- Other: `BlogAnimationSection`, `CategoriesGrid`, `LandingHero`, `doctor-registration-form`, `invoiceView`, …

**Rec:** **Investigate as a group**. Prefer **revert motion layer** if design parity is required; keep only if product accepts CSS approximations.

### 4.4 FUNCTIONAL RISK — providers, booking, about splits

| File | Why | Rec |
|------|-----|-----|
| `src/Providers/index.tsx` | Theme/Ramadan removed; toaster deferred; RevealObserver | **Revert theme/Ramadan** unless intentionally retired |
| `src/Providers/theme-provider.tsx` | **Deleted** | **Restore** if theme stack needed |
| New: `reveal-observer.tsx`, `route-translations.tsx`, `deferred-toaster.tsx`, `themed-toaster.tsx` | Support refactors | Keep only with matching architecture; else revert |
| New route `layout.tsx` files (homepage, blog, booking, contact, offers, …) | Scoped i18n | **Investigate**; incomplete coverage = broken copy |
| `booking-flow-shell.tsx` + `booking-flow.tsx` | Dynamic import / idle | **Investigate** heavily |
| AboutUs splits: `DoctorsBrowser`, carousels, `lazy-mount`, `faq-list`, `reveal` | Code-splitting | **Investigate** interaction parity |
| `MobileDrawer.tsx` | Extract from MobileMenu | **Investigate** |
| `[locale]/layout.tsx` | revalidate + removed blog canonical | **Revert canonical removal**; decide ISR separately |

### 4.5 GENERATED ARTIFACT

| Path | Notes | Rec |
|------|-------|-----|
| `lighthouse-reports/**` (~400+ files) | Lab JSON/HTML/screenshots | **Discard** from product tree or gitignore; keep a small curated set if needed |
| `docs/performance/screenshots/*` | QA captures | Artifact |
| `docs/performance/LIGHTHOUSE_*.md`, `PERFORMANCE_*.md` (prior) | Campaign docs | Keep as history; not runtime |
| `scripts/lighthouse-*.mjs`, `optimize-heavy-assets.mjs`, `rasterize-about-svg.mjs`, `extract-svg-rasters.mjs`, `gen-comparison-table.mjs` | Generator/audit tooling | Keep offline; do not ship as product dependency |
| `public/**/*.webp` listed above | Generated replacements | Treat as suspect until visual sign-off |

### 4.6 UNNECESSARY / redundant

| Item | Why |
|------|-----|
| `public/assets/images/articles/1.webp` | No `src` reference found |
| `about.webp` if only `about-composed.webp` is used | Possible duplicate intermediate |
| Parallel AboutUs `reveal.tsx` vs global `RevealObserver` | Overlapping abstractions |
| `PartnersCarousel` vs `PartnersSwiper` naming overlap | Possible redundancy — verify one code path |
| Mass `lighthouse-reports` in repo | No runtime benefit |

### 4.7 NEEDS VERIFICATION

| File | Question |
|------|----------|
| `src/utils/doctor-helpers.ts` | Perf-related or unrelated working-tree edit? |
| `src/components/invoiceView.tsx` | Framer removal only, or invoice logic? |
| `src/components/success.tsx`, offers teaser, MenuItemsDesktop | Scope of change vs baseline |
| Auth/private `ClientAPI` GET coverage under `skipCache` | Stale personalized data? |
| Whether Ramadan season is still required in production | Provider removal intentional? |
| `package.json` / `yarn.lock` lighthouse deps | Acceptable for team? |

---

## 5. Potential design regressions (checklist)

1. **Hero rating badge** — WebP ≠ SVG (user-confirmed).  
2. **Download app phone mock** — SVG→tiny WebP.  
3. **About section illustration** — 20 MB SVG → ~63 KB composed WebP + `object-contain` Image.  
4. **Page hero banner layers** — PNG→WebP in CSS.  
5. **World Cup logo / aside** — heavy PNG→aggressive WebP.  
6. **Map pin** — SVG→WebP at 40×40.  
7. **Hero photo quality** — quality 90→75.  
8. **All scroll-triggered / spring animations** — Framer→CSS approximations; reduced-motion path changed.  
9. **Booking first paint** — client-only shell may flash empty/skeleton.  
10. **Theme / Ramadan chrome** — providers removed.  
11. **i18n flash or missing strings** — route-scoped namespaces.  
12. **Blog SEO canonical** — link removed from root layout.

---

## 6. Recommended to retain (candidate)

Only after verification; not “ship as-is”:

- Selective **ISR / `revalidate: 60`** for **public** CMS reads (keep strict `no-store` for auth).  
- Deferred analytics / non-critical third parties.  
- Truly unused heavy assets **after** pixel-perfect re-exports approved by design (not the current SVG→lossy WebP set).  
- Audit scripts + a **small** docs archive under `docs/performance/` (including this audit).  
- Structural code-splitting that does **not** change first-viewport visuals (below-fold only), if QA passes.

---

## 7. Recommended to revert (candidate)

**Do not execute until approval.**

### Must-revert (design)

1. `Hero.tsx`: restore `rating.svg` (stop using `rating.webp`).  
2. `DownloadApp.tsx`: restore `landing_page_01.svg`.  
3. `AboutAppTwoColumns.tsx`: restore prior `about.svg` background approach (or design-approved asset).  
4. `image-url.ts` + `MapComponent.tsx`: restore `hero.svg` unless marker QA passes.  
5. `globals.css`: restore `hero-bg-main.png` / `hero-layer-2.png` URLs unless QA passes.  
6. Remove or stop referencing generated WebPs that fail visual parity.

### Strongly consider revert

7. Framer→CSS reveal across homepage/AboutUs/layout (large visual surface).  
8. Provider stack: restore `ThemeProvider` / `RamadanProvider` if still product requirements.  
9. Restore blog canonical link in `[locale]/layout.tsx`.  
10. Hero `HERO_IMAGE_QUALITY` 75→90 if photos look soft.  
11. Booking `ssr: false` shell if booking UX/SEO regresses.

### Safe to delete later (artifacts only)

12. `lighthouse-reports/**` bulk output.  
13. Unused `articles/1.webp`, failed raster intermediates.  
14. Optional: generated WebPs after references restored.

---

## 8. Safe recovery strategy (NOT EXECUTED)

Goal: restore design-critical paths **without** wiping unrelated or still-desired caching work.

1. **Freeze** — no further optimization commits; no `git reset --hard`.  
2. **Snapshot** (when approved):  
   - `git stash push -u -m "lighthouse-wip-full"` **or** create a backup branch from the dirty tree (`git switch -c backup/lighthouse-wip` after a temporary commit the user explicitly requests).  
3. **Selective restore of originals’ references** (preferred over hard reset):  
   - Checkout baseline versions of image-touching files from `ecd1c25`:  
     `Hero.tsx`, `DownloadApp.tsx`, `AboutAppTwoColumns.tsx`, `image-url.ts`, `MapComponent.tsx`, relevant `globals.css` background URL lines, World Cup components if needed.  
   - Leave ISR/`api.ts` changes aside for a second pass.  
4. **Motion / provider pass** (separate approval): restore framer + theme/Ramadan from `ecd1c25` for those paths only, if design rejects CSS reveal.  
5. **Artifact cleanup** (separate approval): delete or gitignore `lighthouse-reports/`; drop unused WebPs.  
6. **Do not** `git reset --hard ecd1c25` as first step — that would discard *all* uncommitted work including any non-perf edits and the existing `lightHouse` stash context would still need care.  
7. **Visual QA** on home, about, contact map, booking, World Cup chrome (AR + EN, mobile + desktop) before any new perf work.  
8. **Wait for explicit approval** before any of the above.

Existing stash `stash@{0}: lightHouse` may contain an older slice of this work — treat as secondary; prefer a fresh full WIP backup before selective reverts.

---

## 9. Untracked / new source files (summary)

**App / providers / layouts:**  
`deferred-toaster.tsx`, `reveal-observer.tsx`, `route-translations.tsx`, `themed-toaster.tsx`, many route `layout.tsx`, `DeferredHeroCarousel.tsx`, `LazyReservationReviews.tsx`, `booking-flow-shell.tsx`, `DeferredMap.tsx`, AboutUs split components, `MobileDrawer.tsx`, `BlogShowMore.tsx`, `idle.ts`, `image-host.ts`, homepage `layout.tsx`.

**Public assets (generated):**  
`rating.webp`, `landing_page_01.webp`, `hero.webp`, `about.webp`, `about-composed.webp`, `hero-bg-main.webp`, `hero-layer-2.webp`, `world-cup-logo.webp`, `worldCup-aside.webp`, `articles/1.webp`.

**Docs / scripts / reports:**  
Prior performance markdown + screenshots; lighthouse scripts; **`lighthouse-reports/`** bulk.

---

## 10. Classification totals (approximate)

| Class | Scope |
|-------|--------|
| SAFE | Narrow: analytics defer, some ISR (pending auth verification) |
| VISUAL RISK | All WebP swaps, framer→CSS, hero quality, deferred visible UI |
| FUNCTIONAL RISK | Providers, i18n scoping, API cache, booking shell, canonical removal |
| UNNECESSARY | Unreferenced WebP(s), duplicate intermediates, overlapping reveal helpers |
| GENERATED ARTIFACT | `lighthouse-reports/**`, audit screenshots, rasterize scripts outputs |
| NEEDS VERIFICATION | invoice/doctor helper diffs, Ramadan intent, private API cache matrix |

---

## 11. Explicit user constraint captured

> Use `/assets/images/homehellers/rating.svg`, not the generated `rating.webp` — they do not match.

This audit classifies that swap as **VISUAL RISK** with recommendation **REVERT** (reference only; originals intact).

---

## 12. Stop line

- **No code fixes applied.**  
- **No Git restore/reset/commit/push/deploy.**  
- **No further Lighthouse optimization** until approval.  
- Next step requires **explicit user approval** of a recover / retain plan.
