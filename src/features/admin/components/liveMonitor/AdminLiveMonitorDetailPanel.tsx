import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CalendarDays,
  Clock,
  GraduationCap,
  Timer,
  User,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import type { LiveMonitorSession } from "@/types/models";
import { normalizeMeetingLink } from "@/lib/utils/meetingLink";
import { LiveMonitorJoinBadge } from "@/features/admin/components/liveMonitor/LiveMonitorJoinBadge";
import { LiveMonitorPhaseBadge } from "@/features/admin/components/liveMonitor/LiveMonitorPhaseBadge";
import {
  AdminLiveMonitorOpenLink,
  AdminLiveMonitorSessionCode,
} from "@/features/admin/components/liveMonitor/AdminLiveMonitorHero";
import {
  buildSessionActivity,
  formatLiveElapsed,
  sessionShortCode,
  type LiveMonitorDetailTab,
} from "@/features/admin/components/liveMonitor/adminLiveMonitorUtils";
import {
  formatSessionTiming,
  sessionHasIssue,
  sessionIssueMessage,
} from "@/features/admin/components/liveMonitor/liveMonitorUtils";
import { cn } from "@/lib/utils/cn";

const DETAIL_TABS: { id: LiveMonitorDetailTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "participants", label: "Participants" },
];

interface IAdminLiveMonitorDetailPanelProps {
  session: LiveMonitorSession;
  now: number;
}

export function AdminLiveMonitorDetailPanel({
  session,
  now,
}: IAdminLiveMonitorDetailPanelProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<LiveMonitorDetailTab>("overview");
  const meetingHref = normalizeMeetingLink(session.meetingLink);
  const timing = formatSessionTiming(session, now);
  const elapsed = formatLiveElapsed(session, now);
  const issueMessage = sessionIssueMessage(session);
  const activity = useMemo(() => buildSessionActivity(session), [session]);

  function handleCopyCode() {
    void navigator.clipboard.writeText(sessionShortCode(session));
  }

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="border-b border-portal p-5 sm:p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <LiveMonitorPhaseBadge phase={session.sessionPhase} />
              {session.sessionPhase === "live" ? (
                <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-bold text-red-700">
                  Elapsed {elapsed}
                </span>
              ) : null}
              <span className="rounded-full bg-portal-muted/50 px-2.5 py-1 text-xs font-semibold text-portal-muted">
                {timing}
              </span>
            </div>
            <h2 className="mt-2 text-xl font-bold capitalize text-portal-heading sm:text-2xl">
              {session.classTitle}
            </h2>
            <p className="mt-1 text-sm text-portal-muted">{session.courseType}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-portal-muted">
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="size-4 text-primary" aria-hidden />
                {session.teacher.name}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4 text-primary" aria-hidden />
                {session.day} · {session.startTimeLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Timer className="size-4 text-primary" aria-hidden />
                {session.durationLabel}
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto xl:min-w-[220px]">
            <AdminLiveMonitorSessionCode
              code={sessionShortCode(session)}
              onCopy={handleCopyCode}
            />
            <div className="flex flex-wrap gap-2">
              {meetingHref ? (
                <AdminLiveMonitorOpenLink href={meetingHref} />
              ) : null}
              <button
                type="button"
                onClick={() => navigate(`/admin/classes/${session.classId}`)}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-portal px-4 py-2.5 text-sm font-semibold text-portal-heading transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              >
                Class details
              </button>
            </div>
          </div>
        </div>

        {issueMessage ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm font-semibold text-amber-800">
            <AlertTriangle className="size-4 shrink-0" aria-hidden />
            {issueMessage}
          </p>
        ) : null}
      </div>

      <div className="border-b border-portal px-5 sm:px-6">
        <div className="flex gap-1 overflow-x-auto">
          {DETAIL_TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "border-b-2 px-4 py-3 text-sm font-semibold transition",
                tab === item.id
                  ? "border-primary text-primary"
                  : "border-transparent text-portal-muted hover:text-portal-heading"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        {tab === "overview" ? (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: "Course type", value: session.courseType, icon: CalendarDays },
                { label: "Day", value: session.day, icon: CalendarDays },
                { label: "Start time", value: session.startTimeLabel, icon: Clock },
                { label: "Duration", value: session.durationLabel, icon: Timer },
                { label: "Teacher", value: session.teacher.name, icon: GraduationCap },
                {
                  label: "Student",
                  value: session.student.studentId
                    ? `${session.student.name} (${session.student.studentId})`
                    : session.student.name,
                  icon: User,
                },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-xl border border-portal/80 bg-portal-muted/20 px-4 py-3"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-portal-muted">
                    <Icon className="size-3.5" aria-hidden />
                    {label}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-portal-heading">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-portal bg-portal-muted/15 p-4">
              <h3 className="text-sm font-bold text-portal-heading">Session activity</h3>
              <div className="mt-4 flex flex-col gap-3">
                {activity.map((item) => (
                  <div key={item.id} className="relative border-l-2 border-primary/25 pl-3">
                    <p className="text-xs font-semibold tabular-nums text-primary">
                      {item.timeLabel}
                    </p>
                    <p className="text-sm font-semibold text-portal-heading">{item.title}</p>
                    {item.detail ? (
                      <p className="text-xs text-portal-muted">{item.detail}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="xl:col-span-2">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  role: "Teacher" as const,
                  name: session.teacher.name,
                  status: session.joins.teacherStatus,
                  joinedAt: session.joins.teacherJoinedAt,
                },
                {
                  role: "Student" as const,
                  name: session.student.name,
                  status: session.joins.studentStatus,
                  joinedAt: session.joins.studentJoinedAt,
                },
              ].map((participant) => (
                <div
                  key={participant.role}
                  className="rounded-2xl border border-portal bg-portal-muted/15 p-4"
                >
                  <div className="flex items-start gap-3">
                    <UserInitialAvatar name={participant.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-portal-muted">
                        {participant.role}
                      </p>
                      <p className="text-sm font-bold text-portal-heading">{participant.name}</p>
                      <div className="mt-2">
                        <LiveMonitorJoinBadge
                          role={participant.role}
                          status={participant.status}
                        />
                      </div>
                      <p className="mt-2 text-xs text-portal-muted">
                        {participant.joinedAt
                          ? `Joined at ${new Date(participant.joinedAt).toLocaleTimeString()}`
                          : "Not joined via portal Launch yet"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "overview" ? (
          <div className="rounded-2xl border border-portal bg-portal-muted/15 p-4">
            <h3 className="text-sm font-bold text-portal-heading">Join status</h3>
            <div className="mt-4 flex flex-col gap-2.5">
              <LiveMonitorJoinBadge
                role="Teacher"
                status={session.joins.teacherStatus}
                variant="panel"
                joinedAt={session.joins.teacherJoinedAt}
              />
              <LiveMonitorJoinBadge
                role="Student"
                status={session.joins.studentStatus}
                variant="panel"
                joinedAt={session.joins.studentJoinedAt}
              />
            </div>
            {sessionHasIssue(session) ? (
              <p className="mt-4 text-xs leading-relaxed text-portal-muted">
                Join is recorded when teacher or student clicks <strong>Launch</strong> on their
                schedule in the portal.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
