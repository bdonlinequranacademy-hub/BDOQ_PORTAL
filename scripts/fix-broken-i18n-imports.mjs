import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const LOCALE_IMPORT = 'import { usePortalTranslation } from "@/i18n/LocaleProvider";';

function fixFile(abs) {
  let src = fs.readFileSync(abs, "utf8");
  const original = src;

  // Fix broken import block (handles mixed CRLF/LF)
  src = src.replace(
    /import \{\r?\nimport \{ usePortalTranslation \} from "@\/i18n\/LocaleProvider";\r?\n([\s\S]*?\r?\n)\} from/g,
    `import {\r\n$1} from`
  );

  // Remove duplicate locale imports, keep one after import block
  while (src.split(LOCALE_IMPORT).length > 2) {
    const idx = src.lastIndexOf(LOCALE_IMPORT);
    src = src.slice(0, idx) + src.slice(idx + LOCALE_IMPORT.length + 1);
  }

  if (src.includes("usePortalTranslation()") && !src.includes(LOCALE_IMPORT)) {
    const match = src.match(/^((?:import[\s\S]*?;\r?\n)+)/);
    if (match) {
      src = match[1] + LOCALE_IMPORT + "\r\n" + src.slice(match[1].length);
    } else {
      src = LOCALE_IMPORT + "\r\n" + src;
    }
  }

  if (src !== original) {
    fs.writeFileSync(abs, src);
    return true;
  }
  return false;
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith(".tsx") || ent.name.endsWith(".ts")) out.push(p);
  }
  return out;
}

const dirs = [
  path.join(ROOT, "src/features/admin/components"),
  path.join(ROOT, "src/components/schedule"),
  path.join(ROOT, "src/components/classes"),
];

let n = 0;
for (const dir of dirs) {
  for (const f of walk(dir)) {
    const content = fs.readFileSync(f, "utf8");
    if (content.includes('import {\r\nimport { usePortalTranslation') ||
        content.includes('import {\nimport { usePortalTranslation')) {
      if (fixFile(f)) {
        n++;
        console.log("fixed:", path.relative(ROOT, f));
      }
    }
  }
}

// Add locale import after import block for all wired files missing it
for (const dir of dirs) {
  for (const f of walk(dir)) {
    let content = fs.readFileSync(f, "utf8");
    if (content.includes("usePortalTranslation()") && !content.includes(LOCALE_IMPORT)) {
      const match = content.match(/^((?:import[\s\S]*?;\r?\n)+)/);
      if (match) {
        content = match[1] + LOCALE_IMPORT + "\r\n" + content.slice(match[1].length);
        fs.writeFileSync(f, content);
        console.log("added import:", path.relative(ROOT, f));
        n++;
      }
    }
  }
}

console.log("total fixes:", n);
