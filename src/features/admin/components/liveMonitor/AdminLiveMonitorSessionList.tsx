import { Timer } from "lucide-react";
import type { LiveMonitorSession } from "@/types/models";
import { LiveMonitorJoinBadge } from "@/features/admin/components/liveMonitor/LiveMonitorJoinBadge";
import { LiveMonitorPhaseBadge } from "@/features/admin/components/liveMonitor/LiveMonitorPhaseBadge";
import {
  formatSessionTiming,
  sessionHasIssue,
  sessionIssueMessage,
} from "@/features/admin/components/liveMonitor/liveMonitorUtils";
import { cn } from "@/lib/utils/cn";

interface IAdminLiveMonitorSessionListProps {
  sessions: LiveMonitorSession[];
  selectedId?: string;
  now: number;
  onSelect: (session: LiveMonitorSession) => void;
}

export function AdminLiveMonitorSessionList({
  sessions,
  selectedId,
  now,
  onSelect,
}: IAdminLiveMonitorSessionListProps) {
  if (sessions.length === 0) return null;

  return (
    <div className="rounded-2xl border border-portal bg-portal-surface shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="border-b border-portal px-4 py-3.5 sm:px-5">
        <h2 className="text-sm font-bold text-portal-heading">Today&apos;s sessions</h2>
        <p className="text-xs text-portal-muted">Select a session to inspect join status and details.</p>
      </div>
      <div className="divide-y divide-portal">
        {sessions.map((session) => {
          const selected = session._id === selectedId;
          const issue = sessionHasIssue(session);
          const issueMessage = sessionIssueMessage(session);

          return (
            <button
              key={session._id}
              type="button"
              onClick={() => onSelect(session)}
              className={cn(
                "flex w-full flex-col gap-2 px-4 py-3.5 text-left transition sm:px-5",
                selected
                  ? "bg-primary/5"
                  : "hover:bg-portal-muted/30",
                session.sessionPhase === "live" && !selected && "bg-red-500/[0.03]"
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <LiveMonitorPhaseBadge phase={session.sessionPhase} />
                <span className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums text-portal-muted">
                  <Timer className="size-3.5" aria-hidden />
                  {session.startTimeLabel}
                </span>
                <span className="text-xs text-portal-muted">{formatSessionTiming(session, now)}</span>
              </div>
              <p className="text-sm font-semibold capitalize text-portal-heading">
                {session.classTitle}
              </p>
              <p className="text-xs text-portal-muted">
                {session.teacher.name} · {session.student.name}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <LiveMonitorJoinBadge role="Teacher" status={session.joins.teacherStatus} />
                <LiveMonitorJoinBadge role="Student" status={session.joins.studentStatus} />
              </div>
              {issue && issueMessage ? (
                <p className="text-xs font-semibold text-amber-700">{issueMessage}</p>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
