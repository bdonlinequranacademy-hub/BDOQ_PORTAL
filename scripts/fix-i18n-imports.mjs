import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const IMPORT = 'import { usePortalTranslation } from "@/i18n/LocaleProvider";\n';

function fixFile(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return;
  let src = fs.readFileSync(abs, "utf8");

  // Remove broken inline imports
  src = src.replace(/\nimport \{ usePortalTranslation \} from "@\/i18n\/LocaleProvider";\n/g, "\n");

  // Remove duplicate if any at wrong place inside import {
  src = src.replace(/import \{\nimport \{ usePortalTranslation[^}]+\}\s*from[^;]+;\n/g, "import {\n");

  if (!src.includes("usePortalTranslation")) {
    const match = src.match(/^((?:import[\s\S]*?;\n)+)/);
    if (match) {
      src = match[1] + IMPORT + src.slice(match[1].length);
    } else {
      src = IMPORT + src;
    }
  }

  fs.writeFileSync(abs, src);
}

const list = fs.readFileSync(path.join(import.meta.dirname, "wire-i18n-hook.mjs"), "utf8")
  .match(/"src\/[^"]+\.tsx"/g)
  ?.map((s) => s.slice(1, -1)) ?? [];

for (const rel of list) fixFile(rel);
console.log("fixed", list.length, "files");
