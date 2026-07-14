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
  type AttendanceSort,
} from "@/features/admin/components/attendance/adminAttendanceUtils";

export function AdminAttendancePage() {
  const [params, setParams] = useSearchParams();
  const initialClassId = params.get("classId") ?? "";
  const [classFilter, setClassFilter] = useState(initialClassId);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<AttendanceSort>("highest");

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
        { search, classFilter: "", sortBy },
        classes
      ),
    [overview, search, sortBy, classes]
  );

  const pagination = usePaginatedList(visibleRows, {
    pageSize: 10,
    resetDeps: [search, sortBy, classFilter],
  });

  function handleClassChange(value: string) {
    setClassFilter(value);
    if (value) {
      setParams({ classId: value });
    } else {
      setParams({});
    }
  }

  function handleExport() {
    exportAttendanceFile(visibleRows, classes);
  }

  return (
    <PageContainer>
      <AdminAttendanceOverviewHeader
        classFilter={classFilter}
        classes={classes.map((cls) => ({ _id: cls._id, title: cls.title }))}
        onClassChange={handleClassChange}
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
              ? "No attendance records for this class yet."
              : "Overview appears once teachers start marking attendance in classes."
          }
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
              onSearchChange={setSearch}
              onSortChange={setSortBy}
              onExport={handleExport}
            />

            {visibleRows.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No classes match your filters"
                description="Try clearing search or selecting a different class."
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
