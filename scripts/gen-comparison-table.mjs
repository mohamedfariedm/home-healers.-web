import fs from "node:fs";

const pairs = JSON.parse(
  fs.readFileSync("lighthouse-reports/final/comparison.json", "utf8"),
);

function status(p) {
  return p.after >= 90 && p.a11y >= 90 && p.bp >= 90 && p.seo >= 90
    ? "PASS"
    : "FAIL";
}

const lines = [
  "| Route | Device | Before | After | LCP | TBT | CLS | A11y | BP | SEO | FCP | SI | Status |",
  "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |",
];

for (const p of pairs) {
  lines.push(
    `| ${p.path} | ${p.device} | ${p.before} | ${p.after} | ${p.lcpA} | ${p.tbtA} | ${p.clsA} | ${p.a11y} | ${p.bp} | ${p.seo} | ${p.fcp} | ${p.si} | ${status(p)} |`,
  );
}

fs.writeFileSync(
  "lighthouse-reports/final/comparison-table.md",
  lines.join("\n") + "\n",
);

const improved = pairs.filter((p) => p.delta >= 5);
console.log("improved>=5:", improved.length);
for (const p of improved) {
  console.log(`${p.path} ${p.device} ${p.before}->${p.after} (LCP ${p.lcpB}->${p.lcpA})`);
}
