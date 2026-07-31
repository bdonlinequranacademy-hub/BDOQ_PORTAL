import { Card } from "@/components/ui/Card";
import type { IPricingStatusSlice } from "@/features/admin/components/pricing/adminPricingUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminPricingStatusOverviewProps {
  slices: IPricingStatusSlice[];
  total: number;
  onSelect?: (key: IPricingStatusSlice["key"]) => void;
}

export function AdminPricingStatusOverview({
  slices,
  total,
  onSelect,
}: IAdminPricingStatusOverviewProps) {
  const { t } = usePortalTranslation();

  const published = slices.find((s) => s.key === "published");
  const publishedPct = published?.percentage ?? 0;

  const gradientStops = buildConicGradient(slices, total);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">Package Status Overview</h2>
      <p className="mt-0.5 text-xs text-portal-muted">
        {total} package{total === 1 ? "" : "s"} in CMS
      </p>

      <div className="mt-5 flex items-center gap-4">
        <div
          className="relative size-28 shrink-0 rounded-full"
          style={{ background: gradientStops }}
          aria-hidden
        >
          <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-portal-surface">
            <span className="text-lg font-bold text-portal-heading">{publishedPct}%</span>
            <span className="text-[10px] font-medium text-portal-muted">{t("admin.common.statPublished")}</span>
          </div>
        </div>

        <ul className="min-w-0 flex-1 space-y-2.5">
          {slices.map((slice) => (
            <li key={slice.key}>
              <button
                type="button"
                onClick={() => onSelect?.(slice.key)}
                className="flex w-full items-center justify-between gap-2 rounded-lg text-left transition hover:bg-portal-muted/20"
              >
                <span className="flex items-center gap-2 text-xs font-medium text-portal-heading">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: slice.color }}
                  />
                  {slice.label}
                </span>
                <span className="text-xs tabular-nums text-portal-muted">
                  {slice.count} · {slice.percentage}%
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

function buildConicGradient(slices: IPricingStatusSlice[], total: number): string {
  if (total <= 0) {
    return "conic-gradient(#E5E7EB 0deg 360deg)";
  }

  const published = slices.find((s) => s.key === "published")?.count ?? 0;
  const draft = slices.find((s) => s.key === "draft")?.count ?? 0;
  const publishedDeg = (published / total) * 360;
  const draftDeg = (draft / total) * 360;

  return `conic-gradient(#32C991 0deg ${publishedDeg}deg, #9CA3AF ${publishedDeg}deg ${publishedDeg + draftDeg}deg, #E5E7EB ${publishedDeg + draftDeg}deg 360deg)`;
}
