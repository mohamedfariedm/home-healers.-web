import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.LIGHTHOUSE_BASE_URL || "http://localhost:3001";
const LABEL = process.env.LIGHTHOUSE_LABEL || "continuation-r3";
const RUNS = Number(process.env.LIGHTHOUSE_RUNS || "3");
const OUT = path.resolve("lighthouse-reports", LABEL);

const ROUTES = (process.env.LIGHTHOUSE_ROUTES ||
  "/,/en,/about,/en/about,/contact,/blog,/categories,/offers,/booking,/en/booking,/privacy,/terms,/failed,/doctors-apply")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function median(nums) {
  const a = nums.filter((n) => typeof n === "number").sort((x, y) => x - y);
  if (!a.length) return null;
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

function score100(s) {
  return typeof s === "number" ? Math.round(s * 100) : null;
}

async function runOnce(url, formFactor) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
  });
  try {
    const options = {
      logLevel: "error",
      output: "json",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
      port: chrome.port,
      formFactor,
    };
    if (formFactor === "desktop") {
      options.screenEmulation = {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false,
      };
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
    const lhr = result.lhr;
    return {
      performance: score100(lhr.categories.performance?.score),
      accessibility: score100(lhr.categories.accessibility?.score),
      bestPractices: score100(lhr.categories["best-practices"]?.score),
      seo: score100(lhr.categories.seo?.score),
      fcp: Math.round(lhr.audits["first-contentful-paint"]?.numericValue || 0),
      lcp: Math.round(lhr.audits["largest-contentful-paint"]?.numericValue || 0),
      tbt: Math.round(lhr.audits["total-blocking-time"]?.numericValue || 0),
      cls: Number((lhr.audits["cumulative-layout-shift"]?.numericValue || 0).toFixed(3)),
      si: Math.round(lhr.audits["speed-index"]?.numericValue || 0),
      report: result.report,
    };
  } finally {
    await chrome.kill();
  }
}

await mkdir(OUT, { recursive: true });
const summary = [];

for (const route of ROUTES) {
  for (const formFactor of ["mobile", "desktop"]) {
    const url = `${BASE}${route}`;
    const runs = [];
    console.log(`\n=== [${LABEL}] ${formFactor.toUpperCase()} ${url} (${RUNS} runs) ===`);
    for (let i = 0; i < RUNS; i++) {
      const m = await runOnce(url, formFactor);
      runs.push(m);
      console.log(
        `  run${i + 1}: Perf ${m.performance} A11y ${m.accessibility} BP ${m.bestPractices} SEO ${m.seo} LCP ${m.lcp} TBT ${m.tbt}`,
      );
    }
    const med = {
      path: route,
      formFactor,
      runs: runs.map((r) => ({
        performance: r.performance,
        accessibility: r.accessibility,
        bestPractices: r.bestPractices,
        seo: r.seo,
        lcp: r.lcp,
        tbt: r.tbt,
      })),
      performance: Math.round(median(runs.map((r) => r.performance))),
      accessibility: Math.round(median(runs.map((r) => r.accessibility))),
      bestPractices: Math.round(median(runs.map((r) => r.bestPractices))),
      seo: Math.round(median(runs.map((r) => r.seo))),
      fcp: Math.round(median(runs.map((r) => r.fcp))),
      lcp: Math.round(median(runs.map((r) => r.lcp))),
      tbt: Math.round(median(runs.map((r) => r.tbt))),
      cls: median(runs.map((r) => r.cls)),
      si: Math.round(median(runs.map((r) => r.si))),
    };
    const pass =
      med.performance >= 90 &&
      med.accessibility >= 90 &&
      med.bestPractices >= 90 &&
      med.seo >= 90;
    med.status = pass ? "PASS" : "FAIL";
    summary.push(med);
    const slug =
      (route === "/" ? "home-ar" : route.replace(/^\//, "").replace(/\//g, "_")) +
      "__" +
      formFactor;
    await writeFile(path.join(OUT, `${slug}.report.json`), runs[runs.length - 1].report);
    console.log(
      `  MEDIAN Perf ${med.performance} | A11y ${med.accessibility} | BP ${med.bestPractices} | SEO ${med.seo} | LCP ${med.lcp} | TBT ${med.tbt} | ${med.status}`,
    );
  }
}

await writeFile(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 2));
const md = [
  `# Lighthouse ${LABEL}`,
  "",
  `- Base: \`${BASE}\``,
  `- Runs per route/device: ${RUNS} (median)`,
  `- Generated: ${new Date().toISOString()}`,
  "",
  `| Route | Device | Perf | A11y | BP | SEO | FCP | LCP | TBT | CLS | SI | Status |`,
  `| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |`,
  ...summary.map(
    (r) =>
      `| ${r.path} | ${r.formFactor} | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${r.fcp} | ${r.lcp} | ${r.tbt} | ${r.cls} | ${r.si} | ${r.status} |`,
  ),
  "",
].join("\n");
await writeFile(path.join(OUT, "summary.md"), md);
console.log(`\nWrote ${path.join(OUT, "summary.md")}`);
