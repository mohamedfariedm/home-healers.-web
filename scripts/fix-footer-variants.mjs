import { readFileSync, writeFileSync } from "node:fs";

const p = "src/components/Layout/Footer.tsx";
let s = readFileSync(p, "utf8");

s = s.replace(
  /\n\/\/ Animation variants\nconst animationVariants = \{[\s\S]*?\n\};\n/,
  "\n",
);
s = s.replace(/\s*variants=\{animationVariants\.[a-zA-Z]+\}/g, "");
s = s.replace(/\s*whileTap="tap"/g, "");

writeFileSync(p, s);
console.log({
  variantsLeft: (s.match(/variants=/g) || []).length,
  whileTapLeft: (s.match(/whileTap/g) || []).length,
  animationVariantsLeft: (s.match(/animationVariants/g) || []).length,
});
