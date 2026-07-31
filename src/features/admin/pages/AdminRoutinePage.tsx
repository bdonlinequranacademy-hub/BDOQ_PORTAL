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
import { PageLoading } from "@/components/ui/PageLoading";
import { ScheduleViewToggle, type ScheduleViewMode } from "@/components/schedule/ScheduleViewToggle";
import { SessionScheduleTable } from "@/components/schedule/SessionScheduleTable";
import { AdminRoutineStatsGrid } from "@/features/admin/components/routine/AdminRoutineStatsGrid";
import { AdminRoutineFilters } from "@/features/admin/components/routine/AdminRoutineFilters";
import { AdminRoutineSessionTable } from "@/features/admin/components/routine/AdminRoutineSessionTable";
import { AdminRoutineSidebar } from "@/features/admin/components/routine/AdminRoutineSidebar";
import {
  computeAdminRoutineStats,
  countSessionsByDay,
  extractCourseTypeOptions,
  filterAdminRoutineSessions,
  type AdminRoutineStatusFilter,
} from "@/features/admin/components/routine/adminRoutineUtils";
import { sortSessionsForTable, SCHEDULE_DAYS } from "@/lib/utils/schedule";
import { uniqueCountries } from "@/lib/utils/countryDisplay";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { useSessionClock } from "@/hooks/useSessionClock";
import type { SessionSlotView } from "@/types/models";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

type DayFilter = "" | (typeof SCHEDULE_DAYS)[number];

export function AdminRoutinePage() {
  const { t } = usePortalTranslation();
  const navigate = useNavigate();
  const nowMs = useSessionClock();

  const [view, setView] = useState<ScheduleViewMode>("timeline");
  const [courseType, setCourseType] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminRoutineStatusFilter>("");
  const [dayFilter, setDayFilter] = useState<DayFilter>("");

  const { data: teachers = [] } = useAdminTeachers();
  const { data: sessions = [], isLoading, isError, refetch } = useAdminAcademyRoutine(
    teacherId || undefined
  );
  const resync = useResyncAdminSchedule();

  const stats = useMemo(
    () => computeAdminRoutineStats(sessions, nowMs),
    [sessions, nowMs]
  );

  const courseTypes = useMemo(() => extractCourseTypeOptions(sessions), [sessions]);

  const countryOptions = useMemo(
    () =>
      uniqueCountries([
        ...sessions.map((session) => session.student.country),
        ...sessions.map((session) => session.teacher.country),
      ]),
    [sessions]
  );

  const filteredSessions = useMemo(
    () =>
      filterAdminRoutineSessions(
        sessions,
        {
          courseType,
          teacherId,
          country: countryFilter,
          status: statusFilter,
          day: dayFilter,
        },
        nowMs
      ),
    [sessions, courseType, teacherId, countryFilter, statusFilter, dayFilter, nowMs]
  );

  const dayCounts = useMemo(() => countSessionsByDay(sessions), [sessions]);

  const tableSessions = useMemo(
    () => sortSessionsForTable(filteredSessions),
    [filteredSessions]
  );

  const tablePagination = usePaginatedList(tableSessions, {
    pageSize: 15,
    resetDeps: [courseType, teacherId, countryFilter, statusFilter, dayFilter, view],
  });

  const teacherOptions = useMemo(
    () =>
      [...teachers]
        .filter((teacher) => teacher.role === "teacher")
        .map((teacher) => ({ id: teacher.id, name: teacher.name }))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [teachers]
  );

  function handleViewClass(session: SessionSlotView) {
    navigate(`/admin/classes/${session.classId}`);
  }

  function clearFilters() {
    setCourseType("");
    setTeacherId("");
    setCountryFilter("");
    setStatusFilter("");
    setDayFilter("");
  }

  const hasFilters = Boolean(courseType || teacherId || countryFilter || statusFilter || dayFilter);

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            {t("admin.routine.title")}
          </h1>
          <p className="portal-page-subtitle mt-1 max-w-2xl text-portal-muted">
            {t("admin.routine.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ScheduleViewToggle value={view} onChange={setView} />
          <Button
            type="button"
            variant="ghost"
            disabled={resync.isPending}
            onClick={() => resync.mutate()}
            className="inline-flex items-center gap-2 rounded-xl border border-portal bg-portal-surface px-4 py-2.5 text-sm font-semibold text-portal-heading hover:bg-portal-muted/50"
          >
            <RefreshCw className={cn("size-4", resync.isPending && "animate-spin")} aria-hidden />
            {resync.isPending ? t("admin.routine.syncing") : t("admin.routine.resyncSlots")}
          </Button>
        </div>
      </div>

      <AdminRoutineStatsGrid stats={stats} isLoading={isLoading} />

      <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:p-5">
            <AdminRoutineFilters
              courseTypes={courseTypes}
              teachers={teacherOptions}
              countries={countryOptions}
              dayCounts={dayCounts}
              courseType={courseType}
              teacherId={teacherId}
              country={countryFilter}
              status={statusFilter}
              day={dayFilter}
              onCourseTypeChange={setCourseType}
              onTeacherChange={setTeacherId}
              onCountryChange={setCountryFilter}
              onStatusChange={setStatusFilter}
              onDayChange={(value) => setDayFilter(value as DayFilter)}
            />
          </div>

          {isError ? (
            <EmptyState
              icon={CalendarDays}
              title={t("admin.routine.loadError")}
              description={t("admin.common.loadErrorDesc")}
              actionLabel={t("admin.common.retry")}
              onAction={() => refetch()}
            />
          ) : isLoading ? (
            <PageLoading label={t("admin.common.loadingRoutine")} />
          ) : filteredSessions.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title={t("admin.routine.noRoutine")}
              description={
                hasFilters
                  ? t("admin.common.clearFiltersHint")
                  : t("admin.routine.noRoutineDesc")
              }
              actionLabel={hasFilters ? t("admin.routine.clearFilters") : undefined}
              onAction={hasFilters ? clearFilters : undefined}
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
            <AdminRoutineSessionTable
              sessions={filteredSessions}
              onViewClass={handleViewClass}
            />
          )}
        </div>

        <AdminRoutineSidebar
          sessions={filteredSessions}
          allSessions={sessions}
          stats={stats}
          nowMs={nowMs}
          onResync={() => resync.mutate()}
          resyncPending={resync.isPending}
        />
      </div>
    </PageContainer>
  );
}
