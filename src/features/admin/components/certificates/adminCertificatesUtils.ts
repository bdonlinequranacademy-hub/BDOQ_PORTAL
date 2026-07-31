import type { CertificateView } from "@/types/models";

export interface ICertificateStats {
  total: number;
  issued: number;
  withBadge: number;
  thisMonth: number;
}

export type PortalTranslate = (key: string, params?: Record<string, string>) => string;

export function computeCertificateStats(
  items: CertificateView[]
): ICertificateStats {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  return {
    total: items.length,
    issued: items.length,
    withBadge: items.filter((c) => c.showExcellentBadge).length,
    thisMonth: items.filter((c) => {
      const d = new Date(c.createdAt || c.issueDate);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length,
  };
}

export function pctOfTotal(part: number, total: number, t: PortalTranslate): string {
  if (total <= 0) return t("stats.zeroOfTotal");
  const pctValue = Math.round((part / total) * 1000) / 10;
  return t("stats.ofTotal", { pct: String(pctValue) });
}
