import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const portalRoot = join(__dirname, "..");
const publicSiteRoot = join(portalRoot, "..", "public-site");

const defaultSrc = join(portalRoot, "public/certificates/logo_after_BGRemove.png");

const src = process.argv[2] ?? defaultSrc;

/** Scale the full logo (icon + text) — never crop. */
async function resizeFullLogo(buffer, maxWidth, maxHeight, paddingRatio = 0.06) {
  const meta = await sharp(buffer).metadata();
  const padW = Math.round(maxWidth * paddingRatio);
  const padH = Math.round(maxHeight * paddingRatio);
  const innerW = maxWidth - padW * 2;
  const innerH = maxHeight - padH * 2;

  const aspect = (meta.width ?? 1) / (meta.height ?? 1);
  let targetW = innerW;
  let targetH = Math.round(innerW / aspect);
  if (targetH > innerH) {
    targetH = innerH;
    targetW = Math.round(innerH * aspect);
  }

  const resized = await sharp(buffer)
    .resize(targetW, targetH, {
      fit: "inside",
      withoutEnlargement: false,
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  return sharp(resized)
    .extend({
      top: padH + Math.floor((innerH - targetH) / 2),
      bottom: padH + Math.ceil((innerH - targetH) / 2),
      left: padW + Math.floor((innerW - targetW) / 2),
      right: padW + Math.ceil((innerW - targetW) / 2),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function writeOutput(path, buffer) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, buffer);
  const meta = await sharp(buffer).metadata();
  console.log(`${path} -> ${meta.width}x${meta.height}, ${buffer.length} bytes`);
}

async function main() {
  console.log(`Source logo (full, no crop): ${src}`);
  const fullLogo = readFileSync(src);

  const outputs = [
    [join(portalRoot, "public/favicon-16x16.png"), await resizeFullLogo(fullLogo, 16, 16)],
    [join(portalRoot, "public/favicon-32x32.png"), await resizeFullLogo(fullLogo, 32, 32)],
    [
      join(portalRoot, "public/apple-touch-icon.png"),
      await resizeFullLogo(fullLogo, 180, 180, 0.05),
    ],
    [join(publicSiteRoot, "app/icon.png"), await resizeFullLogo(fullLogo, 32, 32)],
    [join(publicSiteRoot, "app/apple-icon.png"), await resizeFullLogo(fullLogo, 180, 180, 0.05)],
    [join(publicSiteRoot, "public/favicon-32x32.png"), await resizeFullLogo(fullLogo, 32, 32)],
    [join(publicSiteRoot, "public/favicon-16x16.png"), await resizeFullLogo(fullLogo, 16, 16)],
  ];

  for (const [path, buffer] of outputs) {
    await writeOutput(path, buffer);
  }

  console.log("Favicon assets generated from full logo (no crop).");
}

await main();
