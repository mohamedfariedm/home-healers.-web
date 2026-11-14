import fs from "fs";

const html = fs.readFileSync(process.argv[2], "utf8");
const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, "");
console.log("without scripts", withoutScripts.length);
const imgs = [...withoutScripts.matchAll(/<img\b[^>]*>/gi)];
console.log("img tags", imgs.length);
const styles = [...withoutScripts.matchAll(/style="/g)].length;
console.log("inline styles", styles);
const base64 = [...html.matchAll(/data:image\/[^;]+;base64,/g)].length;
console.log("base64 images", base64);
// largest attribute values
const attrs = [...html.matchAll(/=\s*"([^"]{500,})"/g)]
  .map((m) => m[1].length)
  .sort((a, b) => b - a)
  .slice(0, 10);
console.log("largest attr lens", attrs);
const textish = withoutScripts.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
console.log("text approx", textish.length);
// find big chunks of consecutive non-tag content
const chunks = withoutScripts
  .split(/<\/?[a-zA-Z][^>]*>/)
  .map((s) => s.trim())
  .filter((s) => s.length > 2000)
  .sort((a, b) => b.length - a.length)
  .slice(0, 5)
  .map((s) => ({ len: s.length, head: s.slice(0, 120) }));
console.log("big text chunks", chunks);
