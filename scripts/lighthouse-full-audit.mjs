import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const BASE = process.env.LIGHTHOUSE_BASE_URL || "http://localhost:3001";
const LABEL = process.env.LIGHTHOUSE_LABEL || "baseline";
const OUT_DIR = path.resolve("lighthouse-reports", LABEL);
const RUNS = Number(process.env.LIGHTHOUSE_RUNS || "3");
const FORM_FACTORS = (process.env.LIGHTHOUSE_FORM_FACTORS || "mobile,desktop")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const STATIC_PATHS = [
  "/",
  "/en",
  "/about",
  "/en/about",
  "/contact",
  "/en/contact",
  "/blog",
  "/en/blog",
  "/categories",
  "/en/categories",
  "/offers",
  "/en/offers",
  "/booking",
  "/en/booking",
  "/doctors-apply",
  "/en/doctors-apply",
  "/privacy",
  "/en/privacy",
  "/terms",
  "/en/terms",
  "/failed",
  "/en/failed",
];
// Deep-link routes (/home, /doctor, /service, /reservation) are app-handoff
// pages (often non-standard HTML) and are audited separately if needed.

function slugify(urlPath, formFactor) {
  const base =
    urlPath === "/"
      ? "home-ar"
      : urlPath.replace(/^\//, "").replace(/\//g, "_") || "page";
  return `${base}__${formFactor}`;
}

function median(values) {
  const sorted = [...values].filter((v) => typeof v === "number").sort((a, b) => a - b);
  if (!sorted.length) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function score100(score) {
  return typeof score === "number" ? Math.round(score * 100) : null;
}

function metricMs(audit) {
  return typeof audit?.numericValue === "number" ? Math.round(audit.numericValue) : null;
}

function metricUnitless(audit) {
  return typeof audit?.numericValue === "number"
    ? Number(audit.numericValue.toFixed(3))
    : null;
}

async function discoverDynamicPaths() {
  const extras = [];
  try {
    const [categories, offers, blogs, settings] = await Promise.all([
      fetch("https://backend.home-healers.com/api/categories?locale=ar").catch(() => null),
      fetch("https://backend.home-healers.com/api/packages?locale=ar&limit=1").catch(() => null),
      fetch("https://backend.home-healers.com/api/blogs?locale=ar&limit=1").catch(() => null),
      fetch("https://backend.home-healers.com/api/settings?locale=ar").catch(() => null),
    ]);

    if (categories?.ok) {
      const json = await categories.json();
      const first = json?.data?.[0];
      const slug = first?.slug?.ar || first?.slug;
      const service = first?.services?.[0];
      const serviceSlug = service?.slug?.ar || service?.slug;
      if (slug) {
        extras.push(`/categories/${encodeURIComponent(slug)}`);
        extras.push(`/en/categories/${encodeURIComponent(first?.slug?.en || first?.slug || slug)}`);
      }
      if (slug && serviceSlug) {
        extras.push(
          `/categories/${encodeURIComponent(slug)}/${encodeURIComponent(serviceSlug)}`,
        );
      }
    }

    if (offers?.ok) {
      const json = await offers.json();
      const offer = json?.data?.[0];
      const slug = offer?.slug?.ar || offer?.slug;
      const enSlug = offer?.slug?.en || offer?.slug;
      if (slug) {
        extras.push(`/offers/${encodeURIComponent(slug)}`);
        extras.push(`/offers/${encodeURIComponent(slug)}/book`);
      }
      if (enSlug) extras.push(`/en/offers/${encodeURIComponent(enSlug)}`);
    }

    if (blogs?.ok) {
      const json = await blogs.json();
      const blog = json?.data?.[0];
      const id = blog?.slug || blog?.id;
      if (id) {
        extras.push(`/blog/${encodeURIComponent(id)}`);
        extras.push(`/en/blog/${encodeURIComponent(blog?.slug_en || id)}`);
      }
    }

    if (settings?.ok) {
      const json = await settings.json();
      const landing = json?.data?.[0]?.setting?.landing_pages?.[0];
      const landingSlug = landing?.slug || landing?.path;
      if (landingSlug) {
        extras.push(`/${encodeURIComponent(String(landingSlug).replace(/^\//, ""))}`);
      }
    }
  } catch {
    // Keep static list if discovery fails.
  }
  return [...new Set(extras)];
}

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, { redirect: "manual" });
      if (res.status > 0) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`Server not reachable: ${url}`);
}

async function runLighthouse(url, formFactor) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  try {
    const options = {
      logLevel: "error",
      output: ["json", "html"],
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      port: chrome.port,
      formFactor,
      screenEmulation:
        formFactor === "desktop"
          ? {
              mobile: false,
              width: 1350,
              height: 940,
              deviceScaleFactor: 1,
              disabled: false,
            }
          : undefined,
      throttlingMethod: "simulate",
    };
    if (formFactor === "desktop") {
      options.throttling = {
        rttMs: 40,
        throughputKbps: 10 * 1024,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
      };
    }
    const result = await lighthouse(url, options);
    return result;
  } finally {
    await chrome.kill();
  }
}

