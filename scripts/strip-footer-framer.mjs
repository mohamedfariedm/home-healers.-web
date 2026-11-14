import { readFileSync, writeFileSync } from "node:fs";

const p = "src/components/Layout/Footer.tsx";
let s = readFileSync(p, "utf8");

s = s.replace(/import \{ motion \} from ["']framer-motion["'];\r?\n/, "");
s = s.replace(/\s*initial=\{\{[\s\S]*?\}\}/g, "");
s = s.replace(/\s*whileInView=\{\{[\s\S]*?\}\}/g, "");
s = s.replace(/\s*viewport=\{\{[\s\S]*?\}\}/g, "");
s = s.replace(/\s*transition=\{\{[\s\S]*?\}\}/g, "");
s = s.replace(/\s*whileHover=\{\{[\s\S]*?\}\}/g, "");
s = s.replace(/\s*whileTap=\{\{[\s\S]*?\}\}/g, "");
s = s.replace(/\s*animate=\{\{[\s\S]*?\}\}/g, "");
s = s.replace(/<motion\.div/g, "<div");
s = s.replace(/<\/motion\.div>/g, "</div>");
s = s.replace(/<motion\.p/g, "<p");
s = s.replace(/<\/motion\.p>/g, "</p>");
s = s.replace(/<motion\.a/g, "<a");
s = s.replace(/<\/motion\.a>/g, "</a>");
s = s.replace(/<motion\.span/g, "<span");
s = s.replace(/<\/motion\.span>/g, "</span>");

writeFileSync(p, s);
console.log({
  hasFramerImport: /framer-motion/.test(s),
  hasMotionTag: /<\/?motion\./.test(s),
});
