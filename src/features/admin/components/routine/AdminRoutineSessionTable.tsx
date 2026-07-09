import { useState } from "react";
import { ChevronDown, Eye, MoreHorizontal } from "lucide-react";
import type { SessionSlotView } from "@/types/models";
import { Card } from "@/components/ui/Card";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { SessionStatusBadge } from "@/components/schedule/SessionStatusBadge";
import { groupSessionsByDay } from "@/lib/utils/schedule";
import { cn } from "@/lib/utils/cn";

interface IAdminRoutineSessionTableProps {
  sessions: SessionSlotView[];
  onViewClass: (session: SessionSlotView) => void;
  initialVisiblePerDay?: number;
}

function formatTimeSlot(session: SessionSlotView): string {
  return `${session.times.academy.time} · ${session.day.slice(0, 3)}`;
}

function AdminRoutineTableRow({
  session,
  onViewClass,
}: {
  session: SessionSlotView;
  onViewClass: (session: SessionSlotView) => void;
}) {
  return (
    <tr className="border-b border-portal/80 bg-portal-surface transition-colors last:border-b-0 hover:bg-portal-muted/30">
      <td className="whitespace-nowrap px-4 py-3.5">
        <p className="text-sm font-semibold tabular-nums text-portal-heading">
          {session.times.academy.time}
        </p>
        <p className="mt-0.5 text-xs text-portal-muted">{session.day.slice(0, 3)}</p>
      </td>
      <td className="px-4 py-3.5">
        <p className="text-sm font-semibold capitalize text-portal-heading">{session.classTitle}</p>
        <p className="mt-0.5 text-xs text-portal-muted">
          {session.courseType}
          {session.student.studentId ? ` · ${session.student.studentId}` : ""}
        </p>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <UserInitialAvatar name={session.teacher.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-portal-heading">{session.teacher.name}</p>
            <CountryLabel country={session.teacher.country} showFallback className="text-xs" />
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-portal-heading">{session.student.name}</p>
          <CountryLabel country={session.student.country} showFallback className="text-xs" />
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3.5 text-sm text-portal-heading">
        {session.durationLabel}
      </td>
      <td className="px-4 py-3.5">
        <SessionStatusBadge session={session} routineView compact />
      </td>
      <td className="px-4 py-3.5 text-right">
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => onViewClass(session)}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            aria-label={`View ${session.classTitle}`}
          >
            <Eye className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onViewClass(session)}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:bg-portal-muted/50 hover:text-portal-heading"
            aria-label="More actions"
          >
            <MoreHorizontal className="size-4" aria-hidden />
          </button>
        </div>
      </td>
    </tr>
  );
}

function AdminRoutineDaySection({
  day,
  sessions,
  onViewClass,
  initialVisible,
}: {
  day: string;
  sessions: SessionSlotView[];
  onViewClass: (session: SessionSlotView) => void;
  initialVisible: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const visibleSessions = expanded ? sessions : sessions.slice(0, initialVisible);
  const hasMore = sessions.length > initialVisible;

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-center justify-between gap-3 border-b border-portal px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-2.5">
          <h2 className="text-base font-bold text-portal-heading">{day}</h2>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
            {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-[11px] font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-4 py-3">Time slot (BD)</th>
              <th className="px-4 py-3">Class</th>
              <th className="px-4 py-3">Teacher</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleSessions.map((session) => (
              <AdminRoutineTableRow
                key={session._id}
                session={session}
                onViewClass={onViewClass}
              />
            ))}
          </tbody>
        </table>
      </div>

      {hasMore ? (
        <div className="border-t border-portal px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            {expanded ? "Show fewer sessions" : "Show more sessions"}
            <ChevronDown
              className={cn("size-4 transition-transform", expanded && "rotate-180")}
              aria-hidden
            />
          </button>
        </div>
      ) : null}
    </Card>
  );
}

export function AdminRoutineSessionTable({
  sessions,
  onViewClass,
  initialVisiblePerDay = 5,
}: IAdminRoutineSessionTableProps) {
  const grouped = groupSessionsByDay(sessions).filter((group) => group.sessions.length > 0);

  if (grouped.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      {grouped.map(({ day, sessions: daySessions }) => (
        <AdminRoutineDaySection
          key={day}
          day={day}
          sessions={daySessions}
          onViewClass={onViewClass}
          initialVisible={initialVisiblePerDay}
        />
      ))}
    </div>
  );
}

export { formatTimeSlot };
