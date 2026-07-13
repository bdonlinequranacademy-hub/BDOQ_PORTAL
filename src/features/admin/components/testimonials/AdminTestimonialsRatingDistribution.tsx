import { Card } from "@/components/ui/Card";
import type { IRatingDistributionRow } from "@/features/admin/components/testimonials/adminTestimonialsUtils";

interface IAdminTestimonialsRatingDistributionProps {
  rows: IRatingDistributionRow[];
  total: number;
}

export function AdminTestimonialsRatingDistribution({
  rows,
  total,
}: IAdminTestimonialsRatingDistributionProps) {
  return (
    <Card className="flex h-full flex-col rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">Rating distribution</h2>
      <p className="mt-0.5 text-xs text-portal-muted">{total} reviews tracked</p>
      <div className="mt-4 flex flex-1 flex-col gap-2.5">
        {rows.map((row) => (
          <div key={row.stars}>
            <div className="mb-1 flex items-center justify-between gap-2 text-xs">
              <span className="font-medium text-portal-heading">{row.stars} stars</span>
              <span className="tabular-nums text-portal-muted">
                {row.count} · {row.percentage}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-portal-muted/40">
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
