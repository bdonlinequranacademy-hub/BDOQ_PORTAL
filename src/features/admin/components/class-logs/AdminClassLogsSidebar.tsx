import { Link } from "react-router-dom";
import { Download, FileText, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { ClassLogView } from "@/types/models";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import {
  buildClassLogActivity,
  computeClassLogsStats,
  exportClassLogsFile,
  pendingLogsByTeacher,
} from "@/features/admin/components/class-logs/adminClassLogsUtils";
import { cn } from "@/lib/utils/cn";

interface IAdminClassLogsSidebarProps {
  logs: ClassLogView[];
  isFetching: boolean;
  onRefresh: () => void;
}

function LogSummaryChart({ logs }: { logs: ClassLogView[] }) {
  const { t, statusLabel, formatNumber } = usePortalTranslation();
  const stats = computeClassLogsStats(logs);
  const segments = [
    { label: statusLabel("pending"), value: stats.pending, color: "#F59E0B" },
    { label: statusLabel("approved"), value: stats.approved, color: "#32C991" },
    { label: statusLabel("rejected"), value: stats.rejected, color: "#EF4444" },
  ].filter((segment) => segment.value > 0);

  const total = Math.max(stats.total, 1);
  let cursor = 0;
  const gradient = segments
    .map((segment) => {
      const pct = (segment.value / total) * 100;
      const start = cursor;
      cursor += pct;
      return `${segment.color} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">{t("admin.classLogs.logSummary")}</h2>
      <div className="mt-4 flex items-center gap-4">
        <div
          className="relative size-28 shrink-0 rounded-full"
          style={{ background: gradient ? `conic-gradient(${gradient})` : "#E5E7EB" }}
          aria-hidden
        >
          <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-portal-surface text-center">
            <p className="text-xl font-bold text-portal-heading">{formatNumber(stats.total)}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
              {t("labels.total")}
            </p>
          </div>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2 text-xs">
          {segments.map((segment) => (
            <div key={segment.label} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-portal-heading">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                {segment.label}
              </span>
              <span className="font-semibold tabular-nums">
                {formatNumber(Math.round((segment.value / total) * 100))}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function PendingByTeacher({ logs }: { logs: ClassLogView[] }) {
  const { t, formatNumber } = usePortalTranslation();
  const rows = pendingLogsByTeacher(logs).slice(0, 6);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">{t("admin.classLogs.pendingByTeacher")}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-portal-muted">{t("admin.classLogs.noPendingLogs")}</p>
      ) : (
        <div className="mt-4 flex flex-col gap-2.5">
          {rows.map((row) => (
            <div key={row.teacherId} className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-medium text-portal-heading">{row.teacherName}</span>
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                {formatNumber(row.pendingCount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function RecentActivity({ logs }: { logs: ClassLogView[] }) {
  const { t } = usePortalTranslation();
  const activity = buildClassLogActivity(logs);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="text-sm font-bold text-portal-heading">{t("admin.classLogs.recentActivity")}</h2>
      {activity.length === 0 ? (
        <p className="mt-3 text-sm text-portal-muted">{t("admin.classLogs.noRecentSubmissions")}</p>
      ) : (
        <div className="mt-4 flex max-h-[240px] flex-col gap-3 overflow-y-auto pr-1">
          {activity.map((item) => (
            <div key={item.id} className="relative border-l-2 border-primary/25 pl-3">
              <p className="text-xs font-semibold tabular-nums text-primary">{item.timeLabel}</p>
              <p className="text-sm font-semibold text-portal-heading">{item.title}</p>
              {item.detail ? <p className="text-xs text-portal-muted">{item.detail}</p> : null}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export function AdminClassLogsSidebar({
  logs,
  isFetching,
  onRefresh,
}: IAdminClassLogsSidebarProps) {
  const { t } = usePortalTranslation();
  const pendingLogs = logs.filter((log) => log.status === "pending");

  const actions = [
    {
      id: "refresh",
      label: t("actions.refresh"),
      icon: RefreshCw,
      onClick: onRefresh,
      pending: isFetching,
    },
    {
      id: "export-pending",
      label: t("admin.classLogs.exportPending"),
      icon: Download,
      onClick: () => exportClassLogsFile(pendingLogs, "pending-class-logs"),
    },
    {
      id: "export-all",
      label: t("admin.classLogs.exportAll"),
      icon: Download,
      onClick: () => exportClassLogsFile(logs, "class-logs"),
    },
    {
      id: "earnings",
      label: t("admin.classLogs.earnings"),
      icon: FileText,
      to: "/admin/earnings",
    },
  ];

  return (
    <aside className="flex flex-col gap-4">
      <LogSummaryChart logs={logs} />
      <PendingByTeacher logs={logs} />
      <RecentActivity logs={logs} />
      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <h2 className="mb-4 text-sm font-bold text-portal-heading">{t("admin.classLogs.quickActions")}</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {actions.map(({ id, label, icon: Icon, to, onClick, pending }) => {
            const className =
              "inline-flex flex-col items-start gap-2 rounded-xl border border-portal bg-portal-muted/20 px-3 py-3 text-left text-xs font-semibold text-portal-heading transition hover:border-primary/25 hover:bg-primary/5 hover:text-primary";

            if (to) {
              return (
                <Link key={id} to={to} className={className}>
                  <Icon className="size-4 text-primary" aria-hidden />
                  {label}
                </Link>
              );
            }

            return (
              <button
                key={id}
                type="button"
                onClick={onClick}
                disabled={pending}
                className={className}
              >
                <Icon className={cn("size-4 text-primary", pending && "animate-spin")} aria-hidden />
                {pending ? t("actions.refreshing") : label}
              </button>
            );
          })}
        </div>
      </Card>
    </aside>
  );
}
