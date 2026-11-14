/**
 * Convert heavy local assets to WebP while keeping the same visual content.
 * Originals are left in place; code can point at *.webp.
 */
import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const backupRoot =
  "D:\\homeHellars-Website-backup-pre-selective-recovery\\public\\assets\\images";

function kb(n) {
  return `${Math.round(n / 1024)}KB`;
}

async function pngToWebp(relPng, quality = 78) {
  const input = path.join(root, "public", relPng);
  const output = input.replace(/\.png$/i, ".webp");
  if (!existsSync(input)) {
    console.log("skip missing", relPng);
    return;
  }
  await sharp(input).webp({ quality, effort: 6 }).toFile(output);
  console.log(
    "png→webp",
    relPng,
    kb(statSync(input).size),
    "→",
    kb(statSync(output).size),
  );
}

function copyBackupWebp(relFromBackup, relToPublic) {
  const from = path.join(backupRoot, relFromBackup);
  const to = path.join(root, "public", "assets", "images", relToPublic);
  mkdirSync(path.dirname(to), { recursive: true });
  if (!existsSync(from)) {
    console.log("backup missing", relFromBackup);
    return;
  }
  copyFileSync(from, to);
  console.log("copied", relToPublic, kb(statSync(to).size));
}

async function tryRasterizeSvg(relSvg, maxWidth, quality = 80) {
  const input = path.join(root, "public", relSvg);
  const output = input.replace(/\.svg$/i, ".webp");
  if (!existsSync(input)) return false;
  try {
    await sharp(input, { density: 144 })
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(output);
    console.log(
      "svg→webp",
      relSvg,
      kb(statSync(input).size),
      "→",
      kb(statSync(output).size),
    );
    return true;
  } catch (e) {
    console.log("svg sharp failed", relSvg, e.message);
    return false;
  }
}

// Prefer proven same-composition WebPs from prior pass for photo-SVGs.
copyBackupWebp("homehellers/about-composed.webp", "homehellers/about-composed.webp");
copyBackupWebp("homehellers/landing_page_01.webp", "homehellers/landing_page_01.webp");
copyBackupWebp("homehellers/hero.webp", "homehellers/hero.webp");

// rating: regenerate if possible; else copy backup
const ratingOk = await tryRasterizeSvg(
  "assets/images/homehellers/rating.svg",
  400,
  85,
);
if (!ratingOk) {
  copyBackupWebp("homehellers/rating.webp", "homehellers/rating.webp");
}

await pngToWebp("assets/images/shared/hero-banner/hero-bg-main.png", 75);
await pngToWebp("assets/images/shared/hero-banner/hero-layer-2.png", 75);
await pngToWebp("assets/images/certification.png", 82);
await pngToWebp("assets/images/gosi.png", 80);

const bookingHeader = "assets/images/shared/booking-header.png";
if (existsSync(path.join(root, "public", bookingHeader))) {
  await pngToWebp(bookingHeader, 75);
}

console.log("done");
