import type { AdminPricingPackage } from "@/types/models";
import type { LocaleType } from "@/i18n/types";
import { getStoredLocale } from "@/i18n/locale";
import { formatLocaleBdt, formatLocaleUsd } from "@/i18n/format";

export type PricingStatusFilter = "all" | "published" | "draft" | "popular";
export type PricingSort = "newest" | "oldest" | "price-asc" | "price-desc" | "name" | "sort-order";

export interface IAdminPricingStats {
  total: number;
  published: number;
  draft: number;
  popular: number;
  avgPriceBdt: number;
  newThisMonth: number;
}

export interface IPricingStatusSlice {
  key: "published" | "draft" | "popular";
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export type PortalTranslate = (key: string, params?: Record<string, string>) => string;

export function pctOfTotal(part: number, total: number, t: PortalTranslate): string {
  if (total <= 0) return t("stats.zeroOfTotal");
  const pctValue = Math.round((part / total) * 1000) / 10;
  return t("stats.ofTotal", { pct: String(pctValue) });
}

export function computePricingStats(
  packages: AdminPricingPackage[]
): IAdminPricingStats {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const published = packages.filter((p) => p.showOnWebsite).length;
  const draft = packages.filter((p) => !p.showOnWebsite).length;
  const popular = packages.filter((p) => p.popular).length;
  const avgPriceBdt =
    packages.length === 0
      ? 0
      : Math.round(
          packages.reduce((sum, p) => sum + p.priceBdt, 0) / packages.length
        );

  return {
    total: packages.length,
    published,
    draft,
    popular,
    avgPriceBdt,
    newThisMonth: packages.filter((p) => {
      if (!p.createdAt) return false;
      const d = new Date(p.createdAt);
      return d.getMonth() === month && d.getFullYear() === year;
    }).length,
  };
}

export function buildStatusOverview(
  packages: AdminPricingPackage[]
): IPricingStatusSlice[] {
  const total = packages.length || 1;
  const published = packages.filter((p) => p.showOnWebsite).length;
  const draft = packages.filter((p) => !p.showOnWebsite).length;
  const popular = packages.filter((p) => p.popular).length;

  return [
    {
      key: "published",
      label: "Published",
      count: published,
      percentage: Math.round((published / total) * 100),
      color: "#32C991",
    },
    {
      key: "draft",
      label: "Draft",
      count: draft,
      percentage: Math.round((draft / total) * 100),
      color: "#9CA3AF",
    },
    {
      key: "popular",
      label: "Popular",
      count: popular,
      percentage: Math.round((popular / total) * 100),
      color: "#D4A853",
    },
  ];
}

export function uniquePeriods(packages: AdminPricingPackage[]): string[] {
  const set = new Set(
    packages.map((p) => p.period.trim()).filter(Boolean)
  );
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function filterPricingPackages(
  packages: AdminPricingPackage[],
  opts: {
    search: string;
    status: PricingStatusFilter;
    period: string;
    sortBy: PricingSort;
  }
): AdminPricingPackage[] {
  const q = opts.search.trim().toLowerCase();

  let list = packages.filter((item) => {
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q) ||
      item.features.some((f) => f.toLowerCase().includes(q));

    const matchesStatus =
      opts.status === "all" ||
      (opts.status === "published" && item.showOnWebsite) ||
      (opts.status === "draft" && !item.showOnWebsite) ||
      (opts.status === "popular" && item.popular);

    const matchesPeriod =
      !opts.period ||
      item.period.toLowerCase() === opts.period.toLowerCase();

    return matchesSearch && matchesStatus && matchesPeriod;
  });

  list = [...list].sort((a, b) => {
    switch (opts.sortBy) {
      case "oldest":
        return (
          new Date(a.createdAt ?? 0).getTime() -
          new Date(b.createdAt ?? 0).getTime()
        );
      case "price-asc":
        return a.priceBdt - b.priceBdt;
      case "price-desc":
        return b.priceBdt - a.priceBdt;
      case "name":
        return a.name.localeCompare(b.name);
      case "sort-order":
        return a.sortOrder - b.sortOrder;
      case "newest":
      default:
        return (
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
        );
    }
  });

  return list;
}

export function periodBadgeClass(period: string): string {
  const key = period.toLowerCase();
  if (key.includes("month")) return "bg-primary/15 text-primary-dark";
  if (key.includes("quarter")) return "bg-orange-100 text-orange-700";
  if (key.includes("year") || key.includes("annual"))
    return "bg-violet-100 text-violet-700";
  if (key.includes("one") || key.includes("once"))
    return "bg-purple-100 text-purple-700";
  return "bg-portal-muted/50 text-portal-heading";
}

const PACKAGE_ICON_COLORS = [
  "bg-primary/15 text-primary-dark",
  "bg-gold/20 text-gold-dark",
  "bg-violet-100 text-violet-700",
  "bg-sky-100 text-sky-700",
  "bg-orange-100 text-orange-700",
];

export function packageIconClass(index: number, popular: boolean): string {
  if (popular) return "bg-gold/25 text-gold-dark";
  return PACKAGE_ICON_COLORS[index % PACKAGE_ICON_COLORS.length];
}

export function formatBdt(amount: number, locale: LocaleType = getStoredLocale() ?? "en"): string {
  return formatLocaleBdt(locale, amount);
}

export function formatUsd(amount: number, locale: LocaleType = getStoredLocale() ?? "en"): string {
  return formatLocaleUsd(locale, amount);
}

export function exportPricingFile(packages: AdminPricingPackage[]): void {
  const header = [
    "Name",
    "Slug",
    "Price BDT",
    "Price USD",
    "Period",
    "Popular",
    "Published",
    "Sort Order",
    "Features",
  ];
  const rows = packages.map((p) =>
    [
      p.name,
      p.slug,
      p.priceBdt,
      p.priceUsd,
      p.period,
      p.popular ? "Yes" : "No",
      p.showOnWebsite ? "Yes" : "No",
      p.sortOrder,
      p.features.join("; "),
    ]
      .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `boq-pricing-packages-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
