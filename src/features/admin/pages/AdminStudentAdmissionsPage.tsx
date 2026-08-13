import { useMemo, useState } from "react";
import { Download, GraduationCap } from "lucide-react";
import type {
  StudentAdmissionPaymentStatus,
  StudentAdmissionStatus,
  StudentAdmissionView,
} from "@/types/models";
import {
  useAdminStudentAdmissions,
  useDeleteStudentAdmission,
  useUpdateStudentAdmissionStatus,
  useUpdateStudentAdmissionPaymentStatus,
  useUpdateStudentAdmissionEnrollment,
  useAdminTeacherProfiles,
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
  type IAdmissionEnrollmentPayload,
} from "@/features/admin/components/student-admissions/adminStudentAdmissionsUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { isSuperAdmin } from "@/lib/assignableRoles";
import { useAuthStore } from "@/stores/authStore";

export function AdminStudentAdmissionsPage() {
  const { t, dynamicLabel } = usePortalTranslation();
  const actorRole = useAuthStore((s) => s.user?.role);
  const canDelete = isSuperAdmin(actorRole ?? "admin");
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
  const { data: teachers = [] } = useAdminTeacherProfiles();
  const updateStatus = useUpdateStudentAdmissionStatus();
  const updatePaymentStatus = useUpdateStudentAdmissionPaymentStatus();
  const updateEnrollment = useUpdateStudentAdmissionEnrollment();
  const deleteApplication = useDeleteStudentAdmission();

  const stats = useMemo(() => computeStudentAdmissionsStats(applications), [applications]);
  const programOptions = useMemo(
    () => extractProgramOptions(applications, t, dynamicLabel),
    [applications, t, dynamicLabel]
  );
  const countryOptions = useMemo(() => extractCountryOptions(applications), [applications]);
  const sourceOptions = useMemo(
    () => extractSourceOptions(applications, t, dynamicLabel),
    [applications, t, dynamicLabel]
  );

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
        t,
        dynamicLabel,
      }),
    [
      applications,
      tab,
      search,
      programFilter,
      countryFilter,
      sourceFilter,
      dateFrom,
      dateTo,
      t,
      dynamicLabel,
    ]
  );

  const pagination = usePaginatedList(visibleApplications, {
    pageSize: 10,
    resetDeps: [tab, search, programFilter, countryFilter, sourceFilter, dateFrom, dateTo],
  });

  const busy =
    updateStatus.isPending ||
    updatePaymentStatus.isPending ||
    updateEnrollment.isPending ||
    deleteApplication.isPending;

  function syncSelectedApp(updated: StudentAdmissionView | undefined): void {
    if (updated && selectedApp?._id === updated._id) {
      setSelectedApp(updated);
    }
  }

  function handleUpdateStatus(app: StudentAdmissionView, status: StudentAdmissionStatus) {
    updateStatus.mutate(
      { id: app._id, status },
      {
        onSuccess: (response) => {
          syncSelectedApp(response.data ?? undefined);
          if (selectedApp?._id === app._id && status === "closed") {
            setSelectedApp(null);
          }
        },
      }
    );
  }

  function handleUpdatePaymentStatus(
    app: StudentAdmissionView,
    paymentStatus: StudentAdmissionPaymentStatus,
    rejectReason?: string
  ) {
    updatePaymentStatus.mutate(
      { id: app._id, paymentStatus, rejectReason },
      {
        onSuccess: (response) => syncSelectedApp(response.data ?? undefined),
      }
    );
  }

  function handleSaveEnrollment(
    app: StudentAdmissionView,
    payload: IAdmissionEnrollmentPayload
  ) {
    updateEnrollment.mutate(
      { id: app._id, payload },
      {
        onSuccess: (response) => syncSelectedApp(response.data ?? undefined),
      }
    );
  }

  function handleDelete(app: StudentAdmissionView) {
    deleteApplication.mutate(app._id, {
      onSuccess: () => {
        if (selectedApp?._id === app._id) setSelectedApp(null);
      },
    });
  }

  function handleExport() {
    exportStudentAdmissionsFile(visibleApplications, "student-admissions-filtered", t, dynamicLabel);
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            {t("admin.admissions.title")}
          </h1>
          <p className="portal-page-subtitle mt-1 max-w-3xl text-portal-muted">
            {t("admin.admissions.subtitle")}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={handleExport}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-portal px-4"
        >
          <Download className="size-4" aria-hidden />
          {t("admin.common.export")}
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
          title={t("admin.admissions.loadError")}
          description={t("admin.admissions.loadErrorDesc")}
          actionLabel={t("admin.common.retry")}
          onAction={() => void refetch()}
        />
      ) : isLoading ? (
        <PageLoading label={t("admin.common.loadingAdmissions")} />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={t("admin.admissions.noAdmissions")}
          description={t("admin.admissions.noAdmissionsDesc")}
        />
      ) : visibleApplications.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={t("admin.admissions.noMatch")}
          description={t("admin.admissions.noMatchDesc")}
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col gap-4">
            <AdminStudentAdmissionsTable
              applications={pagination.paginatedItems}
              busy={busy}
              canDelete={canDelete}
              onView={setSelectedApp}
              onDelete={handleDelete}
              onAdvanceStatus={handleUpdateStatus}
            />
            <Pagination pagination={pagination} itemLabel={t("admin.common.applicationsItemLabel")} />
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
        teachers={teachers}
        busy={busy}
        canDelete={canDelete}
        onClose={() => setSelectedApp(null)}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
        onSaveEnrollment={handleSaveEnrollment}
        onDelete={handleDelete}
      />
    </PageContainer>
  );
}
