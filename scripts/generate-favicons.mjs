import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const portalRoot = join(__dirname, "..");
const publicSiteRoot = join(portalRoot, "..", "public-site");

const src =
  process.argv[2] ??
  join(
    portalRoot,
    "..",
    ".cursor",
    "projects",
    "c-Users-decrypt-Documents-Creative-IT-institute-BD-ONLINE-CLIENT-DB-ONLINE-ACADEMY-PROJECT",
    "assets",
    "c__Users_decrypt_AppData_Roaming_Cursor_User_workspaceStorage_eb714c2d98f5e9854d01a52846758170_images_logo-953633fa-14a7-491a-8b04-d218f68e679d.png"
  );

function lum(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function isLightBackground(r, g, b, a) {
  if (a < 16) return true;
  if (lum(r, g, b) > 205 && g > 175 && b > 165) return true;
  return false;
}

function floodRemoveLightBackground(data, width, height) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  function pushIfBackground(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    const i = idx * 4;
    if (!isLightBackground(data[i], data[i + 1], data[i + 2], data[i + 3])) return;
    visited[idx] = 1;
    queue.push(idx);
  }

  for (let x = 0; x < width; x += 1) {
    pushIfBackground(x, 0);
    pushIfBackground(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    pushIfBackground(0, y);
    pushIfBackground(width - 1, y);
  }

  while (queue.length > 0) {
    const idx = queue.pop();
    if (idx === undefined) break;
    const x = idx % width;
    const y = (idx - x) / width;
    const i = idx * 4;
    data[i + 3] = 0;
    pushIfBackground(x - 1, y);
    pushIfBackground(x + 1, y);
    pushIfBackground(x, y - 1);
    pushIfBackground(x, y + 1);
  }
}

async function loadTransparentLogo() {
  const input = readFileSync(src);
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  floodRemoveLightBackground(data, info.width, info.height);

  const png = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();

  return sharp(png).trim({ threshold: 8 }).png().toBuffer();
}

async function resizeSquare(buffer, size, padding = 0.08) {
  const meta = await sharp(buffer).metadata();
  const inner = Math.round(size * (1 - padding * 2));
  return sharp(buffer)
    .resize({
      width: inner,
      height: inner,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: Math.floor(size * padding),
      bottom: Math.ceil(size * padding),
      left: Math.floor(size * padding),
      right: Math.ceil(size * padding),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function cropIconMark(fullLogoBuffer) {
  const meta = await sharp(fullLogoBuffer).metadata();
  const cropHeight = Math.round((meta.height ?? 0) * 0.58);
  return sharp(fullLogoBuffer)
    .extract({
      left: 0,
      top: 0,
      width: meta.width ?? 0,
      height: cropHeight,
    })
    .trim({ threshold: 8 })
    .png()
    .toBuffer();
}

async function writeOutput(path, buffer) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, buffer);
  const meta = await sharp(buffer).metadata();
  console.log(`${path} -> ${meta.width}x${meta.height}, ${buffer.length} bytes`);
}

async function main() {
  console.log(`Source logo: ${src}`);
  const fullLogo = await loadTransparentLogo();
  const iconMark = await cropIconMark(fullLogo);

  const outputs = [
    [join(portalRoot, "public/favicon-16x16.png"), await resizeSquare(iconMark, 16)],
    [join(portalRoot, "public/favicon-32x32.png"), await resizeSquare(iconMark, 32)],
    [join(portalRoot, "public/apple-touch-icon.png"), await resizeSquare(fullLogo, 180, 0.06)],
    [join(portalRoot, "public/brand/bdoq-logo.png"), await resizeSquare(fullLogo, 512, 0.05)],
    [join(portalRoot, "public/brand/bdoq-icon.png"), await resizeSquare(iconMark, 512, 0.05)],
    [join(portalRoot, "public/certificates/logo.png"), fullLogo],
    [join(publicSiteRoot, "app/icon.png"), await resizeSquare(iconMark, 32)],
    [join(publicSiteRoot, "app/apple-icon.png"), await resizeSquare(fullLogo, 180, 0.06)],
    [join(publicSiteRoot, "public/images/brand/bdoq-logo.png"), await resizeSquare(fullLogo, 512, 0.05)],
    [join(publicSiteRoot, "public/images/brand/bdoq-icon.png"), await resizeSquare(iconMark, 512, 0.05)],
    [join(publicSiteRoot, "public/favicon-32x32.png"), await resizeSquare(iconMark, 32)],
    [join(publicSiteRoot, "public/favicon-16x16.png"), await resizeSquare(iconMark, 16)],
  ];

  for (const [path, buffer] of outputs) {
    await writeOutput(path, buffer);
  }

  console.log("Favicon assets generated.");
}

await main();
