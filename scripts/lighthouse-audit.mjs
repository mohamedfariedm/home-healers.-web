import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.LIGHTHOUSE_BASE_URL || "http://localhost:3001";
const OUT_DIR = path.resolve("lighthouse-reports");

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
  "/our-services",
  "/en/our-services",
  "/booking",
  "/en/booking",
  "/doctors-apply",
  "/en/doctors-apply",
  "/privacy",
  "/en/privacy",
  "/terms",
  "/en/terms",
];

function slugify(urlPath) {
  return urlPath === "/" ? "home-ar" : urlPath.replace(/^\//, "").replace(/\//g, "_") || "page";
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", shell: true });
    child.on("exit", (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(`${cmd} ${args.join(" ")} exited ${code}`));
    });
  });
}

async function discoverDynamicPaths() {
  const extras = [];
  try {
    const [blogs, categories, offers] = await Promise.all([
      fetch(`${BASE}/api/placeholder-skip`).catch(() => null),
      fetch("https://backend.home-healers.com/api/categories?locale=ar").catch(() => null),
      fetch("https://backend.home-healers.com/api/packages?locale=ar&limit=1").catch(() => null),
    ]);
    void blogs;
    if (categories?.ok) {
      const json = await categories.json();
      const first = json?.data?.[0];
      const slug = first?.slug?.ar || first?.slug;
      const serviceSlug = first?.services?.[0]?.slug?.ar || first?.services?.[0]?.slug;
      if (slug) extras.push(`/categories/${encodeURIComponent(slug)}`);
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
      if (slug) extras.push(`/offers/${encodeURIComponent(slug)}`);
    }
  } catch {
    // Keep the static list if discovery fails.
  }
  return extras;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const pages = [...STATIC_PATHS, ...(await discoverDynamicPaths())];
  const summary = [];

  for (const pagePath of pages) {
    const url = `${BASE}${pagePath}`;
    const name = slugify(pagePath);
    const outputPath = path.posix.join("lighthouse-reports", name);
    console.log(`\n=== Lighthouse ${url} ===`);
    try {
      await run("npx", [
        "--yes",
        "lighthouse",
        url,
        "--only-categories=performance",
        "--only-categories=seo",
        "--output=json",
        "--output=html",
        `--output-path=${outputPath}`,
        '--chrome-flags="--headless --no-sandbox --disable-gpu"',
        "--quiet",
      ]);

      let scores = { performance: null, seo: null };
      try {
        const raw = await readFile(`${outputPath}.report.json`, "utf8");
        const report = JSON.parse(raw);
        const perf = report.categories?.performance?.score;
        const seo = report.categories?.seo?.score;
        const seoAudits = [
          "is-crawlable",
          "document-title",
          "meta-description",
          "http-status-code",
          "link-text",
          "crawlable-anchors",
          "robots-txt",
          "image-alt",
          "hreflang",
          "canonical",
        ];
        const seoPass = seoAudits.every((id) => report.audits?.[id]?.score === 1);
        const metric = (id) => report.audits?.[id]?.score ?? 0;
        const computedPerf = Math.round(
          (metric("largest-contentful-paint") * 0.25 +
            metric("total-blocking-time") * 0.3 +
            metric("cumulative-layout-shift") * 0.25 +
            metric("first-contentful-paint") * 0.1 +
            metric("speed-index") * 0.1) *
            100,
        );
        scores = {
          performance:
            typeof perf === "number" ? Math.round(perf * 100) : computedPerf,
          seo: typeof seo === "number" ? Math.round(seo * 100) : seoPass ? 100 : 0,
        };
      } catch {
        // Keep null scores if the JSON report cannot be parsed.
      }

      summary.push({ path: pagePath, url, ...scores, report: `${name}.report.html` });
    } catch (error) {
      summary.push({
        path: pagePath,
        url,
        performance: null,
        seo: null,
        error: String(error),
      });
    }
  }

  const markdown = [
    "# Lighthouse reports",
    "",
    `| Page | Performance | SEO | Report |`,
    `| --- | ---: | ---: | --- |`,
    ...summary.map(
      (row) =>
        `| ${row.path} | ${row.performance ?? "—"} | ${row.seo ?? "—"} | ${row.report || row.error || ""} |`,
    ),
    "",
  ].join("\n");

  await writeFile(path.join(OUT_DIR, "summary.md"), markdown);
  await writeFile(path.join(OUT_DIR, "summary.json"), JSON.stringify(summary, null, 2));
  console.log(`\nWrote ${path.join(OUT_DIR, "summary.md")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
