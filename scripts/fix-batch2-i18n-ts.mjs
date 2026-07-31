/**
 * Fix batch2 i18n issues: module-level TABS using t(), trim nested hooks, remove empty hooks.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const FULL_HOOK =
  /const \{ t, statusLabel, dynamicLabel, role, formatDate, formatDateTime, formatMoney, formatBdt, formatUsd, formatNumber, pickField \} = usePortalTranslation\(\);/g;
const PARTIAL_HOOK =
  /const \{ t, statusLabel, formatBdt, formatNumber, formatDateTime \} = usePortalTranslation\(\);/g;

function trimHookInScope(src, scopeStart, scopeEnd) {
  const scope = src.slice(scopeStart, scopeEnd);
  const uses = {
    t: /\bt\(/g.test(scope),
    statusLabel: /\bstatusLabel\(/g.test(scope),
    dynamicLabel: /\bdynamicLabel\(/g.test(scope),
    role: /\brole\(/g.test(scope),
    formatDate: /\bformatDate\(/g.test(scope),
    formatDateTime: /\bformatDateTime\(/g.test(scope),
    formatMoney: /\bformatMoney\(/g.test(scope),
    formatBdt: /\bformatBdt\(/g.test(scope),
    formatUsd: /\bformatUsd\(/g.test(scope),
    formatNumber: /\bformatNumber\(/g.test(scope),
    pickField: /\bpickField\(/g.test(scope),
  };
  const parts = Object.entries(uses)
    .filter(([, v]) => v)
    .map(([k]) => k);
  if (parts.length === 0) return null;
  return `const { ${parts.join(", ")} } = usePortalTranslation();`;
}

function fixModuleLevelTabs(src) {
  // Move const TABS blocks that reference t( or statusLabel( inside the next export function
  const tabsRe =
    /const TABS: \{ id: [^}]+\}[^=]*= \[[\s\S]*?\];\r?\n\r?\n/g;
  const match = src.match(tabsRe);
  if (!match) return src;
  for (const block of match) {
    if (!block.includes("t(") && !block.includes("statusLabel(")) continue;
    src = src.replace(block, "");
    src = src.replace(
      /(export function \w+\([^)]*\)[^{]*\{)\r?\n(\s*const \{ [^}]+\} = usePortalTranslation\(\);)?/,
      (_, open, existingHook) => {
        const hook =
          existingHook ??
          "  const { t, statusLabel } = usePortalTranslation();\n";
        if (!existingHook) {
          return `${open}\n${hook}\n  ${block.trim().replace(/^const /, "const ")}\n`;
        }
        return `${open}\n${existingHook}\n  ${block.trim()}\n`;
      }
    );
  }
  return src;
}

function fixFile(abs) {
  let src = fs.readFileSync(abs, "utf8");
  const orig = src;

  src = fixModuleLevelTabs(src);

  // Replace full hooks with trimmed version file-wide (simple approach)
  src = src.replace(FULL_HOOK, (match, offset) => {
    // find enclosing function - rough: from last "function " before offset to next "}\n\nfunction" or end
    const before = src.slice(0, offset);
    const fnStart = before.lastIndexOf("\nfunction ");
    const fnStart2 = before.lastIndexOf("\nexport function ");
    const start = Math.max(fnStart, fnStart2);
    const after = src.slice(offset);
    const nextFn = after.search(/\n(function |export function )/);
    const end = nextFn > 0 ? offset + nextFn : src.length;
    const trimmed = trimHookInScope(src, start, end);
    return trimmed ?? "";
  });

  src = src.replace(PARTIAL_HOOK, (match, offset) => {
    const before = src.slice(0, offset);
    const fnStart = before.lastIndexOf("\nfunction ");
    const fnStart2 = before.lastIndexOf("\nexport function ");
    const start = Math.max(fnStart, fnStart2);
    const after = src.slice(offset);
    const nextFn = after.search(/\n(function |export function )/);
    const end = nextFn > 0 ? offset + nextFn : src.length;
    const trimmed = trimHookInScope(src, start, end);
    return trimmed ?? "";
  });

  // Remove duplicate empty hook lines
  src = src.replace(/\n\s*\n\s*\n/g, "\n\n");

  if (src !== orig) {
    fs.writeFileSync(abs, src);
    return true;
  }
  return false;
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
];

let n = 0;
for (const dir of dirs) {
  for (const f of walk(dir)) {
    if (fs.readFileSync(f, "utf8").includes("usePortalTranslation")) {
      if (fixFile(f)) {
        n++;
        console.log(path.relative(ROOT, f));
      }
    }
  }
}
console.log("fixed", n);
