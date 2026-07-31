import { Card } from "@/components/ui/Card";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import type { ClassLogView } from "@/types/models";
import {
  getProgramLabel,
} from "@/features/admin/components/earnings/adminEarningsUtils";
import { formatLogDateLabel } from "@/features/admin/components/class-logs/adminClassLogsUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminEarningsSidebarProps {
  upcomingLogs: ClassLogView[];
  recentLogs: ClassLogView[];
}

function UpcomingPending({ logs }: { logs: ClassLogView[] }) {
  const { t, statusLabel, formatBdt } = usePortalTranslation();

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">
        {t("admin.earnings.sidebarUpcomingPending")}
      </h2>
      {logs.length === 0 ? (
        <p className="mt-3 text-sm text-portal-muted">{t("admin.classLogs.noClassLogs")}</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {logs.map((log) => (
            <div
              key={log._id}
              className="flex items-center justify-between gap-3 rounded-xl border border-portal/80 bg-portal-muted/20 px-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <UserInitialAvatar name={log.teacher.name} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-portal-heading">
                    {log.teacher.name}
                  </p>
                  <p className="text-xs text-amber-700">{statusLabel("pending")}</p>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-portal-heading">
                  {log.earningsBdt != null ? formatBdt(log.earningsBdt) : "—"}
                </p>
                <p className="text-[11px] text-portal-muted">
                  {formatLogDateLabel(log.sessionDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function RecentVerified({ logs }: { logs: ClassLogView[] }) {
  const { t, statusLabel, formatBdt } = usePortalTranslation();

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">
        {t("admin.earnings.sidebarRecentVerified")}
      </h2>
      {logs.length === 0 ? (
        <p className="mt-3 text-sm text-portal-muted">{t("admin.classLogs.noClassLogs")}</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {logs.map((log) => (
            <div
              key={log._id}
              className="flex items-center justify-between gap-3 border-b border-portal/70 pb-3 last:border-b-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold tabular-nums text-portal-muted">
                  {formatLogDateLabel(log.sessionDate)}
                </p>
                <p className="truncate text-sm font-semibold text-portal-heading">
                  {log.teacher.name}
                </p>
                <p className="truncate text-xs text-portal-muted">{getProgramLabel(log)}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-bold text-emerald-700">
                  {log.earningsBdt != null ? formatBdt(log.earningsBdt) : "—"}
                </p>
                <span className="mt-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  {statusLabel("approved")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function AdminEarningsSidebar({
  upcomingLogs,
  recentLogs,
}: IAdminEarningsSidebarProps) {
  return (
    <aside className="flex flex-col gap-4">
      <UpcomingPending logs={upcomingLogs} />
      <RecentVerified logs={recentLogs} />
    </aside>
  );
}
