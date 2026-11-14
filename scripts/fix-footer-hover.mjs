import { readFileSync, writeFileSync } from "node:fs";

const p = "src/components/Layout/Footer.tsx";
let s = readFileSync(p, "utf8");
s = s.replace(/\s*whileHover="hover"/g, "");
writeFileSync(p, s);
console.log("remaining whileHover", (s.match(/whileHover/g) || []).length);
