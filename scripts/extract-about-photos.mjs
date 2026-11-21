import { writeFileSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const svgPath = "public/assets/images/homehellers/about.svg";
const outDir = "public/assets/images/homehellers";
const svg = readFileSync(svgPath, "utf8");

const re =
  /id="(image[01]_[^"]+)"[^>]*xlink:href="data:image\/(jpeg|png|jpg);base64,([^"]+)"/g;

let match;
let index = 0;
const written = [];

while ((match = re.exec(svg))) {
  const [, id, fmt, b64] = match;
  const name = index === 0 ? "about-photo-1.jpg" : "about-photo-2.jpg";
  const buf = Buffer.from(b64, "base64");
  const outPath = path.join(outDir, name);
  writeFileSync(outPath, buf);
  console.log("wrote", name, buf.length, "id", id, "fmt", fmt);
  written.push(outPath);
  index++;
}

if (written.length < 2) {
  console.error("Expected 2 embedded images, got", written.length);
  process.exit(1);
}

// Build a clean composed collage matching the SVG layout (611×540):
// - left tall photo 355×531 at (0,0) rx 16
// - experience card 230×225 at (367,6)
// - bottom overlapping photo 403×294 at (201,239) with white stroke
const W = 1222;
const H = 1080;
const sx = W / 611;
const sy = H / 540;

const photo1 = await sharp(written[0])
  .resize(Math.round(355 * sx), Math.round(531 * sy), { fit: "cover" })
  .png()
  .toBuffer();

const photo2 = await sharp(written[1])
  .resize(Math.round(403 * sx), Math.round(294 * sy), { fit: "cover" })
  .png()
  .toBuffer();

const cardW = Math.round(230 * sx);
const cardH = Math.round(225 * sy);
const starR = Math.round(41.5 * sx);

const cardSvg = `
<svg width="${cardW}" height="${cardH}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${cardW}" height="${cardH}" rx="${Math.round(16 * sx)}" fill="#EFF6FE"/>
  <circle cx="${cardW / 2}" cy="${Math.round(70 * sy)}" r="${starR}" fill="#62A0F6"/>
  <g transform="translate(${cardW / 2}, ${Math.round(70 * sy)}) scale(${starR / 28}) translate(-24,-24)">
    <path fill="#fff" d="M12 2l2.9 6.9L22 10l-5 4.6L18.2 22 12 18.2 5.8 22 7 14.6 2 10l7.1-1.1L12 2z"/>
  </g>
  <text x="${cardW / 2}" y="${Math.round(155 * sy)}" text-anchor="middle"
    font-family="Segoe UI, Arial, sans-serif" font-size="${Math.round(36 * sx)}"
    font-weight="700" fill="#143087">+20</text>
  <text x="${cardW / 2}" y="${Math.round(190 * sy)}" text-anchor="middle"
    font-family="Segoe UI, Arial, sans-serif" font-size="${Math.round(22 * sx)}"
    font-weight="600" fill="#143087">سنوات خبرة</text>
</svg>`;

const stroke = Math.round(14 * sx);
const composed = await sharp({
  create: {
    width: W,
    height: H,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    {
      input: await sharp(photo1)
        .composite([
          {
            input: Buffer.from(
              `<svg><rect x="0" y="0" width="${Math.round(355 * sx)}" height="${Math.round(531 * sy)}" rx="${Math.round(16 * sx)}" fill="#fff"/></svg>`,
            ),
            blend: "dest-in",
          },
        ])
        .png()
        .toBuffer(),
      left: 0,
      top: 0,
    },
    {
      input: Buffer.from(cardSvg),
      left: Math.round(367 * sx),
      top: Math.round(6 * sy),
    },
    {
      input: await sharp(photo2)
        .extend({
          top: stroke,
          bottom: stroke,
          left: stroke,
          right: stroke,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .composite([
          {
            input: Buffer.from(
              `<svg><rect x="0" y="0" width="${Math.round(403 * sx) + stroke * 2}" height="${Math.round(294 * sy) + stroke * 2}" rx="${Math.round(23 * sx)}" fill="#fff"/></svg>`,
            ),
            blend: "dest-in",
          },
        ])
        .png()
        .toBuffer(),
      left: Math.round(201 * sx) - stroke,
      top: Math.round(239 * sy) - stroke,
    },
  ])
  .webp({ quality: 82, alphaQuality: 100 })
  .toFile(path.join(outDir, "about-composed.webp"));

console.log(
  "about-composed.webp",
  statSync(path.join(outDir, "about-composed.webp")).size,
);

await sharp(path.join(outDir, "about-composed.webp"))
  .png()
  .toFile(path.join(outDir, "_preview_about.png"));
console.log("preview about written");
