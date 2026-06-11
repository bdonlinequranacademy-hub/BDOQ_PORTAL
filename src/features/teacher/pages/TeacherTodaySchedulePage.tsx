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

function todayIsoDate() {
  return new Date().toISOString().split("T")[0];
}

export function TeacherTodaySchedulePage() {
  const navigate = useNavigate();
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
  const day = data?.day ?? "Today";
  const stats = useMemo(
    () => countSessionsByPhase(sessions, now),
    [sessions, now]
  );

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
            <h1 className="font-display text-2xl font-bold text-[#03214F]">
              Today&apos;s Schedule
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              {day} — live countdown · session status syncs every minute
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
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total sessions", value: stats.total, tone: "text-[#03214F]" },
            { label: "Remaining", value: stats.upcoming, tone: "text-[#2b7fff]" },
            { label: "Completed", value: stats.completed, tone: "text-zinc-500" },
          ].map((item) => (
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
            {stats.live} session{stats.live === 1 ? "" : "s"} live right now
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-2xl bg-[#2b7fff]/10 px-4 py-3">
            <Calendar className="size-5 text-[#2b7fff]" />
            <span className="text-sm font-semibold text-[#2b7fff]">
              {isLoading
                ? "Loading…"
                : `${sessions.length} session${sessions.length === 1 ? "" : "s"} on ${day}`}
            </span>
          </div>
        )}

        {isLoading ? (
          <p className="text-sm text-zinc-400">Loading schedule…</p>
        ) : sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 bg-white p-10 text-center">
            <p className="font-semibold text-[#03214F]">No classes scheduled today</p>
            <p className="mt-1 text-sm text-zinc-400">
              Check your weekly routine or ask admin to update class schedules.
            </p>
            <Button
              type="button"
              variant="secondary"
              className="mt-4 rounded-xl"
              onClick={() => navigate("/teacher/schedule/routine")}
            >
              View My Routine
            </Button>
          </div>
        ) : view === "table" ? (
          <SessionScheduleTable
            sessions={sessions}
            onLogSession={openLogSession}
            onMarkAttendance={handleMarkAttendance}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {sessions.map((session) => (
              <SessionTimelineRow
                key={session._id}
                session={session}
                onLogSession={openLogSession}
                onMarkAttendance={handleMarkAttendance}
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
