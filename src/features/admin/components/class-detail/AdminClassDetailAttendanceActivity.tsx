import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { AttendanceOverview, ClassLogView } from "@/types/models";
import { ClassLogCard } from "@/components/schedule/ClassLogCard";
import { cn } from "@/lib/utils/cn";

interface IAdminClassDetailAttendanceTabProps {
  overview: AttendanceOverview[];
}

export function AdminClassDetailAttendanceTab({
  overview,
}: IAdminClassDetailAttendanceTabProps) {
  const { t, statusLabel, formatNumber } = usePortalTranslation();

  if (overview.length === 0) {
    return (
      <Card className="rounded-2xl border border-portal bg-portal-surface p-6 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="text-sm font-bold text-portal-heading">{t("admin.classDetail.attendanceOverview")}</h2>
        <p className="mt-2 text-sm text-portal-muted">
          {t("admin.classDetail.noAttendanceRecords")}
        </p>
        <Link
          to="/admin/attendance"
          className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          {t("admin.classDetail.openAttendanceAnalytics")}
        </Link>
      </Card>
    );
  }

  const avgPct = Math.round(
    overview.reduce((sum, item) => sum + item.percentage, 0) / overview.length
  );
  const totalPresent = overview.reduce((sum, item) => sum + item.present, 0);
  const totalAbsent = overview.reduce((sum, item) => sum + item.absent, 0);
  const totalTracked = totalPresent + totalAbsent;

  const presentPct = totalTracked > 0 ? Math.round((totalPresent / totalTracked) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="text-sm font-bold text-portal-heading">{t("admin.classDetail.attendanceOverview")}</h2>
        <div className="mt-4 flex flex-col items-center gap-4">
          <div
            className="relative size-36 rounded-full"
            style={{
              background: `conic-gradient(#32C991 0% ${presentPct}%, #F59E0B ${presentPct}% 100%)`,
            }}
            aria-hidden
          >
            <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-portal-surface text-center">
              <p className="text-2xl font-bold text-portal-heading">{formatNumber(avgPct)}%</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
                {t("admin.classDetail.avg")}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-portal-heading">
                <span className="size-2.5 rounded-full bg-primary" />
                {statusLabel("present")}
              </span>
              <span className="font-semibold">{formatNumber(totalPresent)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-portal-heading">
                <span className="size-2.5 rounded-full bg-amber-500" />
                {statusLabel("absent")}
              </span>
              <span className="font-semibold">{formatNumber(totalAbsent)}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="mb-4 text-sm font-bold text-portal-heading">{t("admin.classDetail.studentAttendance")}</h2>
        <div className="flex flex-col gap-3">
          {overview.map((item) => (
            <div
              key={item.class._id ?? item.class.title}
              className="rounded-xl border border-portal/80 bg-portal-muted/20 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-portal-heading">{item.class.title}</p>
                  <p className="text-xs text-portal-muted">
                    {t("admin.classDetail.presentAbsent", {
                      present: formatNumber(item.present),
                      absent: formatNumber(item.absent),
                    })}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-bold",
                    item.percentage >= 80
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  )}
                >
                  {formatNumber(item.percentage)}%
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-portal-muted/60">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

interface IAdminClassDetailActivityTabProps {
  logs: ClassLogView[];
}

export function AdminClassDetailActivityTab({ logs }: IAdminClassDetailActivityTabProps) {
  const { t } = usePortalTranslation();

  if (logs.length === 0) {
    return (
      <Card className="rounded-2xl border border-portal bg-portal-surface p-6 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="text-sm font-bold text-portal-heading">{t("admin.classDetail.activityLog")}</h2>
        <p className="mt-2 text-sm text-portal-muted">
          {t("admin.classDetail.noSessionLogs")}
        </p>
        <Link
          to="/admin/class-logs"
          className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          {t("admin.classDetail.viewAllClassLogs")}
        </Link>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-portal-heading">{t("admin.classDetail.recentSessionLogs")}</h2>
        <Link to="/admin/class-logs" className="text-xs font-semibold text-primary hover:underline">
          {t("actions.viewAll")}
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {logs.slice(0, 5).map((log) => (
          <ClassLogCard key={log._id} log={log} showTeacher />
        ))}
      </div>
    </div>
  );
}
