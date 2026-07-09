import { useMemo, useState } from "react";
import { ClipboardCheck } from "lucide-react";
import type { ClassLogView } from "@/types/models";
import {
  useAdminClassLogs,
  useApproveClassLog,
  useRejectClassLog,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { useCurriculumTree } from "@/components/curriculum/NestedCurriculumSelect";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminClassLogsStatsGrid } from "@/features/admin/components/class-logs/AdminClassLogsStatsGrid";
import {
  AdminClassLogsPendingAlert,
  AdminClassLogsProgramNotice,
} from "@/features/admin/components/class-logs/AdminClassLogsAlerts";
import {
  AdminClassLogsTable,
  AdminClassLogsToolbar,
} from "@/features/admin/components/class-logs/AdminClassLogsTable";
import { AdminClassLogsSidebar } from "@/features/admin/components/class-logs/AdminClassLogsSidebar";
import { AdminClassLogsDetailModal } from "@/features/admin/components/class-logs/AdminClassLogsDetailModal";
import {
  computeClassLogsStats,
  exportClassLogsFile,
  extractTeacherOptions,
  filterAdminClassLogs,
  type AdminClassLogsTab,
} from "@/features/admin/components/class-logs/adminClassLogsUtils";

export function AdminClassLogsPage() {
  const [tab, setTab] = useState<AdminClassLogsTab>("pending");
  const [programFilter, setProgramFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedLog, setSelectedLog] = useState<ClassLogView | null>(null);

  const { data: logs = [], isLoading, isError, isFetching, refetch } = useAdminClassLogs();
  const { data: curriculumTree = [] } = useCurriculumTree();
  const approve = useApproveClassLog();
  const reject = useRejectClassLog();

  const stats = useMemo(() => computeClassLogsStats(logs), [logs]);
  const teacherOptions = useMemo(() => extractTeacherOptions(logs), [logs]);

  const tabCounts = useMemo(
    () => ({
      all: logs.length,
      pending: stats.pending,
      approved: stats.approved,
      rejected: stats.rejected,
    }),
    [logs.length, stats]
  );

  const visibleLogs = useMemo(
    () =>
      filterAdminClassLogs(logs, {
        tab,
        search,
        programFilter,
        teacherFilter,
        dateFrom,
        dateTo,
      }),
    [logs, tab, search, programFilter, teacherFilter, dateFrom, dateTo]
  );

  const missingProgramCount = useMemo(
    () => visibleLogs.filter((log) => !log.curriculumProgram).length,
    [visibleLogs]
  );

  const pagination = usePaginatedList(visibleLogs, {
    pageSize: 10,
    resetDeps: [tab, programFilter, teacherFilter, search, dateFrom, dateTo],
  });

  const busy = approve.isPending || reject.isPending;

  function handleApprove(log: ClassLogView) {
    approve.mutate(log._id, {
      onSuccess: () => setSelectedLog(null),
    });
  }

  function handleReject(log: ClassLogView) {
    const adminNote = window.prompt("Reason for rejection (optional):") ?? undefined;
    reject.mutate(
      { id: log._id, adminNote },
      {
        onSuccess: () => setSelectedLog(null),
      }
    );
  }

  function handleExport() {
    exportClassLogsFile(visibleLogs, "class-logs-filtered");
  }

  return (
    <PageContainer className="gap-5 lg:gap-6">
      <div>
        <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
          Class Log Approval
        </h1>
        <p className="portal-page-subtitle mt-1 max-w-3xl text-portal-muted">
          Review teacher session logs before they count toward verified sessions and earnings.
        </p>
      </div>

      <AdminClassLogsStatsGrid stats={stats} isLoading={isLoading} />

      <AdminClassLogsPendingAlert
        pendingCount={stats.pending}
        onReview={() => setTab("pending")}
      />

      <AdminClassLogsProgramNotice count={missingProgramCount} />

      <AdminClassLogsToolbar
        search={search}
        programFilter={programFilter}
        teacherFilter={teacherFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        tab={tab}
        tabCounts={tabCounts}
        teachers={teacherOptions}
        curriculumTree={curriculumTree}
        onSearchChange={setSearch}
        onProgramChange={setProgramFilter}
        onTeacherChange={setTeacherFilter}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onTabChange={setTab}
        onExport={handleExport}
      />

      {isError ? (
        <EmptyState
          icon={ClipboardCheck}
          title="Could not load class logs"
          description="The server failed to return class logs. Try again in a moment."
          actionLabel="Retry"
          onAction={() => refetch()}
        />
      ) : isLoading ? (
        <PageLoading label="Loading class logs…" />
      ) : visibleLogs.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title={
            logs.length === 0 ? "No class logs in this view" : "No logs match your filters"
          }
          description={
            logs.length === 0
              ? "Logs appear when teachers submit session reports from their schedule."
              : "Try clearing search, teacher, program, or date filters."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-6">
          <div className="flex min-w-0 flex-col gap-4">
            <AdminClassLogsTable
              logs={pagination.paginatedItems}
              busy={busy}
              onView={setSelectedLog}
              onApprove={handleApprove}
              onReject={handleReject}
            />
            <Pagination pagination={pagination} itemLabel="logs" />
          </div>
          <AdminClassLogsSidebar
            logs={logs}
            isFetching={isFetching}
            onRefresh={() => void refetch()}
          />
        </div>
      )}

      <AdminClassLogsDetailModal
        log={selectedLog}
        busy={busy}
        onClose={() => setSelectedLog(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </PageContainer>
  );
}
