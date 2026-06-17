import type { SessionSlotView } from "@/types/models";
import { Card } from "@/components/ui/Card";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { SessionActionButtons } from "@/components/schedule/SessionActionButtons";
import { SessionStatusBadge } from "@/components/schedule/SessionStatusBadge";
import { resolveDisplayPhase } from "@/lib/utils/sessionTiming";
import { useSessionClock } from "@/hooks/useSessionClock";

interface SessionTimelineRowProps {
  session: SessionSlotView;
  showDay?: boolean;
  routineView?: boolean;
  adminMode?: boolean;
  onViewClass?: (session: SessionSlotView) => void;
  onLogSession?: (session: SessionSlotView) => void;
  onMarkAttendance?: (session: SessionSlotView) => void;
}

function ParticipantBlock({
  label,
  name,
  meta,
  country,
}: {
  label: string;
  name: string;
  meta?: string;
  country?: string;
}) {
  const isMissing = /deleted/i.test(name);

  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-portal-muted">
        {label}
      </p>
      <p
        className={`mt-0.5 truncate text-sm font-semibold ${
          isMissing ? "italic text-portal-muted" : "text-portal-heading"
        }`}
      >
        {name}
      </p>
      <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-portal-muted">
        {meta ? <span>{meta}</span> : null}
        {meta && country ? <span aria-hidden>·</span> : null}
        <CountryLabel country={country} showFallback className="inline" />
      </p>
    </div>
  );
}

export function SessionTimelineRow({
  session,
  showDay = false,
  routineView = false,
  adminMode = false,
  onViewClass,
  onLogSession,
  onMarkAttendance,
}: SessionTimelineRowProps) {
  const now = useSessionClock();
  const phase = resolveDisplayPhase(session, now, { routineView });
  const isLive = phase === "live";

  return (
    <Card
      className={`overflow-hidden p-0 transition-colors ${
        isLive
          ? "border-red-400/40 ring-1 ring-red-500/25 dark:border-red-400/30 dark:ring-red-500/20"
          : ""
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(108px,128px)_1fr]">
        {/* Time rail */}
        <div
          className={`flex border-b border-portal lg:flex-col lg:border-b-0 lg:border-r ${
            isLive ? "bg-red-500/8 dark:bg-red-500/10" : "bg-portal-muted"
          }`}
        >
          <div className="flex flex-1 flex-col items-center justify-center px-3 py-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-portal-muted">
              BD
            </span>
            <p
              className={`mt-1 text-xl font-bold tabular-nums leading-none ${
                isLive ? "text-red-500 dark:text-red-400" : "text-gold"
              }`}
            >
              {session.times.academy.time}
            </p>
          </div>

          <div className="w-px self-stretch bg-portal-border lg:hidden" />

          <div className="flex flex-1 flex-col items-center justify-center border-l border-portal px-3 py-4 lg:border-l-0 lg:border-t lg:border-portal">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-portal-muted">
              Student
            </span>
            <p className="mt-1 text-sm font-semibold tabular-nums text-portal-heading">
              {session.times.student.time}
            </p>
            {adminMode ? (
              <p className="mt-1 hidden text-[10px] text-portal-muted lg:block">
                Tea {session.times.teacher.time}
              </p>
            ) : null}
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col gap-3 px-4 py-4 lg:px-5 lg:py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                {showDay ? (
                  <span className="rounded-md border border-portal bg-portal-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-portal-muted">
                    {session.day}
                  </span>
                ) : null}
                <span className="rounded-md bg-navy/8 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-portal-heading dark:bg-white/10">
                  {session.courseType}
                </span>
                <span className="text-[11px] font-medium text-portal-muted">
                  {session.durationLabel}
                </span>
              </div>

              <h3 className="mt-2 text-lg font-semibold capitalize leading-snug text-portal-heading">
                {session.classTitle}
              </h3>

              {!adminMode ? (
                <>
                  <p className="mt-1 truncate text-sm font-medium text-portal-heading">
                    {session.student.name}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-xs text-portal-muted">
                    {session.student.studentId ? (
                      <span>{session.student.studentId}</span>
                    ) : null}
                    {session.student.studentId ? <span aria-hidden>·</span> : null}
                    <CountryLabel country={session.student.country} showFallback />
                    <span aria-hidden>·</span>
                    <span>Tea {session.times.teacher.time}</span>
                    <CountryLabel country={session.teacher.country} className="inline" showFallback />
                  </p>
                </>
              ) : null}
            </div>

            <SessionStatusBadge session={session} routineView={routineView} />
          </div>

          {adminMode ? (
            <div className="grid gap-3 rounded-xl border border-portal bg-portal-muted/50 p-3 sm:grid-cols-2">
              <ParticipantBlock
                label="Student"
                name={session.student.name}
                meta={session.student.studentId}
                country={session.student.country}
              />
              <ParticipantBlock
                label="Teacher"
                name={session.teacher.name}
                country={session.teacher.country}
              />
            </div>
          ) : null}

          {adminMode && onViewClass ? (
            <button
              type="button"
              onClick={() => onViewClass(session)}
              className="w-fit rounded-lg border border-gold/35 bg-gold/10 px-4 py-2 text-xs font-semibold text-gold transition hover:bg-gold/20 dark:border-gold/30 dark:bg-gold/10 dark:text-gold-light dark:hover:bg-gold/15"
            >
              View class →
            </button>
          ) : !adminMode ? (
            <SessionActionButtons
              session={session}
              onLogSession={onLogSession}
              onMarkAttendance={onMarkAttendance}
            />
          ) : null}
        </div>
      </div>
    </Card>
  );
}
