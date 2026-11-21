import { statSync } from "node:fs";
import sharp from "sharp";

// Convert the known-good PNG mockup and remove the solid black studio backdrop.
const cleaned = await sharp(
  "public/assets/images/shared/app-download/app-download-screenshot.png",
)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { data, info } = cleaned;
for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  // Near-black studio background → transparent
  if (r < 18 && g < 18 && b < 18) {
    data[i + 3] = 0;
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile("public/assets/images/homehellers/landing_page_01.webp");

await sharp("public/assets/images/homehellers/landing_page_01.webp")
  .webp({ quality: 90, alphaQuality: 100 })
  .toFile(
    "public/assets/images/shared/app-download/app-download-screenshot.webp",
  );

console.log(
  "landing_page_01.webp",
  statSync("public/assets/images/homehellers/landing_page_01.webp").size,
);
const meta = await sharp(
  "public/assets/images/homehellers/landing_page_01.webp",
).metadata();
console.log("dims", meta.width + "x" + meta.height, "hasAlpha", meta.hasAlpha);
