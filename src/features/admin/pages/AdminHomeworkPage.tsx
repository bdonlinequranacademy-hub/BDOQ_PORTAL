import { useMemo, useState } from "react";
import { BookOpenCheck } from "lucide-react";
import type { AdminHomeworkItem } from "@/types/models";
import { useAdminHomework, useDeleteAdminHomework } from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { useCurriculumTree } from "@/components/curriculum/NestedCurriculumSelect";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminHomeworkOverviewHeader } from "@/features/admin/components/homework/AdminHomeworkOverviewHeader";
import { AdminHomeworkStatsGrid } from "@/features/admin/components/homework/AdminHomeworkStatsGrid";
import { AdminHomeworkPendingAlert } from "@/features/admin/components/homework/AdminHomeworkPendingAlert";
import { AdminHomeworkByTeacherTable } from "@/features/admin/components/homework/AdminHomeworkByTeacherTable";
import { AdminHomeworkProgramDonut } from "@/features/admin/components/homework/AdminHomeworkProgramDonut";
import { AdminHomeworkSubmissionTrendChart } from "@/features/admin/components/homework/AdminHomeworkSubmissionTrendChart";
import { AdminHomeworkQuickActions } from "@/features/admin/components/homework/AdminHomeworkQuickActions";
import { AdminHomeworkToolbar } from "@/features/admin/components/homework/AdminHomeworkToolbar";
import { AdminHomeworkTable } from "@/features/admin/components/homework/AdminHomeworkTable";
import { AdminHomeworkPendingTable } from "@/features/admin/components/homework/AdminHomeworkPendingTable";
import { AdminHomeworkSidebar } from "@/features/admin/components/homework/AdminHomeworkSidebar";
import { AdminHomeworkDetailModal } from "@/features/admin/components/homework/AdminHomeworkDetailModal";
import {
  buildHomeworkSubmissionTrend,
  computeHomeworkStats,
  exportHomeworkFile,
  extractClassOptions,
  extractTeacherOptions,
  filterHomework,
  getAwaitingGradeHomework,
  groupHomeworkByTeacher,
  isHomeworkFullyGraded,
  isHomeworkOverdueIncomplete,
  type AdminHomeworkTab,
  type HomeworkSort,
  type HomeworkTrendRange,
} from "@/features/admin/components/homework/adminHomeworkUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function AdminHomeworkPage() {
  const { t } = usePortalTranslation();
  const [tab, setTab] = useState<AdminHomeworkTab>("all");
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState<HomeworkSort>("due_soonest");
  const [trendRange, setTrendRange] = useState<HomeworkTrendRange>("year");
  const [selectedItem, setSelectedItem] = useState<AdminHomeworkItem | null>(null);

  const { data: homework = [], isLoading, isError, isFetching, refetch } = useAdminHomework();
  const deleteHomework = useDeleteAdminHomework();
  const { data: curriculumTree = [] } = useCurriculumTree();

  const stats = useMemo(() => computeHomeworkStats(homework), [homework]);
  const teacherRows = useMemo(() => groupHomeworkByTeacher(homework), [homework]);
  const trendData = useMemo(
    () => buildHomeworkSubmissionTrend(homework, trendRange),
    [homework, trendRange]
  );
  const awaitingGradeItems = useMemo(() => getAwaitingGradeHomework(homework), [homework]);
  const classOptions = useMemo(() => extractClassOptions(homework), [homework]);
  const teacherOptions = useMemo(() => extractTeacherOptions(homework), [homework]);

  const tabCounts = useMemo(
    () => ({
      all: homework.length,
      awaiting_grade: homework.filter((item) => (item.pendingGradeCount ?? 0) > 0).length,
      overdue: homework.filter((item) => isHomeworkOverdueIncomplete(item)).length,
      fully_graded: homework.filter((item) => isHomeworkFullyGraded(item)).length,
    }),
    [homework]
  );

  const visibleHomework = useMemo(
    () =>
      filterHomework(homework, {
        tab,
        search,
        programFilter,
        classFilter,
        teacherFilter,
        dateFrom,
        dateTo,
        sortBy,
      }),
    [
      homework,
      tab,
      search,
      programFilter,
      classFilter,
      teacherFilter,
      dateFrom,
      dateTo,
      sortBy,
    ]
  );

  const pagination = usePaginatedList(visibleHomework, {
    pageSize: 10,
    resetDeps: [
      tab,
      search,
      programFilter,
      classFilter,
      teacherFilter,
      dateFrom,
      dateTo,
      sortBy,
    ],
  });

  const busy = deleteHomework.isPending;

  async function handleDelete(item: AdminHomeworkItem) {
    const ok = window.confirm(
      t("admin.homework.confirmDelete", { title: item.title })
    );
    if (!ok) return;
    await deleteHomework.mutateAsync(item._id);
    if (selectedItem?._id === item._id) setSelectedItem(null);
  }

  function handleExport() {
    exportHomeworkFile(visibleHomework, "homework-filtered");
  }

  return (
    <PageContainer>
      <AdminHomeworkOverviewHeader onExport={handleExport} />

      <AdminHomeworkStatsGrid
        stats={stats}
        isLoading={isLoading}
        onAwaitingGradeClick={() => setTab("awaiting_grade")}
        onOverdueClick={() => setTab("overdue")}
      />

      <AdminHomeworkPendingAlert
        awaitingGradeCount={stats.awaitingGrade}
        overdueCount={stats.overdue}
        onReviewAwaitingGrade={() => setTab("awaiting_grade")}
        onReviewOverdue={() => setTab("overdue")}
      />

      {isError ? (
        <EmptyState
          icon={BookOpenCheck}
          title={t("admin.homework.loadError")}
          description={t("admin.common.loadErrorDesc")}
          actionLabel={t("admin.common.retry")}
          onAction={() => void refetch()}
        />
      ) : isLoading ? (
        <PageLoading label={t("admin.common.loadingHomework")} />
      ) : homework.length === 0 ? (
        <EmptyState
          icon={BookOpenCheck}
          title={t("admin.common.noHomework")}
          description={t("admin.common.noHomeworkDesc")}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
            <div className="flex min-w-0 flex-col gap-5">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <AdminHomeworkByTeacherTable
                  rows={teacherRows}
                  onViewAll={() => setTab("all")}
                />
                <AdminHomeworkProgramDonut items={homework} />
                <AdminHomeworkSubmissionTrendChart
                  data={trendData}
                  range={trendRange}
                  onRangeChange={setTrendRange}
                />
              </div>

              <AdminHomeworkToolbar
                search={search}
                programFilter={programFilter}
                classFilter={classFilter}
                teacherFilter={teacherFilter}
                dateFrom={dateFrom}
                dateTo={dateTo}
                sortBy={sortBy}
                tab={tab}
                tabCounts={tabCounts}
                classes={classOptions}
                teachers={teacherOptions}
                curriculumTree={curriculumTree}
                onSearchChange={setSearch}
                onProgramChange={setProgramFilter}
                onClassChange={setClassFilter}
                onTeacherChange={setTeacherFilter}
                onDateFromChange={setDateFrom}
                onDateToChange={setDateTo}
                onSortChange={setSortBy}
                onTabChange={setTab}
                onExport={handleExport}
              />

              {visibleHomework.length === 0 ? (
                <EmptyState
                  icon={BookOpenCheck}
                  title={t("admin.common.noHomeworkMatch")}
                  description={t("admin.common.clearFiltersHint")}
                />
              ) : (
                <>
                  <AdminHomeworkTable
                    items={pagination.paginatedItems}
                    totalCount={visibleHomework.length}
                    busy={busy}
                    onView={setSelectedItem}
                    onDelete={handleDelete}
                  />
                  <Pagination pagination={pagination} itemLabel="assignments" />
                </>
              )}

              <AdminHomeworkPendingTable
                items={awaitingGradeItems}
                busy={busy}
                onView={setSelectedItem}
                onDelete={handleDelete}
                onViewAll={() => setTab("awaiting_grade")}
              />
            </div>

            <div className="flex flex-col gap-4">
              <AdminHomeworkQuickActions
                awaitingGradeCount={tabCounts.awaiting_grade}
                isFetching={isFetching}
                onExport={handleExport}
                onRefresh={() => void refetch()}
                onReviewAwaitingGrade={() => setTab("awaiting_grade")}
                onReviewOverdue={() => setTab("overdue")}
              />
              <AdminHomeworkSidebar items={homework} />
            </div>
          </div>
        </>
      )}

      <AdminHomeworkDetailModal
        item={selectedItem}
        busy={busy}
        onClose={() => setSelectedItem(null)}
        onDelete={handleDelete}
      />
    </PageContainer>
  );
}
