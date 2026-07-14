import { useMemo, useState } from "react";
import { Download, UserPlus } from "lucide-react";
import type { StudentRequestView } from "@/types/models";
import {
  useAdminStudentRequests,
  useApproveStudentRequest,
  useRejectStudentRequest,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminStudentRequestsHowItWorks } from "@/features/admin/components/student-requests/AdminStudentRequestsHowItWorks";
import { AdminStudentRequestsStatsGrid } from "@/features/admin/components/student-requests/AdminStudentRequestsStatsGrid";
import { AdminStudentRequestsPendingAlert } from "@/features/admin/components/student-requests/AdminStudentRequestsPendingAlert";
import { AdminStudentRequestsToolbar } from "@/features/admin/components/student-requests/AdminStudentRequestsToolbar";
import { AdminStudentRequestsList } from "@/features/admin/components/student-requests/AdminStudentRequestsList";
import { AdminStudentRequestsSidebar } from "@/features/admin/components/student-requests/AdminStudentRequestsSidebar";
import {
  computeStudentRequestsStats,
  exportStudentRequestsFile,
  extractCourseOptions,
  extractTeacherOptions,
  filterStudentRequests,
  type AdminStudentRequestsTab,
  type StudentRequestSort,
} from "@/features/admin/components/student-requests/adminStudentRequestsUtils";

export function AdminStudentRequestsPage() {
  const [tab, setTab] = useState<AdminStudentRequestsTab>("all");
  const [search, setSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState<StudentRequestSort>("newest");

  const { data: requests = [], isLoading, isError, isFetching, refetch } =
    useAdminStudentRequests();
  const approve = useApproveStudentRequest();
  const reject = useRejectStudentRequest();

  const stats = useMemo(() => computeStudentRequestsStats(requests), [requests]);
  const teacherOptions = useMemo(() => extractTeacherOptions(requests), [requests]);
  const courseOptions = useMemo(() => extractCourseOptions(requests), [requests]);

  const tabCounts = useMemo(
    () => ({
      all: requests.length,
      pending: stats.pending,
      approved: stats.approved,
      rejected: stats.rejected,
    }),
    [requests.length, stats]
  );

  const visibleRequests = useMemo(
    () =>
      filterStudentRequests(requests, {
        tab,
        search,
        teacherFilter,
        courseFilter,
        dateFrom,
        dateTo,
        sortBy,
      }),
    [requests, tab, search, teacherFilter, courseFilter, dateFrom, dateTo, sortBy]
  );

  const pagination = usePaginatedList(visibleRequests, {
    pageSize: 10,
    resetDeps: [tab, search, teacherFilter, courseFilter, dateFrom, dateTo, sortBy],
  });

  const busy = approve.isPending || reject.isPending;

  function handleApprove(request: StudentRequestView, adminNote?: string) {
    approve.mutate({ id: request._id, adminNote });
  }

  function handleReject(request: StudentRequestView, adminNote?: string) {
    reject.mutate({ id: request._id, adminNote });
  }

  function handleExport() {
    exportStudentRequestsFile(visibleRequests, "student-requests-filtered");
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            Student Requests
          </h1>
          <p className="portal-page-subtitle mt-1 max-w-3xl text-portal-muted">
            Teachers asking for new student assignments.
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

      <AdminStudentRequestsHowItWorks />

      <AdminStudentRequestsStatsGrid stats={stats} isLoading={isLoading} />

      <AdminStudentRequestsPendingAlert
        pendingCount={stats.pending}
        onReview={() => setTab("pending")}
      />

      <AdminStudentRequestsToolbar
        search={search}
        teacherFilter={teacherFilter}
        courseFilter={courseFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        sortBy={sortBy}
        tab={tab}
        tabCounts={tabCounts}
        teachers={teacherOptions}
        courses={courseOptions}
        onSearchChange={setSearch}
        onTeacherChange={setTeacherFilter}
        onCourseChange={setCourseFilter}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onSortChange={setSortBy}
        onTabChange={setTab}
        onExport={handleExport}
      />

      {isError ? (
        <EmptyState
          icon={UserPlus}
          title="Could not load student requests"
          description="The server failed to return teacher requests. Try again in a moment."
          actionLabel="Retry"
          onAction={() => void refetch()}
        />
      ) : isLoading ? (
        <PageLoading label="Loading student requests…" />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No student requests yet"
          description="Requests appear when teachers ask for new student assignments from their portal."
        />
      ) : visibleRequests.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No requests match your filters"
          description="Try clearing search, teacher, course, or date filters."
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col gap-4">
            <AdminStudentRequestsList
              requests={pagination.paginatedItems}
              totalCount={visibleRequests.length}
              busy={busy}
              onApprove={handleApprove}
              onReject={handleReject}
            />
            <Pagination pagination={pagination} itemLabel="requests" />
          </div>
          <AdminStudentRequestsSidebar
            requests={requests}
            filteredRequests={visibleRequests}
            isFetching={isFetching}
            onRefresh={() => void refetch()}
            onReviewPending={() => setTab("pending")}
            pendingCount={stats.pending}
          />
        </div>
      )}
    </PageContainer>
  );
}
