import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import {
  useAdminClasses,
  useAdminProgress,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { Card } from "@/components/ui/Card";
import { useCurriculumTree } from "@/components/curriculum/NestedCurriculumSelect";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminProgressOverviewHeader } from "@/features/admin/components/progress/AdminProgressOverviewHeader";
import { AdminProgressStatsGrid } from "@/features/admin/components/progress/AdminProgressStatsGrid";
import { AdminProgressTrendChart } from "@/features/admin/components/progress/AdminProgressTrendChart";
import { AdminProgressProgramDonut } from "@/features/admin/components/progress/AdminProgressProgramDonut";
import { AdminProgressTopStudents } from "@/features/admin/components/progress/AdminProgressTopStudents";
import { AdminProgressToolbar } from "@/features/admin/components/progress/AdminProgressToolbar";
import { AdminProgressTable } from "@/features/admin/components/progress/AdminProgressTable";
import { AdminProgressDistribution } from "@/features/admin/components/progress/AdminProgressDistribution";
import { AdminProgressQuickActions } from "@/features/admin/components/progress/AdminProgressQuickActions";
import { AdminProgressDetailModal } from "@/features/admin/components/progress/AdminProgressDetailModal";
import {
  buildProgressDistribution,
  buildProgressMonthlyTrend,
  computeProgressStats,
  exportProgressFile,
  filterProgressRecords,
  getDefaultMonthRange,
  getTopStudents,
  groupProgressByProgram,
  type IProgressRowView,
  type ProgressSort,
  type ProgressTrendRange,
} from "@/features/admin/components/progress/adminProgressUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function AdminProgressPage() {
  const { t } = usePortalTranslation();
  const [params, setParams] = useSearchParams();
  const defaultRange = getDefaultMonthRange();

  const initialClassId = params.get("classId") ?? "";
  const [classFilter, setClassFilter] = useState(initialClassId);
  const [programFilter, setProgramFilter] = useState("");
  const [dateFrom, setDateFrom] = useState(defaultRange.from);
  const [dateTo, setDateTo] = useState(defaultRange.to);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<ProgressSort>("highest");
  const [trendRange, setTrendRange] = useState<ProgressTrendRange>("year");
  const [selectedRecord, setSelectedRecord] = useState<IProgressRowView | null>(null);

  const {
    data: records = [],
    isLoading,
    isFetching,
    refetch,
  } = useAdminProgress(classFilter || undefined);
  const { data: classes = [] } = useAdminClasses();
  const { data: curriculumTree = [] } = useCurriculumTree();

  useEffect(() => {
    setClassFilter(params.get("classId") ?? "");
  }, [params]);

  const missingProgramCount = useMemo(
    () => records.filter((record) => !record.curriculumProgram).length,
    [records]
  );

  const analyticsRecords = useMemo(
    () =>
      filterProgressRecords(records, {
        search: "",
        programFilter,
        classFilter: "",
        dateFrom,
        dateTo,
        sortBy: "highest",
      }),
    [records, programFilter, dateFrom, dateTo]
  );

  const stats = useMemo(() => computeProgressStats(analyticsRecords), [analyticsRecords]);
  const trendData = useMemo(
    () => buildProgressMonthlyTrend(analyticsRecords, trendRange),
    [analyticsRecords, trendRange]
  );
  const programSegments = useMemo(
    () => groupProgressByProgram(analyticsRecords),
    [analyticsRecords]
  );
  const topStudents = useMemo(() => getTopStudents(analyticsRecords), [analyticsRecords]);
  const distribution = useMemo(
    () => buildProgressDistribution(analyticsRecords),
    [analyticsRecords]
  );

  const visibleRows = useMemo(
    () =>
      filterProgressRecords(records, {
        search,
        programFilter,
        classFilter: "",
        dateFrom,
        dateTo,
        sortBy,
      }),
    [records, search, programFilter, dateFrom, dateTo, sortBy]
  );

  const pagination = usePaginatedList(visibleRows, {
    pageSize: 10,
    resetDeps: [search, programFilter, classFilter, dateFrom, dateTo, sortBy],
  });

  const overallAvg =
    stats.totalRecords > 0
      ? Math.round((stats.avgTajweed + stats.avgMemorization) / 2)
      : 0;

  function handleClassChange(value: string) {
    setClassFilter(value);
    if (value) {
      setParams({ classId: value });
    } else {
      setParams({});
    }
  }

  function handleExport() {
    exportProgressFile(visibleRows);
  }

  return (
    <PageContainer>
      <AdminProgressOverviewHeader
        dateFrom={dateFrom}
        dateTo={dateTo}
        programFilter={programFilter}
        classFilter={classFilter}
        classes={classes.map((cls) => ({ _id: cls._id, title: cls.title }))}
        curriculumTree={curriculumTree}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onProgramChange={setProgramFilter}
        onClassChange={handleClassChange}
        onExport={handleExport}
      />

      <AdminProgressStatsGrid stats={stats} isLoading={isLoading} />

      {missingProgramCount > 0 ? (
        <Card className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm text-amber-800">
            {t("admin.progress.missingProgramWarning")}
          </p>
        </Card>
      ) : null}

      {isLoading ? (
        <PageLoading label={t("admin.common.loadingProgress")} />
      ) : records.length === 0 ? (
        <EmptyState
          icon={TrendingUp}
          title={t("admin.common.noProgress")}
          description={t("admin.common.noProgressDesc")}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            <AdminProgressTrendChart
              data={trendData}
              range={trendRange}
              onRangeChange={setTrendRange}
            />
            <AdminProgressProgramDonut
              segments={programSegments}
              overallAvg={overallAvg}
              totalRecords={stats.totalRecords}
            />
            <AdminProgressTopStudents students={topStudents} />
          </div>

          <div className="grid grid-cols-1 items-start gap-3 xl:gap-4 xl:grid-cols-[minmax(0,1fr)_280px] mt-4">
            <div className="flex min-w-0 flex-col gap-3">
              <AdminProgressToolbar
                search={search}
                sortBy={sortBy}
                onSearchChange={setSearch}
                onSortChange={setSortBy}
              />
              <AdminProgressTable
                rows={pagination.paginatedItems}
                totalCount={visibleRows.length}
                onView={setSelectedRecord}
              />
              <Pagination pagination={pagination} itemLabel="records" />
            </div>

            <aside className="flex flex-col gap-3">
              <AdminProgressDistribution
                segments={distribution}
                totalRecords={stats.totalRecords}
              />
              <AdminProgressQuickActions
                isFetching={isFetching}
                onExport={handleExport}
                onRefresh={() => void refetch()}
              />
            </aside>
          </div>
        </>
      )}

      <AdminProgressDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </PageContainer>
  );
}
