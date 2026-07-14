import { useMemo, useState } from "react";
import { Briefcase, Download } from "lucide-react";
import type { TeacherApplicationStatus, TeacherApplicationView } from "@/types/models";
import {
  useAdminTeacherApplications,
  useUpdateTeacherApplicationStatus,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminTeacherApplicationsStatsGrid } from "@/features/admin/components/teacher-applications/AdminTeacherApplicationsStatsGrid";
import { AdminTeacherApplicationsNewAlert } from "@/features/admin/components/teacher-applications/AdminTeacherApplicationsNewAlert";
import {
  AdminTeacherApplicationsTable,
  AdminTeacherApplicationsToolbar,
} from "@/features/admin/components/teacher-applications/AdminTeacherApplicationsTable";
import { AdminTeacherApplicationsSidebar } from "@/features/admin/components/teacher-applications/AdminTeacherApplicationsSidebar";
import { AdminTeacherApplicationDetailModal } from "@/features/admin/components/teacher-applications/AdminTeacherApplicationDetailModal";
import {
  computeTeacherApplicationsStats,
  exportTeacherApplicationsFile,
  extractSubjectOptions,
  extractTeacherCountryOptions,
  filterTeacherApplications,
  type AdminTeacherApplicationsTab,
} from "@/features/admin/components/teacher-applications/adminTeacherApplicationsUtils";

export function AdminTeacherApplicationsPage() {
  const [tab, setTab] = useState<AdminTeacherApplicationsTab>("all");
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedApp, setSelectedApp] = useState<TeacherApplicationView | null>(null);

  const { data: applications = [], isLoading, isError, isFetching, refetch } =
    useAdminTeacherApplications();
  const updateStatus = useUpdateTeacherApplicationStatus();

  const stats = useMemo(() => computeTeacherApplicationsStats(applications), [applications]);
  const subjectOptions = useMemo(() => extractSubjectOptions(applications), [applications]);
  const countryOptions = useMemo(
    () => extractTeacherCountryOptions(applications),
    [applications]
  );

  const tabCounts = useMemo(
    () => ({
      all: applications.length,
      new: stats.new,
      reviewing: stats.reviewing,
      approved: stats.approved,
      rejected: stats.rejected,
      closed: stats.closed,
    }),
    [applications.length, stats]
  );

  const visibleApplications = useMemo(
    () =>
      filterTeacherApplications(applications, {
        tab,
        search,
        subjectFilter,
        countryFilter,
        dateFrom,
        dateTo,
      }),
    [applications, tab, search, subjectFilter, countryFilter, dateFrom, dateTo]
  );

  const pagination = usePaginatedList(visibleApplications, {
    pageSize: 10,
    resetDeps: [tab, search, subjectFilter, countryFilter, dateFrom, dateTo],
  });

  const busy = updateStatus.isPending;

  function handleUpdateStatus(app: TeacherApplicationView, status: TeacherApplicationStatus) {
    updateStatus.mutate(
      { id: app._id, status },
      {
        onSuccess: () => {
          if (selectedApp?._id === app._id && status === "closed") {
            setSelectedApp(null);
          }
        },
      }
    );
  }

  function handleExport() {
    exportTeacherApplicationsFile(visibleApplications, "teacher-applications-filtered");
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            Teacher Applications
          </h1>
          <p className="portal-page-subtitle mt-1 max-w-3xl text-portal-muted">
            Teacher registration submissions from the public website with uploaded documents.
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={handleExport}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-portal px-4"
        >
          <Download className="size-4" aria-hidden />
          Export
        </Button>
      </div>

      <AdminTeacherApplicationsStatsGrid stats={stats} isLoading={isLoading} />

      <AdminTeacherApplicationsNewAlert newCount={stats.new} onReview={() => setTab("new")} />

      <AdminTeacherApplicationsToolbar
        search={search}
        subjectFilter={subjectFilter}
        countryFilter={countryFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        tab={tab}
        tabCounts={tabCounts}
        subjects={subjectOptions}
        countries={countryOptions}
        onSearchChange={setSearch}
        onSubjectChange={setSubjectFilter}
        onCountryChange={setCountryFilter}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onTabChange={setTab}
        onExport={handleExport}
      />

      {isError ? (
        <EmptyState
          icon={Briefcase}
          title="Could not load teacher applications"
          description="The server failed to return teacher applications. Try again in a moment."
          actionLabel="Retry"
          onAction={() => void refetch()}
        />
      ) : isLoading ? (
        <PageLoading label="Loading teacher applications…" />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No teacher applications yet"
          description="Applications appear here when candidates submit the teacher registration form."
        />
      ) : visibleApplications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications match your filters"
          description="Try clearing search, subject, country, or date filters."
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col gap-4">
            <AdminTeacherApplicationsTable
              applications={pagination.paginatedItems}
              busy={busy}
              onView={setSelectedApp}
              onAdvanceStatus={handleUpdateStatus}
            />
            <Pagination pagination={pagination} itemLabel="applications" />
          </div>
          <AdminTeacherApplicationsSidebar
            applications={applications}
            filteredApplications={visibleApplications}
            isFetching={isFetching}
            onRefresh={() => void refetch()}
            onReviewNew={() => setTab("new")}
            newCount={stats.new}
          />
        </div>
      )}

      <AdminTeacherApplicationDetailModal
        application={selectedApp}
        busy={busy}
        onClose={() => setSelectedApp(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </PageContainer>
  );
}
