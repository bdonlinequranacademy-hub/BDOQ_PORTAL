import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { useTeacherWeeklyRoutine } from "@/features/teacher/hooks/useTeacher";
import { useLogSessionFlow } from "@/features/teacher/hooks/useLogSessionFlow";
import { PageContainer } from "@/components/layout/PageContainer";
import { LogSessionSheet } from "@/components/schedule/LogSessionSheet";
import { ScheduleViewToggle, type ScheduleViewMode } from "@/components/schedule/ScheduleViewToggle";
import { SessionTimelineRow } from "@/components/schedule/SessionTimelineRow";
import { SessionScheduleTable } from "@/components/schedule/SessionScheduleTable";
import { groupSessionsByDay, sortSessionsForTable } from "@/lib/utils/schedule";
import type { SessionSlotView } from "@/types/models";

import { PageLoading } from "@/components/ui/PageLoading";
function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

export function TeacherRoutinePage() {
  const navigate = useNavigate();
  const [view, setView] = useState<ScheduleViewMode>("timeline");
  const { data: sessions = [], isLoading } = useTeacherWeeklyRoutine();
  const {
    logSession,
    logSheetOpen,
    openLogSession,
    closeLogSession,
    submitLogSession,
    isSubmittingLog,
  } = useLogSessionFlow();

  const grouped = groupSessionsByDay(sessions);
  const tableSessions = useMemo(() => sortSessionsForTable(sessions), [sessions]);
  const totalSessions = sessions.length;

  function handleMarkAttendance(session: SessionSlotView) {
    navigate(
      `/teacher/attendance/sheet?classId=${session.classId}&date=${todayIsoDate()}`
    );
  }

  return (
    <>
      <PageContainer className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#03214F]">My Routine</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Weekly teaching schedule — {totalSessions} session
              {totalSessions === 1 ? "" : "s"} per week
            </p>
          </div>
          {totalSessions > 0 ? (
            <ScheduleViewToggle value={view} onChange={setView} />
          ) : null}
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-[#C4922B]/12 px-4 py-3">
          <CalendarDays className="size-5 text-[#C4922B]" />
          <span className="text-sm font-semibold text-[#03214F]">
            Academy week: Saturday → Friday · live timer only on today&apos;s sessions
          </span>
        </div>

        {isLoading ? (
          <PageLoading label="Loading routine…" />
        ) : totalSessions === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-10 text-center">
            <p className="font-semibold text-[#03214F]">No routine yet</p>
            <p className="mt-1 text-sm text-zinc-400">
              Sessions appear when admin assigns students to your classes with a schedule.
            </p>
          </div>
        ) : view === "table" ? (
          <SessionScheduleTable
            sessions={tableSessions}
            routineView
            onLogSession={openLogSession}
            onMarkAttendance={handleMarkAttendance}
          />
        ) : (
          <div className="flex flex-col gap-8">
            {grouped.map(({ day, sessions: daySessions }) =>
              daySessions.length === 0 ? null : (
                <section key={day} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 border-b border-zinc-100 pb-2">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-[#03214F]">
                      {day}
                    </h2>
                    <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                      {daySessions.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {daySessions.map((session) => (
                      <SessionTimelineRow
                        key={session._id}
                        session={session}
                        routineView
                        onLogSession={openLogSession}
                        onMarkAttendance={handleMarkAttendance}
                      />
                    ))}
                  </div>
                </section>
              )
            )}
          </div>
        )}
      </PageContainer>

      <LogSessionSheet
        session={logSession}
        open={logSheetOpen}
        onClose={closeLogSession}
        onSubmit={submitLogSession}
        isSubmitting={isSubmittingLog}
      />
    </>
  );
}
