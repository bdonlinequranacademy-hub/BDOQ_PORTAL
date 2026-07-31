import type { SessionSlotView } from "@/types/models";
import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { SessionActionButtons } from "@/components/schedule/SessionActionButtons";
import { SessionStatusBadge } from "@/components/schedule/SessionStatusBadge";
import { resolveDisplayPhase } from "@/lib/utils/sessionTiming";
import { useSessionClock } from "@/hooks/useSessionClock";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface SessionTimelineRowProps {
  session: SessionSlotView;
  showDay?: boolean;
  routineView?: boolean;
  adminMode?: boolean;
  joinRole?: "teacher" | "student";
  onViewClass?: (session: SessionSlotView) => void;
  onLogSession?: (session: SessionSlotView) => void;
  onMarkAttendance?: (session: SessionSlotView) => void;
}

function TimeChip({
  label,
  time,
  accent,
}: {
  label: string;
  time: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-[4.5rem] flex-col rounded-lg border px-2.5 py-1.5 text-center",
        accent
          ? "border-primary/25 bg-primary/10"
          : "border-portal bg-portal-surface"
      )}
    >
      <span className="text-[9px] font-bold uppercase tracking-wider text-portal-muted">
        {label}
      </span>
      <span
        className={cn(
          "mt-0.5 text-sm font-bold tabular-nums leading-none",
          accent ? "text-primary" : "text-portal-heading"
        )}
      >
        {time}
      </span>
    </div>
  );
}

function AdminRoutineRow({
  session,
  routineView,
  isLive,
  onViewClass,
}: {
  session: SessionSlotView;
  routineView: boolean;
  isLive: boolean;
  onViewClass?: (session: SessionSlotView) => void;
}) {
  const { t } = usePortalTranslation();

  return (
    <Card
      className={cn(
        "overflow-hidden p-0 transition-shadow hover:shadow-md",
        isLive && "border-primary/35 ring-1 ring-primary/20"
      )}
    >
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
        <div className="flex shrink-0 flex-wrap gap-2">
          <TimeChip label={t("shared.schedule.bd")} time={session.times.academy.time} accent={isLive} />
          <TimeChip label={t("shared.schedule.student")} time={session.times.student.time} />
          <TimeChip label={t("shared.schedule.teacher")} time={session.times.teacher.time} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {session.day ? (
              <span className="rounded-md bg-portal-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-portal-muted">
                {session.day.slice(0, 3)}
              </span>
            ) : null}
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
              {session.courseType}
            </span>
            <span className="text-[11px] text-portal-muted">{session.durationLabel}</span>
          </div>
          <h3 className="mt-1 truncate text-base font-semibold capitalize text-portal-heading">
            {session.classTitle}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-portal-muted">
            <span className="font-medium text-portal-heading">{session.student.name}</span>
            {session.student.studentId ? (
              <span className="text-portal-muted">({session.student.studentId})</span>
            ) : null}
            <CountryLabel country={session.student.country} showFallback className="inline" />
            <span aria-hidden className="text-portal-muted/50">
              ·
            </span>
            <span>{session.teacher.name}</span>
            <CountryLabel country={session.teacher.country} showFallback className="inline" />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end sm:gap-2">
          <SessionStatusBadge session={session} routineView={routineView} compact />
          {onViewClass ? (
            <button
              type="button"
              onClick={() => onViewClass(session)}
              className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10"
            >
              {t("shared.actions.viewClass")}
              <ExternalLink className="size-3" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export function SessionTimelineRow({
  session,
  showDay = false,
  routineView = false,
  adminMode = false,
  joinRole,
  onViewClass,
  onLogSession,
  onMarkAttendance,
}: SessionTimelineRowProps) {
  const { t } = usePortalTranslation();
  const now = useSessionClock();
  const phase = resolveDisplayPhase(session, now, { routineView });
  const isLive = phase === "live";

  if (adminMode) {
    return (
      <AdminRoutineRow
        session={session}
        routineView={routineView}
        isLive={isLive}
        onViewClass={onViewClass}
      />
    );
  }

  return (
    <Card
      className={cn(
        "overflow-hidden p-0 transition-colors",
        isLive && "border-primary/35 ring-1 ring-primary/20"
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(96px,112px)_1fr]">
        <div
          className={cn(
            "flex border-b border-portal lg:flex-col lg:border-b-0 lg:border-r",
            isLive ? "bg-primary/8" : "bg-portal-muted"
          )}
        >
          <div className="flex flex-1 flex-col items-center justify-center px-3 py-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-portal-muted">
              {t("shared.schedule.bd")}
            </span>
            <p
              className={cn(
                "mt-1 text-lg font-bold tabular-nums leading-none",
                isLive ? "text-primary" : "text-gold"
              )}
            >
              {session.times.academy.time}
            </p>
          </div>

          <div className="w-px self-stretch bg-portal-border lg:hidden" />

          <div className="flex flex-1 flex-col items-center justify-center border-l border-portal px-3 py-3 lg:border-l-0 lg:border-t lg:border-portal">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-portal-muted">
              {t("shared.schedule.you")}
            </span>
            <p className="mt-1 text-sm font-semibold tabular-nums text-portal-heading">
              {session.times.teacher.time}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-4 py-3 lg:px-4 lg:py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {showDay ? (
                  <span className="rounded-md border border-portal bg-portal-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-portal-muted">
                    {session.day}
                  </span>
                ) : null}
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                  {session.courseType}
                </span>
                <span className="text-[11px] font-medium text-portal-muted">
                  {session.durationLabel}
                </span>
              </div>

              <h3 className="mt-1.5 text-base font-semibold capitalize leading-snug text-portal-heading">
                {session.classTitle}
              </h3>

              <p className="mt-1 truncate text-sm font-medium text-portal-heading">
                {session.student.name}
              </p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-portal-muted">
                {session.student.studentId ? (
                  <span>{session.student.studentId}</span>
                ) : null}
                {session.student.studentId ? <span aria-hidden>·</span> : null}
                <CountryLabel country={session.student.country} showFallback />
              </p>
            </div>

            <SessionStatusBadge session={session} routineView={routineView} compact />
          </div>

          <SessionActionButtons
            session={session}
            onLogSession={onLogSession}
            onMarkAttendance={onMarkAttendance}
            joinRole={joinRole}
          />
          {onViewClass ? (
            <button
              type="button"
              onClick={() => onViewClass(session)}
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10 sm:w-auto"
            >
              {t("shared.actions.viewClass")}
              <ExternalLink className="size-3" aria-hidden />
            </button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
