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
import { usePortalTranslation } from "@/i18n/LocaleProvider";

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

export function TeacherRoutinePage() {
  const navigate = useNavigate();
  const { t } = usePortalTranslation();
  const [view, setView] = useState<ScheduleViewMode>("table");
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

  function handleViewClass(session: SessionSlotView) {
    if (!session.classId) return;
    navigate(`/teacher/classes/${session.classId}`);
  }

  return (
    <>
      <PageContainer className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-dark">{t("teacher.myRoutine")}</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {totalSessions === 1
                ? t("teacher.routineSubtitle", { count: String(totalSessions) })
                : t("teacher.routineSubtitlePlural", { count: String(totalSessions) })}
            </p>
          </div>
          {totalSessions > 0 ? (
            <ScheduleViewToggle value={view} onChange={setView} />
          ) : null}
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3">
          <CalendarDays className="size-5 shrink-0 text-primary" />
          <span className="text-sm text-portal-heading">{t("teacher.academyWeekNote")}</span>
        </div>

        {isLoading ? (
          <PageLoading label={t("teacher.loadingRoutine")} />
        ) : totalSessions === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-10 text-center">
            <p className="font-semibold text-primary-dark">{t("teacher.noRoutineYet")}</p>
            <p className="mt-1 text-sm text-zinc-400">{t("teacher.noRoutineYetDesc")}</p>
          </div>
        ) : view === "table" ? (
          <SessionScheduleTable
            sessions={tableSessions}
            routineView
            joinRole="teacher"
            onLogSession={openLogSession}
            onMarkAttendance={handleMarkAttendance}
            onViewClass={handleViewClass}
          />
        ) : (
          <div className="flex flex-col gap-5">
            {grouped.map(({ day, sessions: daySessions }) =>
              daySessions.length === 0 ? null : (
                <section key={day} className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 border-b border-zinc-100 pb-2">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-primary-dark">
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
                        joinRole="teacher"
                        onLogSession={openLogSession}
                        onMarkAttendance={handleMarkAttendance}
                        onViewClass={handleViewClass}
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
