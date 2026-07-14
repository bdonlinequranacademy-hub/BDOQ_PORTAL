import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import {
  useAdminAttendance,
  useAdminClasses,
  useAdminStats,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminAttendanceOverviewHeader } from "@/features/admin/components/attendance/AdminAttendanceOverviewHeader";
import { AdminAttendanceStatsGrid } from "@/features/admin/components/attendance/AdminAttendanceStatsGrid";
import { AdminAttendanceTrendChart } from "@/features/admin/components/attendance/AdminAttendanceTrendChart";
import { AdminAttendanceClassDonut } from "@/features/admin/components/attendance/AdminAttendanceClassDonut";
import { AdminAttendanceSummaryCard } from "@/features/admin/components/attendance/AdminAttendanceSummaryCard";
import { AdminAttendanceTodayClasses } from "@/features/admin/components/attendance/AdminAttendanceTodayClasses";
import { AdminAttendanceToolbar } from "@/features/admin/components/attendance/AdminAttendanceToolbar";
import { AdminAttendanceTable } from "@/features/admin/components/attendance/AdminAttendanceTable";
import { AdminAttendanceQuickActions } from "@/features/admin/components/attendance/AdminAttendanceQuickActions";
import {
  buildAttendanceClassTrend,
  computeAttendanceStats,
  exportAttendanceFile,
  filterAttendanceOverview,
  getAttendanceSummary,
  groupAttendanceByClass,
  type AttendanceRateFilter,
  type AttendanceSort,
} from "@/features/admin/components/attendance/adminAttendanceUtils";

export function AdminAttendancePage() {
  const [params, setParams] = useSearchParams();
  const initialClassId = params.get("classId") ?? "";
  const [classFilter, setClassFilter] = useState(initialClassId);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<AttendanceSort>("highest");
  const [rateFilter, setRateFilter] = useState<AttendanceRateFilter>("all");

  const {
    data: overview = [],
    isLoading,
    isFetching,
    refetch,
  } = useAdminAttendance(classFilter || undefined);
  const { data: classes = [] } = useAdminClasses();
  const { data: stats } = useAdminStats();

  useEffect(() => {
    setClassFilter(params.get("classId") ?? "");
  }, [params]);

  const hasActiveFilters =
    Boolean(classFilter) ||
    Boolean(search.trim()) ||
    sortBy !== "highest" ||
    rateFilter !== "all";

  const attendanceStats = useMemo(
    () => computeAttendanceStats(overview, stats),
    [overview, stats]
  );
  const trendData = useMemo(() => buildAttendanceClassTrend(overview), [overview]);
  const classSegments = useMemo(() => groupAttendanceByClass(overview), [overview]);
  const summary = useMemo(() => getAttendanceSummary(overview), [overview]);

  const visibleRows = useMemo(
    () =>
      filterAttendanceOverview(
        overview,
        { search, classFilter: "", sortBy, rateFilter },
        classes
      ),
    [overview, search, sortBy, rateFilter, classes]
  );

  const pagination = usePaginatedList(visibleRows, {
    pageSize: 10,
    resetDeps: [search, sortBy, classFilter, rateFilter],
  });

  const selectedClassLabel = useMemo(() => {
    if (!classFilter) return undefined;
    return classes.find((cls) => cls._id === classFilter)?.title;
  }, [classFilter, classes]);

  function handleClassChange(value: string) {
    setClassFilter(value);
    if (value) {
      setParams({ classId: value });
    } else {
      setParams({});
    }
  }

  function handleClearFilters() {
    setClassFilter("");
    setSearch("");
    setSortBy("highest");
    setRateFilter("all");
    setParams({});
  }

  function handleExport() {
    exportAttendanceFile(visibleRows, classes);
  }

  return (
    <PageContainer>
      <AdminAttendanceOverviewHeader
        classFilter={classFilter}
        rateFilter={rateFilter}
        classes={classes.map((cls) => ({ _id: cls._id, title: cls.title }))}
        hasActiveFilters={hasActiveFilters}
        isFetching={isFetching}
        onClassChange={handleClassChange}
        onRateFilterChange={setRateFilter}
        onClearFilters={handleClearFilters}
        onRefresh={() => void refetch()}
        onExport={handleExport}
      />

      <AdminAttendanceStatsGrid stats={attendanceStats} isLoading={isLoading} />

      {isLoading ? (
        <PageLoading label="Loading attendance…" />
      ) : overview.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No attendance data yet"
          description={
            classFilter
              ? "No attendance records for this class yet. Clear the class filter to see all classes."
              : "Overview appears once teachers start marking attendance in classes."
          }
          actionLabel={classFilter ? "Clear class filter" : undefined}
          onAction={classFilter ? handleClearFilters : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-w-0 flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <AdminAttendanceTrendChart data={trendData} />
              <AdminAttendanceClassDonut
                segments={classSegments}
                averageAttendance={attendanceStats.averageAttendance}
              />
            </div>

            <AdminAttendanceToolbar
              search={search}
              sortBy={sortBy}
              rateFilter={rateFilter}
              classFilterLabel={selectedClassLabel}
              resultCount={visibleRows.length}
              hasActiveFilters={hasActiveFilters}
              onSearchChange={setSearch}
              onSortChange={setSortBy}
              onRateFilterChange={setRateFilter}
              onClearFilters={handleClearFilters}
              onExport={handleExport}
            />

            {visibleRows.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No classes match your filters"
                description="Try clearing search, rate filter, or selecting a different class."
                actionLabel="Clear all filters"
                onAction={handleClearFilters}
              />
            ) : (
              <>
                <AdminAttendanceTable
                  rows={pagination.paginatedItems}
                  classes={classes}
                  totalCount={visibleRows.length}
                />
                <Pagination pagination={pagination} itemLabel="classes" />
              </>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <AdminAttendanceSummaryCard
              present={summary.present}
              absent={summary.absent}
              total={summary.total}
            />
            <AdminAttendanceTodayClasses
              sessions={stats?.todaysClasses ?? []}
              overview={overview}
            />
            <AdminAttendanceQuickActions
              isFetching={isFetching}
              onExport={handleExport}
              onRefresh={() => void refetch()}
            />
          </div>
        </div>
      )}
    </PageContainer>
  );
}
