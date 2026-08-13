import { useMemo, useState } from "react";
import { CalendarCheck, Download } from "lucide-react";
import type { TrialBookingStatus, TrialBookingView } from "@/types/models";
import {
  useAdminTrialBookings,
  useAdminTeacherProfiles,
  useAdminUsers,
  useDeleteTrialBooking,
  useSendTrialInvitation,
  useConvertTrialToAdmission,
  useUpdateTrialBooking,
  useUpdateTrialBookingStatus,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminTrialLeadsStatsGrid } from "@/features/admin/components/trial-leads/AdminTrialLeadsStatsGrid";
import { AdminTrialLeadsNewAlert } from "@/features/admin/components/trial-leads/AdminTrialLeadsNewAlert";
import {
  AdminTrialLeadsTable,
  AdminTrialLeadsToolbar,
} from "@/features/admin/components/trial-leads/AdminTrialLeadsTable";
import type { IConvertTrialResult } from "@/features/admin/components/trial-leads/TrialLeadConvertPanel";
import { AdminTrialLeadsSidebar } from "@/features/admin/components/trial-leads/AdminTrialLeadsSidebar";
import { AdminTrialLeadDetailModal } from "@/features/admin/components/trial-leads/AdminTrialLeadDetailModal";
import {
  computeTrialLeadsStats,
  exportTrialLeadsFile,
  extractCourseOptions,
  extractSourceOptions,
  filterTrialLeads,
  type AdminTrialLeadsTab,
  type ITrialLeadSchedulingPayload,
  type ITrialLeadUpdatePayload,
} from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { buildTeacherAssignmentOptions } from "@/lib/teacherAssignmentOptions";
import { isSuperAdmin } from "@/lib/assignableRoles";
import { useAuthStore } from "@/stores/authStore";

