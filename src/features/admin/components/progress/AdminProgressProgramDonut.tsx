import { Card } from "@/components/ui/Card";
import type { IProgressProgramSegment } from "@/features/admin/components/progress/adminProgressUtils";

interface IAdminProgressProgramDonutProps {
  segments: IProgressProgramSegment[];
  overallAvg: number;
  totalRecords: number;
}

export function AdminProgressProgramDonut({
  segments,
  overallAvg,
  totalRecords,
}: IAdminProgressProgramDonutProps) {
  const total = Math.max(totalRecords, 1);

  let cursor = 0;
  const gradient = segments
    .map((segment) => {
      const pct = (segment.count / total) * 100;
      const start = cursor;
      cursor += pct;
      return `${segment.color} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <Card className="flex h-full flex-col rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">Progress by program</h2>
      <div className="mt-4 flex min-h-[220px] flex-1 flex-col items-center justify-center gap-4 sm:flex-row">
        <div
          className="relative size-32 shrink-0 rounded-full"
          style={{ background: gradient ? `conic-gradient(${gradient})` : "#E5E7EB" }}
          aria-hidden
        >
          <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-portal-surface text-center">
            <p className="text-2xl font-bold text-portal-heading">{overallAvg}%</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
              Overall avg.
            </p>
          </div>
        </div>
        <div className="flex w-full min-w-0 flex-1 flex-col gap-2.5 text-xs">
          {segments.length === 0 ? (
            <p className="text-sm text-portal-muted">No program data yet.</p>
          ) : (
            segments.map((segment) => (
              <div key={segment.label} className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2 text-portal-heading">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="truncate">{segment.label}</span>
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-portal-muted">
                  {Math.round((segment.count / total) * 100)}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
