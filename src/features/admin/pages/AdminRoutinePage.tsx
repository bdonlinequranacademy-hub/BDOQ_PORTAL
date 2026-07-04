import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, RefreshCw } from "lucide-react";
import {
  useAdminAcademyRoutine,
  useAdminTeachers,
  useResyncAdminSchedule,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { ScheduleViewToggle, type ScheduleViewMode } from "@/components/schedule/ScheduleViewToggle";
import { SessionTimelineRow } from "@/components/schedule/SessionTimelineRow";
import { SessionScheduleTable } from "@/components/schedule/SessionScheduleTable";
import { formControlClass } from "@/lib/formControl";
import { groupSessionsByDay, sortSessionsForTable, SCHEDULE_DAYS } from "@/lib/utils/schedule";
import { uniqueCountries, formatCountryWithFlag } from "@/lib/utils/countryDisplay";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import type { SessionSlotView } from "@/types/models";
import { cn } from "@/lib/utils/cn";

import { PageLoading } from "@/components/ui/PageLoading";

type DayFilter = "" | (typeof SCHEDULE_DAYS)[number];

export function AdminRoutinePage() {
  const navigate = useNavigate();
  const [view, setView] = useState<ScheduleViewMode>("timeline");
  const [teacherId, setTeacherId] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [dayFilter, setDayFilter] = useState<DayFilter>("");
  const { data: teachers = [] } = useAdminTeachers();
  const { data: sessions = [], isLoading, isError, refetch } = useAdminAcademyRoutine(
    teacherId || undefined
  );
  const resync = useResyncAdminSchedule();

  const countryOptions = useMemo(
    () =>
      uniqueCountries([
        ...sessions.map((s) => s.student.country),
        ...sessions.map((s) => s.teacher.country),
      ]),
    [sessions]
  );

  const filteredSessions = useMemo(() => {
    let list = sessions;
    if (countryFilter) {
      list = list.filter(
        (s) =>
          s.student.country?.trim() === countryFilter ||
          s.teacher.country?.trim() === countryFilter
      );
    }
    if (dayFilter) {
      list = list.filter((s) => s.day === dayFilter);
    }
    return list;
  }, [sessions, countryFilter, dayFilter]);

  const grouped = groupSessionsByDay(filteredSessions);
  const tableSessions = useMemo(
    () => sortSessionsForTable(filteredSessions),
    [filteredSessions]
  );

  const tablePagination = usePaginatedList(tableSessions, {
    pageSize: 15,
    resetDeps: [teacherId, countryFilter, dayFilter, view],
  });

  const dayCounts = useMemo(() => {
    const counts: Record<string, number> = { all: sessions.length };
    for (const day of SCHEDULE_DAYS) {
      counts[day] = sessions.filter((s) => s.day === day).length;
    }
    return counts;
  }, [sessions]);

  const teacherOptions = useMemo(
    () =>
      [...teachers]
        .filter((t) => t.role === "teacher")
        .sort((a, b) => a.name.localeCompare(b.name)),
    [teachers]
  );

  function handleViewClass(session: SessionSlotView) {
    navigate(`/admin/classes/${session.classId}`);
  }

  return (
    <PageContainer className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-portal-heading">Academy Routine</h1>
          <p className="mt-1 text-sm text-portal-muted">
            Weekly session slots — Saturday → Friday (Bangladesh time)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ScheduleViewToggle value={view} onChange={setView} />
          <Button
            type="button"
            variant="ghost"
            disabled={resync.isPending}
            onClick={() => resync.mutate()}
            className="rounded-xl border border-portal bg-portal-surface px-4 text-portal-heading hover:bg-portal-muted"
          >
            <RefreshCw className={cn("mr-2 size-4", resync.isPending && "animate-spin")} />
            {resync.isPending ? "Syncing…" : "Resync slots"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-portal bg-portal-surface px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-portal-muted">Sessions</p>
          <p className="mt-1 text-2xl font-bold text-portal-heading">{filteredSessions.length}</p>
        </div>
        <div className="rounded-xl border border-portal bg-portal-surface px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-portal-muted">Active days</p>
          <p className="mt-1 text-2xl font-bold text-portal-heading">
            {grouped.filter((g) => g.sessions.length > 0).length}
          </p>
        </div>
        <div className="col-span-2 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 sm:col-span-2">
          <div className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <p className="text-sm text-portal-heading">
              <span className="font-semibold">Timeline view</span> groups sessions by day.
              Switch to table for a compact scan. Live countdown only on today&apos;s classes.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className={cn(formControlClass, "w-full sm:w-44")}
          aria-label="Filter by country"
        >
          <option value="">All countries</option>
          {countryOptions.map((country) => (
            <option key={country} value={country}>
              {formatCountryWithFlag(country)}
            </option>
          ))}
        </select>
        <select
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className={cn(formControlClass, "w-full sm:w-52")}
          aria-label="Filter by teacher"
        >
          <option value="">All teachers</option>
          {teacherOptions.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setDayFilter("")}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
            dayFilter === ""
              ? "bg-primary text-white"
              : "border border-portal bg-portal-surface text-portal-heading hover:bg-portal-muted"
          )}
        >
          All days ({dayCounts.all})
        </button>
        {SCHEDULE_DAYS.map((day) => {
          const count = dayCounts[day] ?? 0;
          if (count === 0 && dayFilter !== day) return null;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setDayFilter(day)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                dayFilter === day
                  ? "bg-primary text-white"
                  : "border border-portal bg-portal-surface text-portal-heading hover:bg-portal-muted"
              )}
            >
              {day.slice(0, 3)} ({count})
            </button>
          );
        })}
      </div>

      {isError ? (
        <EmptyState
          icon={CalendarDays}
          title="Could not load routine"
          description="The server failed to return session slots. Try resyncing or refresh the page."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      ) : isLoading ? (
        <PageLoading label="Loading routine…" />
      ) : filteredSessions.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No session slots"
          description={
            countryFilter || dayFilter || teacherId
              ? "No sessions match your filters. Try clearing filters or resync slots."
              : "Assign students to classes with a schedule, then use Resync slots if needed."
          }
        />
      ) : view === "table" ? (
        <>
          <SessionScheduleTable
            sessions={tablePagination.paginatedItems}
            routineView
            adminMode
            onViewClass={handleViewClass}
          />
          <Pagination pagination={tablePagination} itemLabel="sessions" />
        </>
      ) : (
        <div className="flex flex-col gap-5">
          {grouped.map(({ day, sessions: daySessions }) =>
            daySessions.length === 0 ? null : (
              <section key={day} className="flex flex-col gap-2">
                <div className="sticky top-[4.5rem] z-[1] flex items-center gap-2 border-b border-portal bg-portal/95 py-2 backdrop-blur-sm">
                  <h2 className="text-xs font-bold uppercase tracking-wide text-portal-heading">
                    {day}
                  </h2>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {daySessions.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {daySessions.map((session) => (
                    <SessionTimelineRow
                      key={session._id}
                      session={session}
                      routineView
                      adminMode
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
  );
}
