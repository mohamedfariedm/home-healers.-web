import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dir = "lighthouse-reports";
const files = (await readdir(dir)).filter((f) => f.endsWith(".report.json"));
const rows = [];

for (const file of files) {
  const report = JSON.parse(await readFile(path.join(dir, file), "utf8"));
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
  const failedSeo = seoAudits.filter((id) => report.audits?.[id]?.score !== 1);
  rows.push({
    path: report.finalUrl?.replace("http://localhost:3001", "") || file,
    performance: Math.round((report.categories?.performance?.score ?? 0) * 100),
    seo: Math.round((report.categories?.seo?.score ?? 0) * 100),
    failedSeo,
    robots: report.audits?.["robots-txt"]?.score,
    robotsTitle: report.audits?.["robots-txt"]?.title,
    lcp: report.audits?.["largest-contentful-paint"]?.displayValue,
    fcp: report.audits?.["first-contentful-paint"]?.displayValue,
    tbt: report.audits?.["total-blocking-time"]?.displayValue,
    cls: report.audits?.["cumulative-layout-shift"]?.displayValue,
    si: report.audits?.["speed-index"]?.displayValue,
    report: file.replace(".json", ".html"),
  });
}

rows.sort((a, b) => a.path.localeCompare(b.path));
console.log(JSON.stringify(rows, null, 2));

const md = [
  "# Lighthouse reports (mobile)",
  "",
  "Production server: `http://localhost:3001`",
  "",
  "| Page | Performance | SEO | LCP | Failed SEO | Report |",
  "| --- | ---: | ---: | --- | --- | --- |",
  ...rows.map(
    (row) =>
      `| ${row.path} | ${row.performance} | ${row.seo} | ${row.lcp || "—"} | ${row.failedSeo.join(", ") || "none"} | ${row.report} |`,
  ),
  "",
].join("\n");

await writeFile(path.join(dir, "summary.md"), md);
await writeFile(path.join(dir, "summary.json"), JSON.stringify(rows, null, 2));
console.log("wrote summary");
