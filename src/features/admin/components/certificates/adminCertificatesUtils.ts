import type { CertificateView } from "@/types/models";

export interface ICertificateStats {
  total: number;
  issued: number;
  withBadge: number;
  thisMonth: number;
}

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

export function pctOfTotal(part: number, total: number): string {
  if (total <= 0) return "0%";
  return `${((part / total) * 100).toFixed(1)}% of total`;
}
