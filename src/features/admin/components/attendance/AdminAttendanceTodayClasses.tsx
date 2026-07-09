import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import type { AttendanceOverview, TodaySessionDashboardItem } from "@/types/models";

interface IAdminAttendanceTodayClassesProps {
  sessions: TodaySessionDashboardItem[];
  overview: AttendanceOverview[];
}

function findAttendancePct(
  overview: AttendanceOverview[],
  classId: string,
  classTitle: string
): number | null {
  const row = overview.find(
    (item) => item.class._id === classId || item.class.title === classTitle
  );
  return row?.percentage ?? null;
}

export function AdminAttendanceTodayClasses({
  sessions,
  overview,
}: IAdminAttendanceTodayClassesProps) {
  const visible = sessions.slice(0, 4);

  return (
    <Card className="rounded-2xl border border-portal bg-portal-surface p-5 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold text-portal-heading">Today&apos;s classes</h2>
        <Link to="/admin/schedule/routine" className="text-xs font-semibold text-primary hover:underline">
          View schedule
        </Link>
      </div>
      {visible.length === 0 ? (
        <p className="mt-3 text-sm text-portal-muted">No classes scheduled for today.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {visible.map((session) => {
            const pct = findAttendancePct(overview, session.classId, session.classTitle);
            const pctClass =
              pct == null
                ? "text-portal-muted"
                : pct >= 80
                  ? "text-emerald-700"
                  : pct >= 60
                    ? "text-amber-700"
                    : "text-red-600";

            return (
              <div
                key={session._id}
                className="rounded-xl border border-portal/80 bg-portal-muted/20 px-3 py-2.5"
              >
                <p className="text-sm font-semibold text-portal-heading">{session.classTitle}</p>
                <p className="text-xs text-portal-muted">
                  {session.teacherName} · {session.startTimeLabel}
                </p>
                <p className={`mt-1 text-xs font-semibold ${pctClass}`}>
                  {pct != null ? `${pct}% class attendance` : "No attendance data yet"}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
