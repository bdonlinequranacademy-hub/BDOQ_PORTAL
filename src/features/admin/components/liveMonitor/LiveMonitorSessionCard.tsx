import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ChevronRight,
  GraduationCap,
  Timer,
  User,
  Video,
} from "lucide-react";
import type { LiveMonitorSession } from "@/types/models";
import { normalizeMeetingLink } from "@/lib/utils/meetingLink";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils/cn";
import { LiveMonitorJoinBadge } from "./LiveMonitorJoinBadge";
import { LiveMonitorPhaseBadge } from "./LiveMonitorPhaseBadge";
import {
  formatSessionTiming,
  sessionHasIssue,
  sessionIssueMessage,
} from "./liveMonitorUtils";

interface ILiveMonitorSessionCardProps {
  session: LiveMonitorSession;
  now: number;
  variant?: "full" | "compact";
}

function cardSurfaceClass(session: LiveMonitorSession): string {
  const issue = sessionHasIssue(session);

  if (session.sessionPhase === "live") {
    return cn(
      "border-red-500/35 bg-gradient-to-br from-red-500/8 via-portal-surface to-portal-surface",
      "dark:from-red-500/12 dark:via-portal-surface dark:to-portal-surface",
      issue && "ring-1 ring-amber-500/25"
    );
  }

  if (issue) {
    return "border-amber-500/30 bg-gradient-to-br from-amber-500/8 to-portal-surface dark:from-amber-500/10";
  }

  if (session.sessionPhase === "completed") {
    return "border-portal bg-portal-surface opacity-90";
  }

  return "border-portal bg-portal-surface hover:border-primary/25";
}

export function LiveMonitorSessionCard({
  session,
  now,
  variant = "full",
}: ILiveMonitorSessionCardProps) {
  const { t, dynamicLabel, role } = usePortalTranslation();
  const navigate = useNavigate();
  const issue = sessionHasIssue(session);
  const issueMessage = sessionIssueMessage(session);
  const timing = formatSessionTiming(session, now);
  const meetingHref = normalizeMeetingLink(session.meetingLink);

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={() => navigate(`/admin/classes/${session.classId}`)}
        className={cn(
          "group flex w-full items-stretch gap-3 rounded-2xl border p-3.5 text-left shadow-sm transition",
          "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          cardSurfaceClass(session)
        )}
      >
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <LiveMonitorPhaseBadge phase={session.sessionPhase} />
            <span className="text-xs font-semibold tabular-nums text-portal-muted">
              {timing}
            </span>
            {issue ? (
              <AlertTriangle className="size-3.5 text-amber-600 dark:text-amber-400" />
            ) : null}
          </div>
          <p className="truncate font-semibold text-portal-heading">{session.classTitle}</p>
          <p className="truncate text-xs text-portal-muted">
            {session.teacher.name} · {session.student.name}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <LiveMonitorJoinBadge roleKey="teacher" status={session.joins.teacherStatus} />
            <LiveMonitorJoinBadge roleKey="student" status={session.joins.studentStatus} />
          </div>
        </div>
        <ChevronRight className="size-4 shrink-0 self-center text-portal-muted transition group-hover:translate-x-0.5 group-hover:text-primary" />
      </button>
    );
  }

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border shadow-sm transition",
        cardSurfaceClass(session)
      )}
    >
      <div className="flex flex-col gap-4 p-4 sm:p-5 lg:flex-row lg:items-center lg:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <LiveMonitorPhaseBadge phase={session.sessionPhase} />
            <span className="inline-flex items-center gap-1 rounded-lg bg-portal-surface-muted px-2 py-1 text-xs font-bold tabular-nums text-portal-heading">
              <Timer className="size-3.5 text-gold" aria-hidden />
              {session.startTimeLabel}
            </span>
            <span className="text-xs text-portal-muted">{session.durationLabel}</span>
            <span
              className={cn(
                "rounded-lg px-2 py-1 text-[11px] font-semibold",
                session.sessionPhase === "live"
                  ? "bg-red-500/10 text-red-700 dark:text-red-300"
                  : "bg-portal-surface-muted text-portal-muted"
              )}
            >
              {timing}
            </span>
            {issue ? (
              <AlertTriangle
                className="size-4 text-amber-600 dark:text-amber-400"
                aria-hidden
              />
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="min-w-0">
              <p className="text-lg font-bold leading-tight text-portal-heading">
                {session.classTitle}
              </p>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-portal-muted">
                {dynamicLabel(session.courseType) || session.courseType}
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-xl border border-portal bg-portal-surface-muted/60 px-3 py-2">
              <GraduationCap className="size-4 shrink-0 text-primary" aria-hidden />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
                  {role("teacher")}
                </p>
                <p className="truncate text-sm font-medium text-portal-heading">
                  {session.teacher.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-portal bg-portal-surface-muted/60 px-3 py-2">
              <User className="size-4 shrink-0 text-gold" aria-hidden />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-portal-muted">
                  {role("student")}
                </p>
                <p className="truncate text-sm font-medium text-portal-heading">
                  {session.student.name}
                  {session.student.studentId ? (
                    <span className="ml-1 text-xs font-normal text-portal-muted">
                      ({session.student.studentId})
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <LiveMonitorJoinBadge roleKey="teacher" status={session.joins.teacherStatus} />
            <LiveMonitorJoinBadge roleKey="student" status={session.joins.studentStatus} />
          </div>

          {issueMessage ? (
            <p className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:text-amber-300">
              <AlertTriangle className="size-3.5 shrink-0" />
              {issueMessage}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-row flex-wrap gap-2 lg:w-44 lg:flex-col">
          {meetingHref ? (
            <a
              href={meetingHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#2b7fff] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1a6fe8] lg:flex-none"
            >
              <Video className="size-4" />
              {t("admin.liveMonitor.card.openLink")}
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => navigate(`/admin/classes/${session.classId}`)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-portal bg-portal-surface px-4 py-2.5 text-sm font-semibold text-portal-heading transition hover:border-primary/30 hover:bg-portal-surface-muted lg:flex-none"
          >
            {t("admin.liveMonitor.card.classDetails")}
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
