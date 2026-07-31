import { Card } from "@/components/ui/Card";
import type { IRatingDistributionRow } from "@/features/admin/components/testimonials/adminTestimonialsUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminTestimonialsRatingDistributionProps {
  rows: IRatingDistributionRow[];
  total: number;
}

export function AdminTestimonialsRatingDistribution({
  rows,
  total,
}: IAdminTestimonialsRatingDistributionProps) {
  const { t } = usePortalTranslation();

  return (
    <Card className="flex flex-col rounded-[8px] border border-portal bg-portal-surface p-3.5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-4">
      <h2 className="text-sm font-bold text-portal-heading">{t("admin.cms.shared.ratingDistribution")}</h2>
      <p className="mt-0.5 text-xs text-portal-muted">{total} reviews tracked</p>
      <div className="mt-3 flex flex-col gap-2">
        {rows.map((row) => (
          <div key={row.stars}>
            <div className="mb-0.5 flex items-center justify-between gap-2 text-xs">
              <span className="font-medium text-portal-heading">{row.stars} stars</span>
              <span className="tabular-nums text-portal-muted">
                {row.count} · {row.percentage}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-portal-muted/40">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${row.percentage}%`,
                  backgroundColor: row.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