function extractMetrics(lhr) {
  const cats = lhr.categories || {};
  return {
    performance: score100(cats.performance?.score),
    accessibility: score100(cats.accessibility?.score),
    bestPractices: score100(cats["best-practices"]?.score),
    seo: score100(cats.seo?.score),
    fcp: metricMs(lhr.audits?.["first-contentful-paint"]),
    lcp: metricMs(lhr.audits?.["largest-contentful-paint"]),
    tbt: metricMs(lhr.audits?.["total-blocking-time"]),
    cls: metricUnitless(lhr.audits?.["cumulative-layout-shift"]),
    si: metricMs(lhr.audits?.["speed-index"]),
    tti: metricMs(lhr.audits?.interactive),
    opportunities: Object.values(lhr.audits || {})
      .filter((a) => a?.details?.type === "opportunity" && a.score !== null && a.score < 1)
      .map((a) => ({
        id: a.id,
        title: a.title,
        savingsMs: a.details?.overallSavingsMs ?? null,
      }))
      .sort((a, b) => (b.savingsMs || 0) - (a.savingsMs || 0))
      .slice(0, 8),
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await waitForServer(BASE);
  const pages = [...STATIC_PATHS, ...(await discoverDynamicPaths())];
  const summary = [];

  console.log(`Auditing ${pages.length} routes × ${FORM_FACTORS.join("+")} (${LABEL}) against ${BASE}`);

  for (const pagePath of pages) {
    const url = `${BASE}${pagePath}`;
    for (const formFactor of FORM_FACTORS) {
      const name = slugify(pagePath, formFactor);
      const runs = [];
      console.log(`\n=== [${LABEL}] ${formFactor.toUpperCase()} ${url} ===`);
      try {
        for (let i = 0; i < RUNS; i++) {
          const result = await runLighthouse(url, formFactor);
          const lhr = result.lhr;
          const metrics = extractMetrics(lhr);
          runs.push(metrics);
          if (i === RUNS - 1) {
            await writeFile(
              path.join(OUT_DIR, `${name}.report.json`),
              result.report[0],
            );
            await writeFile(
              path.join(OUT_DIR, `${name}.report.html`),
              result.report[1],
            );
          }
        }

        const picked = {
          path: pagePath,
          url,
          formFactor,
          performance: median(runs.map((r) => r.performance)),
          accessibility: median(runs.map((r) => r.accessibility)),
          bestPractices: median(runs.map((r) => r.bestPractices)),
          seo: median(runs.map((r) => r.seo)),
          fcp: median(runs.map((r) => r.fcp)),
          lcp: median(runs.map((r) => r.lcp)),
          tbt: median(runs.map((r) => r.tbt)),
          cls: median(runs.map((r) => r.cls)),
          si: median(runs.map((r) => r.si)),
          tti: median(runs.map((r) => r.tti)),
          opportunities: runs[runs.length - 1]?.opportunities || [],
          report: `${name}.report.html`,
          runs: runs.length,
        };
        summary.push(picked);
        console.log(
          `  Perf ${picked.performance} | A11y ${picked.accessibility} | BP ${picked.bestPractices} | SEO ${picked.seo} | LCP ${picked.lcp}ms | TBT ${picked.tbt}ms | CLS ${picked.cls}`,
        );
      } catch (error) {
        summary.push({
          path: pagePath,
          url,
          formFactor,
          error: String(error),
        });
        console.error(`  FAILED: ${error}`);
      }
    }
  }

  await writeFile(path.join(OUT_DIR, "summary.json"), JSON.stringify(summary, null, 2));

  const md = [
    `# Lighthouse ${LABEL}`,
    "",
    `- Base URL: \`${BASE}\``,
    `- Runs per route/device: ${RUNS} (median reported)`,
    `- Generated: ${new Date().toISOString()}`,
    "",
    `| Route | Device | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI | Status |`,
    `| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |`,
    ...summary.map((row) => {
      if (row.error) {
        return `| ${row.path} | ${row.formFactor} | — | — | — | — | — | — | — | — | — | ERROR |`;
      }
      const pass =
        row.performance >= 90 &&
        row.accessibility >= 90 &&
        row.bestPractices >= 90 &&
        row.seo >= 90;
      return `| ${row.path} | ${row.formFactor} | ${row.performance} | ${row.accessibility} | ${row.bestPractices} | ${row.seo} | ${row.fcp} | ${row.lcp} | ${row.tbt} | ${row.cls} | ${row.si} | ${pass ? "PASS" : "FAIL"} |`;
    }),
    "",
  ].join("\n");

  await writeFile(path.join(OUT_DIR, "summary.md"), md);
  console.log(`\nWrote ${path.join(OUT_DIR, "summary.md")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
