import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquareQuote } from "lucide-react";
import type { TestimonialMediaType } from "@/types/models";
import {
  useAdminTestimonials,
  useDeleteTestimonial,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminTestimonialsOverviewHeader } from "@/features/admin/components/testimonials/AdminTestimonialsOverviewHeader";
import { AdminTestimonialsStatsGrid } from "@/features/admin/components/testimonials/AdminTestimonialsStatsGrid";
import { AdminTestimonialsRatingDistribution } from "@/features/admin/components/testimonials/AdminTestimonialsRatingDistribution";
import { AdminTestimonialsToolbar } from "@/features/admin/components/testimonials/AdminTestimonialsToolbar";
import { AdminTestimonialsTable } from "@/features/admin/components/testimonials/AdminTestimonialsTable";
import { AdminTestimonialsMediaTypesCard } from "@/features/admin/components/testimonials/AdminTestimonialsMediaTypesCard";
import { AdminTestimonialsTopRated } from "@/features/admin/components/testimonials/AdminTestimonialsTopRated";
import { AdminTestimonialsQuickActions } from "@/features/admin/components/testimonials/AdminTestimonialsQuickActions";
import { AdminTestimonialsTipBanner } from "@/features/admin/components/testimonials/AdminTestimonialsTipBanner";
import { AdminSectionHeaderPanel } from "@/features/admin/components/sectionHeaders/AdminSectionHeaderPanel";
import {
  buildRatingDistribution,
  computeTestimonialsStats,
  exportTestimonialsFile,
  filterTestimonials,
  getTabCounts,
  getTopRatedReviews,
  groupByMediaType,
  type AdminTestimonialsTab,
  type TestimonialsSort,
} from "@/features/admin/components/testimonials/adminTestimonialsUtils";

export function AdminTestimonialsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminTestimonialsTab>("all");
  const [search, setSearch] = useState("");
  const [mediaType, setMediaType] = useState<TestimonialMediaType | "">("");
  const [ratingFilter, setRatingFilter] = useState<number | "">("");
  const [statusFilter, setStatusFilter] = useState<"published" | "pending" | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState<TestimonialsSort>("newest");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const { data: testimonials = [], isLoading, isFetching, refetch } =
    useAdminTestimonials();
  const deleteReview = useDeleteTestimonial();

  const stats = useMemo(
    () => computeTestimonialsStats(testimonials),
    [testimonials]
  );
  const tabCounts = useMemo(() => getTabCounts(testimonials), [testimonials]);
  const ratingRows = useMemo(
    () => buildRatingDistribution(testimonials),
    [testimonials]
  );
  const mediaRows = useMemo(() => groupByMediaType(testimonials), [testimonials]);
  const topRated = useMemo(
    () => getTopRatedReviews(testimonials),
    [testimonials]
  );

  const visible = useMemo(
    () =>
      filterTestimonials(testimonials, {
        tab,
        search,
        mediaType,
        ratingFilter,
        statusFilter,
        dateFrom,
        dateTo,
        sortBy,
      }),
    [
      testimonials,
      tab,
      search,
      mediaType,
      ratingFilter,
      statusFilter,
      dateFrom,
      dateTo,
      sortBy,
    ]
  );

  const pagination = usePaginatedList(visible, {
    pageSize: 10,
    resetDeps: [
      tab,
      search,
      mediaType,
      ratingFilter,
      statusFilter,
      dateFrom,
      dateTo,
      sortBy,
    ],
  });

  function handleExport() {
    exportTestimonialsFile(visible);
  }

  function handleDelete(item: { id: string; name: string }) {
    if (!window.confirm(`Delete review from ${item.name}?`)) return;
    deleteReview.mutate(item.id);
  }

  return (
    <PageContainer>
      <AdminSectionHeaderPanel sectionKey="home.testimonials" defaultOpen />
      <AdminSectionHeaderPanel sectionKey="pages.reviews" />
      <AdminTestimonialsOverviewHeader onExport={handleExport} />

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.7fr)] xl:gap-5">
        <AdminTestimonialsStatsGrid
          stats={stats}
          isLoading={isLoading}
          onPublishedClick={() => setTab("published")}
          onPendingClick={() => setTab("pending")}
          onFeaturedClick={() => setTab("featured")}
        />
        <AdminTestimonialsRatingDistribution
          rows={ratingRows}
          total={testimonials.length}
        />
      </div>

      {isLoading ? (
        <PageLoading label="Loading reviews…" />
      ) : testimonials.length === 0 ? (
        <EmptyState
          icon={MessageSquareQuote}
          title="No reviews yet"
          description="Add student testimonials to populate the homepage review section."
          actionLabel="New review"
          onAction={() => navigate("/admin/testimonials/new")}
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-w-0 flex-col gap-5">
            <AdminTestimonialsToolbar
              tab={tab}
              tabCounts={tabCounts}
              search={search}
              mediaType={mediaType}
              ratingFilter={ratingFilter}
              statusFilter={statusFilter}
              dateFrom={dateFrom}
              dateTo={dateTo}
              sortBy={sortBy}
              showAdvancedFilters={showAdvancedFilters}
              onTabChange={setTab}
              onSearchChange={setSearch}
              onMediaTypeChange={setMediaType}
              onRatingFilterChange={setRatingFilter}
              onStatusFilterChange={setStatusFilter}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
              onSortChange={setSortBy}
              onToggleAdvancedFilters={() =>
                setShowAdvancedFilters((value) => !value)
              }
            />

            <AdminTestimonialsTable
              items={pagination.paginatedItems}
              totalCount={visible.length}
              onView={(item) => navigate(`/admin/testimonials/${item.id}/edit`)}
              onEdit={(item) => navigate(`/admin/testimonials/${item.id}/edit`)}
              onDelete={handleDelete}
            />

            <Pagination pagination={pagination} itemLabel="reviews" />
            <AdminTestimonialsTipBanner pendingCount={stats.pending} />
          </div>

          <aside className="flex flex-col gap-5">
            <AdminTestimonialsMediaTypesCard
              rows={mediaRows}
              activeType={mediaType}
              onTypeSelect={setMediaType}
            />
            <AdminTestimonialsTopRated
              items={topRated}
              onSelect={(item) => navigate(`/admin/testimonials/${item.id}/edit`)}
            />
            <AdminTestimonialsQuickActions onExport={handleExport} />
            {isFetching ? (
              <p className="text-center text-xs text-portal-muted">
                Refreshing reviews…
              </p>
            ) : (
              <button
                type="button"
                onClick={() => void refetch()}
                className="text-center text-xs font-semibold text-primary hover:underline"
              >
                Refresh data
              </button>
            )}
          </aside>
        </div>
      )}
    </PageContainer>
  );
}
