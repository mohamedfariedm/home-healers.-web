import fs from "fs";

const file = process.argv[2];
const html = fs.readFileSync(file, "utf8");
console.log("len", html.length);
const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)];
console.log("script tags", scripts.length);
const sizes = scripts
  .map((m, i) => ({ i, len: m[1].length, head: m[0].slice(0, 100) }))
  .sort((a, b) => b.len - a.len)
  .slice(0, 8);
console.log(sizes);
const jsonLd = [...html.matchAll(/application\/ld\+json/g)].length;
console.log("jsonld", jsonLd);
const nextData = html.includes("__NEXT_DATA__");
console.log("has __NEXT_DATA__", nextData);
const flight = [...html.matchAll(/self\.__next_f\.push/g)].length;
console.log("rsc pushes", flight);
const biggestPush = [...html.matchAll(/self\.__next_f\.push\(\[.*?,\"([\s\S]*?)\"\]\)/g)]
  .map((m) => m[1].length)
  .sort((a, b) => b - a)
  .slice(0, 5);
console.log("biggest push lens", biggestPush);
