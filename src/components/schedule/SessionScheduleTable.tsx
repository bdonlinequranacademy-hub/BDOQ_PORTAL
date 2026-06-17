import type { SessionSlotView } from "@/types/models";
import { CountryLabel } from "@/components/ui/CountryLabel";
import { SessionActionButtons } from "@/components/schedule/SessionActionButtons";
import { SessionStatusBadge } from "@/components/schedule/SessionStatusBadge";
import { Card } from "@/components/ui/Card";

interface SessionScheduleTableProps {
  sessions: SessionSlotView[];
  routineView?: boolean;
  adminMode?: boolean;
  onViewClass?: (session: SessionSlotView) => void;
  onLogSession?: (session: SessionSlotView) => void;
  onMarkAttendance?: (session: SessionSlotView) => void;
}

export function SessionScheduleTable({
  sessions,
  routineView = false,
  adminMode = false,
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
              <th className="px-4 py-3">Day</th>
              <th className="px-4 py-3">BD time</th>
              <th className="px-4 py-3">Student time</th>
              {adminMode ? <th className="px-4 py-3">Teacher time</th> : null}
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Stu country</th>
              {adminMode ? (
                <>
                  <th className="px-4 py-3">Teacher</th>
                  <th className="px-4 py-3">Tea country</th>
                </>
              ) : (
                <th className="px-4 py-3">Country</th>
              )}
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">{adminMode ? "Class" : "Actions"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-portal">
            {sessions.map((session) => (
              <tr key={session._id} className="bg-portal-surface transition-colors hover:bg-portal-muted/40">
                <td className="px-4 py-3 font-medium text-portal-heading">{session.day}</td>
                <td className="px-4 py-3 font-semibold tabular-nums text-gold">
                  {session.times.academy.time}
                </td>
                <td className="px-4 py-3 tabular-nums text-portal">{session.times.student.time}</td>
                {adminMode ? (
                  <td className="px-4 py-3 tabular-nums text-portal">{session.times.teacher.time}</td>
                ) : null}
                <td className="px-4 py-3">
                  <p className="font-medium text-portal-heading">{session.student.name}</p>
                  {session.student.studentId ? (
                    <p className="text-xs text-portal-muted">{session.student.studentId}</p>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <CountryLabel country={session.student.country} showFallback />
                </td>
                {adminMode ? (
                  <>
                    <td className="px-4 py-3 font-medium text-portal-heading">
                      {session.teacher.name}
                    </td>
                    <td className="px-4 py-3">
                      <CountryLabel country={session.teacher.country} showFallback />
                    </td>
                  </>
                ) : null}
                <td className="px-4 py-3">
                  <p className="font-medium capitalize text-portal-heading">{session.courseType}</p>
                  <p className="text-xs text-portal-muted">{session.durationLabel}</p>
                </td>
                <td className="px-4 py-3">
                  <SessionStatusBadge session={session} routineView={routineView} compact />
                </td>
                <td className="px-4 py-3 text-right">
                  {adminMode && onViewClass ? (
                    <button
                      type="button"
                      onClick={() => onViewClass(session)}
                      className="text-xs font-semibold text-gold hover:underline dark:text-gold-light"
                    >
                      View class →
                    </button>
                  ) : (
                    <SessionActionButtons
                      session={session}
                      onLogSession={onLogSession}
                      onMarkAttendance={onMarkAttendance}
                      compact
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
