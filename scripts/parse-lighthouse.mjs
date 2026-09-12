import { readFile } from "node:fs/promises";

const file = process.argv[2] || "lighthouse-reports/home-ar.report.json";
const r = JSON.parse(await readFile(file, "utf8"));

const keys = [
  "first-contentful-paint",
  "largest-contentful-paint",
  "total-blocking-time",
  "cumulative-layout-shift",
  "speed-index",
  "interactive",
  "document-title",
  "meta-description",
  "http-status-code",
  "link-text",
  "crawlable-anchors",
  "robots-txt",
  "image-alt",
  "hreflang",
  "canonical",
  "is-crawlable",
  "viewport",
  "font-size",
  "tap-targets",
  "structured-data",
  "unused-javascript",
  "unused-css-rules",
  "render-blocking-resources",
  "uses-responsive-images",
  "offscreen-images",
  "unminified-javascript",
  "uses-text-compression",
  "uses-long-cache-ttl",
  "bootup-time",
  "mainthread-work-breakdown",
  "dom-size",
  "third-party-summary",
  "lcp-lazy-loaded",
  "prioritize-lcp-image",
  "uses-rel-preconnect",
  "font-display",
];

console.log("url", r.finalUrl);
console.log("categories", Object.keys(r.categories || {}), r.categories);
console.log("--- audits ---");
for (const id of keys) {
  const a = r.audits?.[id];
  if (!a) continue;
  console.log(
    `${id.padEnd(28)} score=${String(a.score)}  ${a.displayValue || a.title}`,
  );
}
