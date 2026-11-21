import { unlinkSync, statSync, existsSync } from "node:fs";
import sharp from "sharp";

await sharp("public/assets/images/homehellers/about-photo-1.jpg")
  .rotate()
  .resize(710, 1062, { fit: "cover" })
  .webp({ quality: 80 })
  .toFile("public/assets/images/homehellers/about-photo-1.webp");

await sharp("public/assets/images/homehellers/about-photo-2.jpg")
  .rotate()
  .resize(806, 588, { fit: "cover" })
  .webp({ quality: 80 })
  .toFile("public/assets/images/homehellers/about-photo-2.webp");

console.log(
  "p1",
  statSync("public/assets/images/homehellers/about-photo-1.webp").size,
);
console.log(
  "p2",
  statSync("public/assets/images/homehellers/about-photo-2.webp").size,
);

for (const f of [
  "public/assets/images/homehellers/about-photo-1.jpg",
  "public/assets/images/homehellers/about-photo-2.jpg",
  "public/assets/images/homehellers/_preview_about.png",
  "public/assets/images/homehellers/_preview_phone.png",
]) {
  if (existsSync(f)) {
    unlinkSync(f);
    console.log("removed", f);
  }
}
