import { useMemo, useState } from "react";
import { Download, GraduationCap } from "lucide-react";
import type { StudentAdmissionStatus, StudentAdmissionView } from "@/types/models";
import {
  useAdminStudentAdmissions,
  useUpdateStudentAdmissionStatus,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminStudentAdmissionsStatsGrid } from "@/features/admin/components/student-admissions/AdminStudentAdmissionsStatsGrid";
import { AdminStudentAdmissionsNewAlert } from "@/features/admin/components/student-admissions/AdminStudentAdmissionsNewAlert";
import {
  AdminStudentAdmissionsTable,
  AdminStudentAdmissionsToolbar,
} from "@/features/admin/components/student-admissions/AdminStudentAdmissionsTable";
import { AdminStudentAdmissionsSidebar } from "@/features/admin/components/student-admissions/AdminStudentAdmissionsSidebar";
import { AdminStudentAdmissionDetailModal } from "@/features/admin/components/student-admissions/AdminStudentAdmissionDetailModal";
import {
  computeStudentAdmissionsStats,
  exportStudentAdmissionsFile,
  extractCountryOptions,
  extractProgramOptions,
  extractSourceOptions,
  filterStudentAdmissions,
  type AdminStudentAdmissionsTab,
} from "@/features/admin/components/student-admissions/adminStudentAdmissionsUtils";

export function AdminStudentAdmissionsPage() {
  const [tab, setTab] = useState<AdminStudentAdmissionsTab>("all");
  const [search, setSearch] = useState("");
  const [programFilter, setProgramFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedApp, setSelectedApp] = useState<StudentAdmissionView | null>(null);

  const { data: applications = [], isLoading, isError, isFetching, refetch } =
    useAdminStudentAdmissions();
  const updateStatus = useUpdateStudentAdmissionStatus();

  const stats = useMemo(() => computeStudentAdmissionsStats(applications), [applications]);
  const programOptions = useMemo(() => extractProgramOptions(applications), [applications]);
  const countryOptions = useMemo(() => extractCountryOptions(applications), [applications]);
  const sourceOptions = useMemo(() => extractSourceOptions(applications), [applications]);

  const tabCounts = useMemo(
    () => ({
      all: applications.length,
      new: stats.new,
      reviewing: stats.reviewing,
      approved: stats.approved,
      closed: stats.closed,
    }),
    [applications.length, stats]
  );

  const visibleApplications = useMemo(
    () =>
      filterStudentAdmissions(applications, {
        tab,
        search,
        programFilter,
        countryFilter,
        sourceFilter,
        dateFrom,
        dateTo,
      }),
    [applications, tab, search, programFilter, countryFilter, sourceFilter, dateFrom, dateTo]
  );

  const pagination = usePaginatedList(visibleApplications, {
    pageSize: 10,
    resetDeps: [tab, search, programFilter, countryFilter, sourceFilter, dateFrom, dateTo],
  });

  const busy = updateStatus.isPending;

  function handleUpdateStatus(app: StudentAdmissionView, status: StudentAdmissionStatus) {
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
    exportStudentAdmissionsFile(visibleApplications, "student-admissions-filtered");
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            Student Admission Leads
          </h1>
          <p className="portal-page-subtitle mt-1 max-w-3xl text-portal-muted">
            Applications from the public website — review and create portal accounts when
            approved.
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

      <AdminStudentAdmissionsStatsGrid stats={stats} isLoading={isLoading} />

      <AdminStudentAdmissionsNewAlert newCount={stats.new} onReview={() => setTab("new")} />

      <AdminStudentAdmissionsToolbar
        search={search}
        programFilter={programFilter}
        countryFilter={countryFilter}
        sourceFilter={sourceFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        tab={tab}
        tabCounts={tabCounts}
        programs={programOptions}
        countries={countryOptions}
        sources={sourceOptions}
        onSearchChange={setSearch}
        onProgramChange={setProgramFilter}
        onCountryChange={setCountryFilter}
        onSourceChange={setSourceFilter}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onTabChange={setTab}
        onExport={handleExport}
      />

      {isError ? (
        <EmptyState
          icon={GraduationCap}
          title="Could not load admission applications"
          description="The server failed to return student admissions. Try again in a moment."
          actionLabel="Retry"
          onAction={() => void refetch()}
        />
      ) : isLoading ? (
        <PageLoading label="Loading admission applications…" />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No admission applications yet"
          description="Applications appear here when visitors submit the student admission form on your website."
        />
      ) : visibleApplications.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No applications match your filters"
          description="Try clearing search, program, country, source, or date filters."
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col gap-4">
            <AdminStudentAdmissionsTable
              applications={pagination.paginatedItems}
              busy={busy}
              onView={setSelectedApp}
              onAdvanceStatus={handleUpdateStatus}
            />
            <Pagination pagination={pagination} itemLabel="applications" />
          </div>
          <AdminStudentAdmissionsSidebar
            applications={applications}
            filteredApplications={visibleApplications}
            stats={stats}
            isFetching={isFetching}
            onRefresh={() => void refetch()}
            onReviewNew={() => setTab("new")}
          />
        </div>
      )}

      <AdminStudentAdmissionDetailModal
        application={selectedApp}
        busy={busy}
        onClose={() => setSelectedApp(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </PageContainer>
  );
}
