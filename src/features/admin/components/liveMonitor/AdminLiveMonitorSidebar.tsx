import { Link } from "react-router-dom";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Radio,
  RefreshCw,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { LiveMonitorSession } from "@/types/models";
import {
  buildTodayActivity,
  computeJoinOverview,
  type ILiveMonitorJoinOverview,
} from "@/features/admin/components/liveMonitor/adminLiveMonitorUtils";
import { cn } from "@/lib/utils/cn";

interface IAdminLiveMonitorSidebarProps {
  sessions: LiveMonitorSession[];
  isFetching: boolean;
  onRefresh: () => void;
}

function JoinOverviewChart({ overview }: { overview: ILiveMonitorJoinOverview }) {
  const joined = overview.teacherJoined + overview.studentJoined;
  const late = overview.teacherLate + overview.studentLate;
  const missing = overview.teacherNotJoined + overview.studentNotJoined;
  const total = Math.max(joined + late + missing, 1);

  const segments = [
    { label: "Joined", value: joined, color: "#32C991" },
    { label: "Late", value: late, color: "#F59E0B" },
    { label: "Not joined", value: missing, color: "#EF4444" },
  ].filter((segment) => segment.value > 0);

  let cursor = 0;
  const gradient = segments
    .map((segment) => {
      const pct = (segment.value / total) * 100;
      const start = cursor;
      cursor += pct;
      return `${segment.color} ${start}% ${cursor}%`;
    })
    .join(", ");

  const joinRate = Math.round((joined / total) * 100);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-portal-heading">Join Overview</h2>
        <span className="text-[10px] font-semibold text-portal-muted">Today</span>
      </div>
      <div className="flex items-center gap-4">
        <div
          className="relative size-28 shrink-0 rounded-full"
          style={{ background: gradient ? `conic-gradient(${gradient})` : "#E5E7EB" }}
          aria-hidden
        >
          <div className="absolute inset-4 flex flex-col items-center justify-center rounded-full bg-portal-surface text-center">
            <p className="text-xl font-bold text-portal-heading">{joinRate}%</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
              Joined
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
              <span className="font-semibold tabular-nums">{segment.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function TodayActivityFeed({ sessions }: { sessions: LiveMonitorSession[] }) {
  const activity = buildTodayActivity(sessions);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-portal-heading">Class Activity</h2>
        <Link to="/admin/class-logs" className="text-xs font-semibold text-primary hover:underline">
          View logs
        </Link>
      </div>
      {activity.length === 0 ? (
        <p className="text-sm text-portal-muted">No activity recorded yet today.</p>
      ) : (
        <div className="flex max-h-[280px] flex-col gap-3 overflow-y-auto pr-1">
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

function QuickActions({
  onRefresh,
  isFetching,
}: {
  onRefresh: () => void;
  isFetching: boolean;
}) {
  const actions = [
    { label: "Refresh monitor", icon: RefreshCw, onClick: onRefresh, pending: isFetching },
    { label: "Academy routine", icon: CalendarDays, to: "/admin/schedule/routine" },
    { label: "Class logs", icon: FileText, to: "/admin/class-logs" },
    { label: "Attendance", icon: ClipboardList, to: "/admin/attendance" },
  ];

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <h2 className="mb-4 text-sm font-bold text-portal-heading">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-2.5">
        {actions.map(({ label, icon: Icon, to, onClick, pending }) => {
          const className =
            "inline-flex flex-col items-start gap-2 rounded-xl border border-portal bg-portal-muted/20 px-3 py-3 text-left text-xs font-semibold text-portal-heading transition hover:border-primary/25 hover:bg-primary/5 hover:text-primary";

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
              <Icon className={cn("size-4 text-primary", pending && "animate-spin")} aria-hidden />
              {pending ? "Refreshing…" : label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

export function AdminLiveMonitorSidebar({
  sessions,
  isFetching,
  onRefresh,
}: IAdminLiveMonitorSidebarProps) {
  const overview = computeJoinOverview(sessions);

  return (
    <aside className="flex flex-col gap-4">
      <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
        <div className="flex items-center gap-2">
          <Radio className="size-4 text-red-600" aria-hidden />
          <p className="text-sm font-bold text-portal-heading">Monitor status</p>
        </div>
        <p className="mt-2 text-sm text-portal-muted">
          {overview.total} session{overview.total === 1 ? "" : "s"} tracked today. Join status
          updates when users launch from their portal schedule.
        </p>
      </Card>
      <JoinOverviewChart overview={overview} />
      <TodayActivityFeed sessions={sessions} />
      <QuickActions onRefresh={onRefresh} isFetching={isFetching} />
    </aside>
  );
}
