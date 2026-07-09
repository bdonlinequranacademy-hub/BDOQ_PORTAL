import { useMemo, useState } from "react";
import { CalendarCheck, Download } from "lucide-react";
import type { TrialBookingStatus, TrialBookingView } from "@/types/models";
import {
  useAdminTrialBookings,
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
import { AdminTrialLeadsSidebar } from "@/features/admin/components/trial-leads/AdminTrialLeadsSidebar";
import {
  computeTrialLeadsStats,
  exportTrialLeadsFile,
  extractCourseOptions,
  extractSourceOptions,
  filterTrialLeads,
  type AdminTrialLeadsTab,
} from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";

export function AdminTrialBookingsPage() {
  const [tab, setTab] = useState<AdminTrialLeadsTab>("all");
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: bookings = [], isLoading, isError, isFetching, refetch } =
    useAdminTrialBookings();
  const updateStatus = useUpdateTrialBookingStatus();

  const stats = useMemo(() => computeTrialLeadsStats(bookings), [bookings]);
  const courseOptions = useMemo(() => extractCourseOptions(bookings), [bookings]);
  const sourceOptions = useMemo(() => extractSourceOptions(bookings), [bookings]);

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
      }),
    [bookings, tab, search, courseFilter, sourceFilter, dateFrom, dateTo]
  );

  const pagination = usePaginatedList(visibleLeads, {
    pageSize: 10,
    resetDeps: [tab, search, courseFilter, sourceFilter, dateFrom, dateTo],
  });

  const busy = updateStatus.isPending;

  function handleAdvanceStatus(lead: TrialBookingView, status: TrialBookingStatus) {
    updateStatus.mutate({ id: lead._id, status });
  }

  function handleExport() {
    exportTrialLeadsFile(visibleLeads, "trial-leads-filtered");
  }

  return (
    <PageContainer className="gap-5 lg:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            Free Class Leads
          </h1>
          <p className="portal-page-subtitle mt-1 max-w-3xl text-portal-muted">
            Manage trial class requests from the public website and follow up via WhatsApp or
            phone.
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
          title="Could not load trial leads"
          description="The server failed to return trial bookings. Try again in a moment."
          actionLabel="Retry"
          onAction={() => void refetch()}
        />
      ) : isLoading ? (
        <PageLoading label="Loading trial leads…" />
      ) : visibleLeads.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          title={bookings.length === 0 ? "No trial leads yet" : "No leads match your filters"}
          description={
            bookings.length === 0
              ? "Leads appear here when visitors submit the free trial form on your website."
              : "Try clearing search, course, source, or date filters."
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-6">
          <div className="flex min-w-0 flex-col gap-4">
            <AdminTrialLeadsTable
              leads={pagination.paginatedItems}
              busy={busy}
              onAdvanceStatus={handleAdvanceStatus}
            />
            <Pagination pagination={pagination} itemLabel="leads" />
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
    </PageContainer>
  );
}
