import { Card } from "@/components/ui/Card";
import type { IProgressDistributionSegment } from "@/features/admin/components/progress/adminProgressUtils";
import { pctOfTotal } from "@/features/admin/components/progress/adminProgressUtils";

interface IAdminProgressDistributionProps {
  segments: IProgressDistributionSegment[];
  totalRecords: number;
}

export function AdminProgressDistribution({
  segments,
  totalRecords,
}: IAdminProgressDistributionProps) {
  const total = Math.max(totalRecords, 1);

  let cursor = 0;
  const gradient = segments
    .filter((segment) => segment.count > 0)
    .map((segment) => {
      const pct = (segment.count / total) * 100;
      const start = cursor;
      cursor += pct;
      return `${segment.color} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">Progress distribution</h2>
      <p className="mt-0.5 text-xs text-portal-muted">{totalRecords} records tracked</p>
      <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
        <div
          className="relative size-28 shrink-0 rounded-full"
          style={{ background: gradient ? `conic-gradient(${gradient})` : "#E5E7EB" }}
          aria-hidden
        >
          <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-portal-surface text-center">
            <p className="text-xl font-bold text-portal-heading">{totalRecords}</p>
            <p className="text-[9px] font-semibold uppercase tracking-wide text-portal-muted">
              Total
            </p>
          </div>
        </div>
        <div className="flex w-full flex-1 flex-col gap-2 text-xs">
          {segments.map((segment) => (
            <div key={segment.label} className="flex items-center justify-between gap-2">
              <span className="flex min-w-0 items-center gap-2 text-portal-heading">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="truncate">
                  {segment.label}{" "}
                  <span className="text-portal-muted">({segment.range})</span>
                </span>
              </span>
              <span className="shrink-0 font-semibold tabular-nums text-portal-muted">
                {segment.count} · {pctOfTotal(segment.count, totalRecords)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