export function AdminTrialBookingsPage() {
  const { t } = usePortalTranslation();
  const actorRole = useAuthStore((s) => s.user?.role);
  const canDelete = isSuperAdmin(actorRole ?? "admin");
  const [tab, setTab] = useState<AdminTrialLeadsTab>("all");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedLead, setSelectedLead] = useState<TrialBookingView | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [convertResult, setConvertResult] = useState<IConvertTrialResult | null>(null);

  const { data: bookings = [], isLoading, isError, isFetching, refetch } =
    useAdminTrialBookings();
  const { data: teacherProfiles = [] } = useAdminTeacherProfiles();
  const { data: portalTeachers = [] } = useAdminUsers("teacher");
  const teachers = useMemo(
    () => buildTeacherAssignmentOptions(teacherProfiles, portalTeachers),
    [teacherProfiles, portalTeachers]
  );
  const updateStatus = useUpdateTrialBookingStatus();
  const updateLead = useUpdateTrialBooking();
  const deleteLead = useDeleteTrialBooking();
  const sendInvitation = useSendTrialInvitation();
  const convertTrial = useConvertTrialToAdmission();

  const stats = useMemo(() => computeTrialLeadsStats(bookings), [bookings]);
  const courseOptions = useMemo(() => extractCourseOptions(bookings), [bookings]);
  const sourceOptions = useMemo(() => extractSourceOptions(bookings, t), [bookings, t]);

  const tabCounts = useMemo(
    () => ({
      all: bookings.length,
      new: stats.new,
      contacted: stats.contacted,
      scheduled: stats.scheduled,
      closed: stats.closed,
    }),
    [bookings.length, stats]
  );

  const visibleLeads = useMemo(
    () =>
      filterTrialLeads(bookings, {
        tab,
        search,
        courseFilter,
        sourceFilter,
        dateFrom,
        dateTo,
        t,
      }),
    [bookings, tab, search, courseFilter, sourceFilter, dateFrom, dateTo, t]
  );

  const pagination = usePaginatedList(visibleLeads, {
    pageSize: 10,
    resetDeps: [tab, search, courseFilter, sourceFilter, dateFrom, dateTo],
  });

  const busy =
    updateStatus.isPending ||
    updateLead.isPending ||
    deleteLead.isPending ||
    sendInvitation.isPending ||
    convertTrial.isPending;

  function openLead(lead: TrialBookingView, mode: "view" | "edit" = "view") {
    setSelectedLead(lead);
    setModalMode(mode);
    setConvertResult(null);
  }

  function closeLeadModal() {
    setSelectedLead(null);
    setModalMode("view");
    setConvertResult(null);
  }

  function handleAdvanceStatus(lead: TrialBookingView, status: TrialBookingStatus) {
    updateStatus.mutate(
      { id: lead._id, status },
      {
        onSuccess: () => {
          setSelectedLead((current) =>
            current?._id === lead._id ? { ...current, status } : current
          );
        },
      }
    );
  }

  function handleSaveLead(lead: TrialBookingView, payload: ITrialLeadUpdatePayload) {
    updateLead.mutate(
      { id: lead._id, payload },
      {
        onSuccess: (response) => {
          const updated = response.data;
          if (updated) {
            setSelectedLead(updated);
            setModalMode("view");
          }
        },
      }
    );
  }

  function handleSaveScheduling(
    lead: TrialBookingView,
    payload: ITrialLeadSchedulingPayload
  ) {
    updateLead.mutate(
      {
        id: lead._id,
        payload: {
          teacherSlug: payload.teacherSlug,
          meetingPlatform: payload.meetingPlatform,
          meetingLink: payload.meetingLink,
        },
      },
      {
        onSuccess: (response) => {
          const updated = response.data;
          if (updated) setSelectedLead(updated);
        },
      }
    );
  }

  function handleSendInvitation(
    lead: TrialBookingView,
    payload: ITrialLeadSchedulingPayload
  ) {
    sendInvitation.mutate(
      { id: lead._id, payload },
      {
        onSuccess: (response) => {
          const updated = response.data?.booking;
          if (updated) setSelectedLead(updated);
        },
      }
    );
  }

  function handleConvertLead(
    lead: TrialBookingView,
    payload: { email: string }
  ) {
    convertTrial.mutate(
      { id: lead._id, payload },
      {
        onSuccess: (response) => {
          const data = response.data;
          if (data?.booking) setSelectedLead(data.booking);
          if (data) {
            setConvertResult({
              prefillUrl: data.prefillUrl,
              portalAdmissionPath: data.portalAdmissionPath,
              admission: data.admission,
            });
          }
        },
      }
    );
  }

  function handleDeleteLead(lead: TrialBookingView) {
    deleteLead.mutate(lead._id, {
      onSuccess: () => closeLeadModal(),
    });
  }

  function handleExport() {
    exportTrialLeadsFile(visibleLeads, "trial-leads-filtered", t);
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            {t("admin.trialLeads.title")}
          </h1>
          <p className="portal-page-subtitle mt-1 max-w-3xl text-portal-muted">
            {t("admin.trialLeads.subtitle")}
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

      <AdminTrialLeadsStatsGrid stats={stats} isLoading={isLoading} />

      <AdminTrialLeadsNewAlert newCount={stats.new} onReview={() => setTab("new")} />

      <AdminTrialLeadsToolbar
        search={search}
        courseFilter={courseFilter}
        sourceFilter={sourceFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        tab={tab}
        tabCounts={tabCounts}
        courses={courseOptions}
        sources={sourceOptions}
        onSearchChange={setSearch}
        onCourseChange={setCourseFilter}
        onSourceChange={setSourceFilter}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onTabChange={setTab}
        onExport={handleExport}
      />

      {isError ? (
        <EmptyState
          icon={CalendarCheck}
          title={t("admin.trialLeads.loadError")}
          description={t("admin.trialLeads.loadErrorDesc")}
          actionLabel={t("admin.common.retry")}
          onAction={() => void refetch()}
        />
      ) : isLoading ? (
        <PageLoading label={t("admin.common.loadingTrialLeads")} />
      ) : visibleLeads.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title={
            bookings.length === 0
              ? t("admin.trialLeads.noLeads")
              : t("admin.trialLeads.noMatch")
          }
          description={
            bookings.length === 0
              ? t("admin.trialLeads.noLeadsDesc")
              : t("admin.trialLeads.noMatchDesc")
          }
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col gap-4">
            <AdminTrialLeadsTable
              leads={pagination.paginatedItems}
              busy={busy}
              canDelete={canDelete}
              onView={(lead) => openLead(lead, "view")}
              onEdit={(lead) => openLead(lead, "edit")}
              onDelete={handleDeleteLead}
              onAdvanceStatus={handleAdvanceStatus}
            />
            <Pagination pagination={pagination} itemLabel={t("admin.common.leadsItemLabel")} />
          </div>
          <AdminTrialLeadsSidebar
            leads={bookings}
            filteredLeads={visibleLeads}
            isFetching={isFetching}
            onRefresh={() => void refetch()}
            onReviewNew={() => setTab("new")}
          />
        </div>
      )}

      <AdminTrialLeadDetailModal
        lead={selectedLead}
        courseOptions={courseOptions}
        teachers={teachers}
        busy={busy}
        initialMode={modalMode}
        onClose={closeLeadModal}
        onUpdateStatus={handleAdvanceStatus}
        onSave={handleSaveLead}
        onSaveScheduling={handleSaveScheduling}
        onSendInvitation={handleSendInvitation}
        onConvert={handleConvertLead}
        convertResult={convertResult}
        canDelete={canDelete}
        onDelete={handleDeleteLead}
      />
    </PageContainer>
  );
}
