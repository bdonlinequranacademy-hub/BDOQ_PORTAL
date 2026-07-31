import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const IMPORT = 'import { usePortalTranslation } from "@/i18n/LocaleProvider";\n';

const list = fs.readFileSync(path.join(import.meta.dirname, "wire-i18n-hook.mjs"), "utf8")
  .match(/"src\/[^"]+\.tsx"/g)
  ?.map((s) => s.slice(1, -1)) ?? [];

for (const rel of list) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) continue;
  let src = fs.readFileSync(abs, "utf8");
  if (src.includes('from "@/i18n/LocaleProvider"')) continue;

  const match = src.match(/^((?:import[\s\S]*?;\n)+)/);
  if (match) {
    src = match[1] + IMPORT + src.slice(match[1].length);
  } else {
    src = IMPORT + src;
  }
  fs.writeFileSync(abs, src);
}
console.log("imports restored for", list.length);
