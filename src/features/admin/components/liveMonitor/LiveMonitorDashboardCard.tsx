import { useNavigate } from "react-router-dom";
import { AlertTriangle, ChevronRight } from "lucide-react";
import type { TodaySessionDashboardItem } from "@/types/models";
import { LiveMonitorJoinBadge } from "./LiveMonitorJoinBadge";
import { LiveMonitorPhaseBadge } from "./LiveMonitorPhaseBadge";
import { cn } from "@/lib/utils/cn";

interface ILiveMonitorDashboardCardProps {
  session: TodaySessionDashboardItem;
}

function hasIssue(session: TodaySessionDashboardItem): boolean {
  return Boolean(
    session.alerts?.teacherLate ||
      session.alerts?.studentNoShow ||
      session.alerts?.teacherNoShow
  );
}

export function LiveMonitorDashboardCard({ session }: ILiveMonitorDashboardCardProps) {
  const navigate = useNavigate();
  const issue = hasIssue(session);

  return (
    <button
      type="button"
      onClick={() => navigate(`/admin/classes/${session.classId}`)}
      className={cn(
        "group flex w-full items-stretch gap-3 rounded-2xl border p-4 text-left shadow-sm transition",
        "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        session.sessionPhase === "live"
          ? "border-red-500/35 bg-gradient-to-br from-red-500/8 to-portal-surface dark:from-red-500/12"
          : issue
            ? "border-amber-500/30 bg-gradient-to-br from-amber-500/8 to-portal-surface dark:from-amber-500/10"
            : "border-portal bg-portal-surface hover:border-primary/25"
      )}
    >
      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <LiveMonitorPhaseBadge phase={session.sessionPhase} />
          <span className="text-xs font-semibold tabular-nums text-portal-muted">
            {session.startTimeLabel}
          </span>
          {issue ? (
            <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400" />
          ) : null}
        </div>
        <p className="truncate font-semibold text-portal-heading">{session.classTitle}</p>
        <p className="truncate text-xs text-portal-muted">
          {session.teacherName} · {session.studentName}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <LiveMonitorJoinBadge
            role="Teacher"
            status={session.teacherJoined ? "joined" : "not_joined"}
          />
          <LiveMonitorJoinBadge
            role="Student"
            status={session.studentJoined ? "joined" : "not_joined"}
          />
        </div>
      </div>
      <ChevronRight className="size-4 shrink-0 self-center text-portal-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
    </button>
  );
}
