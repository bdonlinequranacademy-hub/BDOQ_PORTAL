import { Card } from "@/components/ui/Card";
import type { IAttendanceClassSegment } from "@/features/admin/components/attendance/adminAttendanceUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminAttendanceClassDonutProps {
  segments: IAttendanceClassSegment[];
  averageAttendance: number;
}

export function AdminAttendanceClassDonut({
  segments,
  averageAttendance,
}: IAdminAttendanceClassDonutProps) {
  const { t, formatNumber } = usePortalTranslation();
  const total = Math.max(segments.length, 1);

  let cursor = 0;
  const gradient = segments
    .map((segment) => {
      const pct = 100 / total;
      const start = cursor;
      cursor += pct;
      return `${segment.color} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <Card className="flex h-full flex-col rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">
        {t("admin.attendance.attendanceByClass")}
      </h2>
      <div className="mt-4 flex min-h-[220px] flex-1 flex-col items-center justify-center gap-4 sm:flex-row">
        <div
          className="relative size-32 shrink-0 rounded-full"
          style={{ background: gradient ? `conic-gradient(${gradient})` : "#E5E7EB" }}
          aria-hidden
        >
          <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-portal-surface text-center">
            <p className="text-2xl font-bold text-portal-heading">
              {formatNumber(averageAttendance)}%
            </p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
              {t("admin.attendance.average")}
            </p>
          </div>
        </div>
        <div className="flex w-full min-w-0 flex-1 flex-col gap-2.5 text-xs">
          {segments.length === 0 ? (
            <p className="text-sm text-portal-muted">{t("admin.attendance.noClassData")}</p>
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
                  {formatNumber(segment.percentage)}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}
