import sharp from "sharp";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = join(__dirname, "../public/images");
const webSrc = join(__dirname, "../../myAcademy-web/public/images/logo.png");
const src =
  process.argv[2] ??
  (existsSync(webSrc) ? webSrc : join(imagesDir, "logo.png"));

const NAVY = { r: 3, g: 33, b: 79 };
const GOLD = { r: 212, g: 165, b: 74 };
const WHITE = { r: 255, g: 255, b: 255 };

function lum(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function sat(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

function isBackground(r, g, b, a) {
  if (a < 16) return true;
  if (r < 52 && g < 52 && b < 52) return true;
  return lum(r, g, b) < 38;
}

/** Book pages only — excludes dark gold/bronze lettering. */
function isBrightGold(r, g, b, a) {
  if (a < 16) return false;
  const l = lum(r, g, b);
  const s = sat(r, g, b);
  return l > 105 && s > 0.38 && r > 130 && g > 95 && b < 115 && r >= g * 0.82;
}

function setRgb(data, i, { r, g, b }) {
  data[i] = r;
  data[i + 1] = g;
  data[i + 2] = b;
}

async function processLogo(mode) {
  const input = readFileSync(src);
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (isBackground(r, g, b, a)) {
      data[i + 3] = 0;
      continue;
    }

    if (isBrightGold(r, g, b, a)) {
      const mix = Math.min(1, (lum(r, g, b) - 90) / 120);
      setRgb(data, i, {
        r: Math.round(GOLD.r * mix + r * (1 - mix) * 0.4 + 40),
        g: Math.round(GOLD.g * mix + g * (1 - mix) * 0.4 + 28),
        b: Math.round(GOLD.b * mix + b * (1 - mix) * 0.4 + 8),
      });
      continue;
    }

    if (mode === "light") {
      setRgb(data, i, NAVY);
    } else {
      setRgb(data, i, WHITE);
    }
  }

  const png = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  return sharp(png).trim({ threshold: 12 }).png({ compressionLevel: 9 }).toBuffer();
}

const light = await processLogo("light");
writeFileSync(join(imagesDir, "logo.png"), light);
const dark = await processLogo("dark");
writeFileSync(join(imagesDir, "logo-dark.png"), dark);

console.log(`Processed brand logos from ${src}`);
