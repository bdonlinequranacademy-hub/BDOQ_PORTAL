import { Link } from "react-router-dom";
import {
  Download,
  MonitorPlay,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { SessionSlotView } from "@/types/models";
import { SessionStatusBadge } from "@/components/schedule/SessionStatusBadge";
import {
  exportRoutineFile,
  getTodayRoutineSessions,
  type IAdminRoutineStats,
} from "@/features/admin/components/routine/adminRoutineUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";

interface IAdminRoutineSidebarProps {
  sessions: SessionSlotView[];
  allSessions: SessionSlotView[];
  stats: IAdminRoutineStats;
  nowMs: number;
  onResync: () => void;
  resyncPending: boolean;
}

function AdminRoutineTodaySchedule({
  sessions,
  nowMs,
}: {
  sessions: SessionSlotView[];
  nowMs: number;
}) {
  const { t } = usePortalTranslation();
  const todaySessions = getTodayRoutineSessions(sessions, nowMs);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-portal-heading">
          {t("admin.routine.sidebar.todaySchedule")}
        </h2>
        <Link to="/admin/live-monitor" className="text-xs font-semibold text-primary hover:underline">
          {t("actions.viewAll")}
        </Link>
      </div>
      {todaySessions.length === 0 ? (
        <p className="text-sm text-portal-muted">{t("admin.routine.sidebar.noSessionsToday")}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {todaySessions.slice(0, 5).map((session) => (
            <div key={session._id} className="relative border-l-2 border-primary/30 pl-3">
              <p className="text-xs font-semibold tabular-nums text-primary">
                {session.times.academy.time}
              </p>
              <p className="text-sm font-semibold capitalize text-portal-heading">
                {session.classTitle}
              </p>
              <p className="text-xs text-portal-muted">{session.teacher.name}</p>
              <div className="mt-1.5">
                <SessionStatusBadge session={session} routineView compact />
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function AdminRoutineWeeklyOverview({ stats }: { stats: IAdminRoutineStats }) {
  const { t } = usePortalTranslation();

  const segments = [
    { label: t("admin.routine.sidebar.segmentLiveNow"), value: stats.liveNow, color: "#32C991" },
    {
      label: t("admin.routine.sidebar.segmentStartingSoon"),
      value: stats.upcomingToday,
      color: "#F59E0B",
    },
    {
      label: t("admin.routine.sidebar.segmentWeeklyScheduled"),
      value: stats.scheduledWeekly,
      color: "#3B82F6",
    },
    {
      label: t("admin.routine.sidebar.segmentCompletedToday"),
      value: stats.completedToday,
      color: "#9CA3AF",
    },
  ].filter((segment) => segment.value > 0);

  const total = stats.total || 1;
  let cursor = 0;
  const gradientParts = segments.map((segment) => {
    const pct = (segment.value / total) * 100;
    const start = cursor;
    cursor += pct;
    return `${segment.color} ${start}% ${cursor}%`;
  });
  const gradient =
    gradientParts.length > 0 ? gradientParts.join(", ") : "#E5E7EB 0% 100%";

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-portal-heading">
          {t("admin.routine.sidebar.weeklyOverview")}
        </h2>
        <span className="rounded-lg border border-portal px-2 py-1 text-[10px] font-semibold text-portal-muted">
          {t("admin.routine.sidebar.thisWeek")}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div
          className="relative size-28 shrink-0 rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
          aria-hidden
        >
          <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-portal-surface text-center">
            <p className="text-xl font-bold text-portal-heading">{stats.total}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
              {t("admin.routine.sidebar.total")}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2 text-xs">
          {segments.length === 0 ? (
            <p className="text-portal-muted">{t("admin.routine.sidebar.noSessionData")}</p>
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
                <span className="font-semibold tabular-nums">
                  {Math.round((segment.value / total) * 100)}%
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}

function AdminRoutineQuickActions({
  allSessions,
  onResync,
  resyncPending,
}: {
  allSessions: SessionSlotView[];
  onResync: () => void;
  resyncPending: boolean;
}) {
  const { t } = usePortalTranslation();

  const actions = [
    {
      label: t("admin.routine.sidebar.newClass"),
      icon: Plus,
      to: "/admin/classes/new",
      onClick: undefined as (() => void) | undefined,
    },
    {
      label: t("admin.routine.sidebar.resyncSlots"),
      icon: RefreshCw,
      to: undefined,
      onClick: onResync,
      pending: resyncPending,
    },
    {
      label: t("admin.routine.sidebar.exportRoutine"),
      icon: Download,
      to: undefined,
      onClick: () => exportRoutineFile(allSessions),
    },
    {
      label: t("admin.routine.sidebar.liveMonitor"),
      icon: MonitorPlay,
      to: "/admin/live-monitor",
      onClick: undefined as (() => void) | undefined,
    },
  ];

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="mb-4 text-sm font-bold text-portal-heading">
        {t("admin.routine.sidebar.quickActions")}
      </h2>
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map(({ label, icon: Icon, to, onClick, pending }) => {
          const className = cn(
            "inline-flex flex-col items-start gap-2 rounded-xl border border-portal bg-portal-muted/20 px-3 py-3 text-left text-xs font-semibold text-portal-heading transition hover:border-primary/25 hover:bg-primary/5 hover:text-primary"
          );

          if (to) {
            return (
              <Link key={label} to={to} className={className}>
                <Icon className="size-4 text-primary" aria-hidden />
                {label}
              </Link>
            );
          }

          return (
            <button
              key={label}
              type="button"
              onClick={onClick}
              disabled={pending}
              className={className}
            >
              <Icon
                className={cn("size-4 text-primary", pending && "animate-spin")}
                aria-hidden
              />
              {pending ? t("admin.routine.syncing") : label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export function AdminRoutineSidebar({
  sessions,
  allSessions,
  stats,
  nowMs,
  onResync,
  resyncPending,
}: IAdminRoutineSidebarProps) {
  return (
    <aside className="flex flex-col gap-4">
      <AdminRoutineTodaySchedule sessions={sessions} nowMs={nowMs} />
      <AdminRoutineWeeklyOverview stats={stats} />
      <AdminRoutineQuickActions
        allSessions={allSessions}
        onResync={onResync}
        resyncPending={resyncPending}
      />
    </aside>
  );
}
