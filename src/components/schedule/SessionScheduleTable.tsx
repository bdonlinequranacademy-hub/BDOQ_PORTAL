import { ArrowUpRight } from "lucide-react";
import type { SessionSlotView } from "@/types/models";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { SessionActionButtons } from "@/components/schedule/SessionActionButtons";
import { SessionStatusBadge } from "@/components/schedule/SessionStatusBadge";
import { Card } from "@/components/ui/Card";

interface SessionScheduleTableProps {
  sessions: SessionSlotView[];
  routineView?: boolean;
  adminMode?: boolean;
  joinRole?: "teacher" | "student";
  onViewClass?: (session: SessionSlotView) => void;
  onLogSession?: (session: SessionSlotView) => void;
  onMarkAttendance?: (session: SessionSlotView) => void;
}

export function SessionScheduleTable({
  sessions,
  routineView = false,
  adminMode = false,
  joinRole,
  onViewClass,
  onLogSession,
  onMarkAttendance,
}: SessionScheduleTableProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-portal bg-portal-muted text-[11px] font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-3 py-2.5">Day</th>
              <th className="px-3 py-2.5">BD</th>
              <th className="px-3 py-2.5">Stu time</th>
              {adminMode ? <th className="px-3 py-2.5">Tea time</th> : null}
              <th className="px-3 py-2.5">Student</th>
              <th className="px-3 py-2.5">Stu country</th>
              {adminMode ? (
                <>
                  <th className="px-3 py-2.5">Teacher</th>
                  <th className="px-3 py-2.5">Tea country</th>
                </>
              ) : (
                <th className="px-3 py-2.5">Country</th>
              )}
              <th className="px-3 py-2.5">Class</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5 text-right">{adminMode ? "Open" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-portal">
            {sessions.map((session) => (
              <tr
                key={session._id}
                className="bg-portal-surface transition-colors hover:bg-portal-muted/40"
              >
                <td className="whitespace-nowrap px-3 py-2.5 font-medium text-portal-heading">
                  {session.day}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 font-semibold tabular-nums text-gold">
                  {session.times.academy.time}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-portal">
                  {session.times.student.time}
                </td>
                {adminMode ? (
                  <td className="whitespace-nowrap px-3 py-2.5 tabular-nums text-portal">
                    {session.times.teacher.time}
                  </td>
                ) : null}
                <td className="px-3 py-2.5">
                  <p className="font-medium text-portal-heading">{session.student.name}</p>
                  {session.student.studentId ? (
                    <p className="text-xs text-portal-muted">{session.student.studentId}</p>
                  ) : null}
                </td>
                <td className="px-3 py-2.5">
                  <CountryLabel country={session.student.country} showFallback />
                </td>
                {adminMode ? (
                  <>
                    <td className="px-3 py-2.5 font-medium text-portal-heading">
                      {session.teacher.name}
                    </td>
                    <td className="px-3 py-2.5">
                      <CountryLabel country={session.teacher.country} showFallback />
                    </td>
                  </>
                ) : null}
                <td className="px-3 py-2.5">
                  <p className="font-medium capitalize text-portal-heading">
                    {session.classTitle}
                  </p>
                  <p className="text-xs text-portal-muted">
                    {session.courseType} · {session.durationLabel}
                  </p>
                </td>
                <td className="px-3 py-2.5">
                  <SessionStatusBadge session={session} routineView={routineView} compact />
                </td>
                <td className="px-3 py-2.5 text-right">
                  <div className="flex flex-col items-end gap-1.5">
                    {onViewClass ? (
                      <button
                        type="button"
                        onClick={() => onViewClass(session)}
                        className="inline-flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:border-primary hover:bg-primary hover:text-white"
                      >
                        View class
                        <ArrowUpRight className="size-3.5" aria-hidden />
                      </button>
                    ) : null}
                    {!adminMode ? (
                      <SessionActionButtons
                        session={session}
                        onLogSession={onLogSession}
                        onMarkAttendance={onMarkAttendance}
                        joinRole={joinRole}
                        compact
                      />
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
