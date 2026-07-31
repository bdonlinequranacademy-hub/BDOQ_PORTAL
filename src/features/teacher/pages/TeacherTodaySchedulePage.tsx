import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, RefreshCw } from "lucide-react";
import { useTeacherTodaySchedule } from "@/features/teacher/hooks/useTeacher";
import { useLogSessionFlow } from "@/features/teacher/hooks/useLogSessionFlow";
import { PageContainer } from "@/components/layout/PageContainer";
import { LogSessionSheet } from "@/components/schedule/LogSessionSheet";
import { ScheduleViewToggle, type ScheduleViewMode } from "@/components/schedule/ScheduleViewToggle";
import { SessionTimelineRow } from "@/components/schedule/SessionTimelineRow";
import { SessionScheduleTable } from "@/components/schedule/SessionScheduleTable";
import { sortSessionsByAcademyTime } from "@/lib/utils/schedule";
import { countSessionsByPhase } from "@/lib/utils/sessionTiming";
import { useSessionClock } from "@/hooks/useSessionClock";
import { Button } from "@/components/ui/Button";
import type { SessionSlotView } from "@/types/models";
import { PageLoading } from "@/components/ui/PageLoading";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

export function TeacherTodaySchedulePage() {
  const navigate = useNavigate();
  const { t } = usePortalTranslation();
  const [view, setView] = useState<ScheduleViewMode>("timeline");
  const now = useSessionClock();
  const { data, isLoading, isFetching, refetch } = useTeacherTodaySchedule();
  const {
    logSession,
    logSheetOpen,
    openLogSession,
    closeLogSession,
    submitLogSession,
    isSubmittingLog,
  } = useLogSessionFlow();

  const sessions = sortSessionsByAcademyTime(data?.sessions ?? []);
  const day = data?.day ?? t("teacher.todaysSchedule");
  const stats = useMemo(
    () => countSessionsByPhase(sessions, now),
    [sessions, now]
  );

  function handleMarkAttendance(session: SessionSlotView) {
    navigate(
      `/teacher/attendance/sheet?classId=${session.classId}&date=${todayIsoDate()}`
    );
  }

  function handleViewClass(session: SessionSlotView) {
    if (!session.classId) return;
    navigate(`/teacher/classes/${session.classId}`);
  }

  const statItems = [
    { label: t("teacher.totalSessions"), value: stats.total, tone: "text-primary-dark" },
    { label: t("teacher.remaining"), value: stats.upcoming, tone: "text-primary" },
    { label: t("teacher.completed"), value: stats.completed, tone: "text-zinc-500" },
  ];

  return (
    <>
      <PageContainer className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary-dark">
              {t("teacher.todayScheduleTitle")}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {t("teacher.todayScheduleSubtitle", { day })}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {sessions.length > 0 ? (
              <ScheduleViewToggle value={view} onChange={setView} />
            ) : null}
            <Button
              type="button"
              variant="secondary"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-xl"
            >
              <RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} />
              {t("teacher.refresh")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {statItems.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-zinc-100 bg-white px-4 py-3 shadow-sm"
            >
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                {item.label}
              </p>
              <p className={`text-2xl font-bold ${item.tone}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {stats.live > 0 ? (
          <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <span className="size-2 animate-pulse rounded-full bg-red-500" />
            {stats.live === 1
              ? t("teacher.sessionsLiveNow", { count: String(stats.live) })
              : t("teacher.sessionsLiveNowPlural", { count: String(stats.live) })}
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-2xl bg-primary/10 px-4 py-3">
            <Calendar className="size-5 text-primary" />
            <span className="text-sm font-semibold text-primary">
              {isLoading
                ? t("common.loading")
                : sessions.length === 1
                  ? t("teacher.sessionsOnDay", {
                      count: String(sessions.length),
                      day,
                    })
                  : t("teacher.sessionsOnDayPlural", {
                      count: String(sessions.length),
                      day,
                    })}
            </span>
          </div>
        )}

        {isLoading ? (
          <PageLoading label={t("teacher.loadingSchedule")} />
        ) : sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-10 text-center">
            <p className="font-semibold text-primary-dark">{t("teacher.noClassesScheduledToday")}</p>
            <p className="mt-1 text-sm text-zinc-400">{t("teacher.noClassesScheduledTodayDesc")}</p>
            <Button
              type="button"
              variant="secondary"
              className="mt-4 rounded-xl"
              onClick={() => navigate("/teacher/schedule/routine")}
            >
              {t("teacher.viewMyRoutine")}
            </Button>
          </div>
        ) : view === "table" ? (
          <SessionScheduleTable
            sessions={sessions}
            joinRole="teacher"
            onLogSession={openLogSession}
            onMarkAttendance={handleMarkAttendance}
            onViewClass={handleViewClass}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <SessionTimelineRow
                key={session._id}
                session={session}
                joinRole="teacher"
                onLogSession={openLogSession}
                onMarkAttendance={handleMarkAttendance}
                onViewClass={handleViewClass}
              />
            ))}
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
