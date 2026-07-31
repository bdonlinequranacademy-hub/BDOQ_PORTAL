/**
 * Remove unused usePortalTranslation hooks/imports; trim destructuring to used symbols only.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const IMPORT = 'import { usePortalTranslation } from "@/i18n/LocaleProvider";\r\n';
const IMPORT_LF = 'import { usePortalTranslation } from "@/i18n/LocaleProvider";\n';
const HOOK_RE =
  /const \{ ([^}]+) \} = usePortalTranslation\(\);/g;

function getFunctionScope(src, hookIndex) {
  const before = src.slice(0, hookIndex);
  const fnStart = Math.max(before.lastIndexOf("\nfunction "), before.lastIndexOf("\nexport function "));
  const after = src.slice(hookIndex);
  const nextFn = after.search(/\n(?:export )?function /);
  const end = nextFn > 0 ? hookIndex + nextFn : src.length;
  return { start: fnStart, end, body: src.slice(fnStart, end) };
}

function symbolsUsedIn(text) {
  const all = [
    "t",
    "statusLabel",
    "dynamicLabel",
    "role",
    "formatDate",
    "formatDateTime",
    "formatMoney",
    "formatBdt",
    "formatUsd",
    "formatNumber",
    "pickField",
  ];
  return all.filter((sym) => new RegExp(`\\b${sym}\\(`).test(text) || (sym === "t" && /\bt\("/.test(text)));
}

function fixFile(abs) {
  let src = fs.readFileSync(abs, "utf8");
  const orig = src;

  let match;
  const hookRe = new RegExp(HOOK_RE.source, "g");
  while ((match = hookRe.exec(src)) !== null) {
    const hookIndex = match.index;
    const scope = getFunctionScope(src, hookIndex);
    const used = symbolsUsedIn(scope.body);
    if (used.length === 0) {
      src = src.slice(0, hookIndex) + src.slice(hookIndex + match[0].length + (src[hookIndex + match[0].length] === "\r" ? 2 : 1));
      hookRe.lastIndex = hookIndex;
      continue;
    }
    const trimmed = `const { ${used.join(", ")} } = usePortalTranslation();`;
    if (trimmed !== match[0]) {
      src = src.slice(0, hookIndex) + trimmed + src.slice(hookIndex + match[0].length);
      hookRe.lastIndex = hookIndex + trimmed.length;
    }
  }

  if (!src.includes("usePortalTranslation()")) {
    src = src.replace(IMPORT, "").replace(IMPORT_LF, "");
  }

  if (src !== orig) fs.writeFileSync(abs, src);
  return src !== orig;
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.name.endsWith(".tsx")) out.push(p);
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
    if (fs.readFileSync(f, "utf8").includes("usePortalTranslation")) {
      if (fixFile(f)) n++;
    }
  }
}
console.log("trimmed/removed hooks in", n, "files");
