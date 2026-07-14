import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Plus } from "lucide-react";
import {
  useAdminPricingPackages,
  useDeletePricingPackage,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { Button } from "@/components/ui/Button";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminPricingOverviewHeader } from "@/features/admin/components/pricing/AdminPricingOverviewHeader";
import { AdminPricingStatsGrid } from "@/features/admin/components/pricing/AdminPricingStatsGrid";
import { AdminPricingToolbar } from "@/features/admin/components/pricing/AdminPricingToolbar";
import { AdminPricingTable } from "@/features/admin/components/pricing/AdminPricingTable";
import { AdminPricingStatusOverview } from "@/features/admin/components/pricing/AdminPricingStatusOverview";
import { AdminPricingQuickActions } from "@/features/admin/components/pricing/AdminPricingQuickActions";
import { AdminPricingTipBanner } from "@/features/admin/components/pricing/AdminPricingTipBanner";
import {
  buildStatusOverview,
  computePricingStats,
  exportPricingFile,
  filterPricingPackages,
  uniquePeriods,
  type PricingSort,
  type PricingStatusFilter,
} from "@/features/admin/components/pricing/adminPricingUtils";
import type { AdminPricingPackage } from "@/types/models";

export function AdminPricingPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PricingStatusFilter>("all");
  const [period, setPeriod] = useState("");
  const [sortBy, setSortBy] = useState<PricingSort>("sort-order");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const { data: packages = [], isLoading, isFetching, refetch } =
    useAdminPricingPackages();
  const deletePackage = useDeletePricingPackage();

  const stats = useMemo(() => computePricingStats(packages), [packages]);
  const statusSlices = useMemo(() => buildStatusOverview(packages), [packages]);
  const periods = useMemo(() => uniquePeriods(packages), [packages]);

  const visible = useMemo(
    () =>
      filterPricingPackages(packages, {
        search,
        status,
        period,
        sortBy,
      }),
    [packages, search, status, period, sortBy]
  );

  const pagination = usePaginatedList(visible, {
    pageSize: 10,
    resetDeps: [search, status, period, sortBy],
  });

  function handleExport() {
    exportPricingFile(visible);
  }

  function handleDelete(item: AdminPricingPackage) {
    if (!window.confirm(`Delete package "${item.name}"?`)) return;
    deletePackage.mutate(item.id);
  }

  return (
    <PageContainer>
      <AdminPricingOverviewHeader />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <div className="min-w-0 flex-1">
          <AdminPricingStatsGrid
            stats={stats}
            isLoading={isLoading}
            onPublishedClick={() => setStatus("published")}
            onDraftClick={() => setStatus("draft")}
            onPopularClick={() => setStatus("popular")}
          />
        </div>
        <Button
          type="button"
          onClick={() => navigate("/admin/pricing/new")}
          className="hidden shrink-0 items-center justify-center gap-2 self-center rounded-xl bg-primary px-6 py-3 text-white hover:bg-primary-dark lg:inline-flex lg:min-h-[88px] lg:min-w-[160px]"
        >
          <Plus className="size-5" aria-hidden />
          New Package
        </Button>
      </div>

      {isLoading ? (
        <PageLoading label="Loading pricing packages…" />
      ) : packages.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No pricing packages yet"
          description="Add packages here to replace the default hardcoded pricing on the public website."
          actionLabel="New Package"
          onAction={() => navigate("/admin/pricing/new")}
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex min-w-0 flex-col gap-5">
            <AdminPricingToolbar
              search={search}
              status={status}
              period={period}
              periods={periods}
              sortBy={sortBy}
              showAdvancedFilters={showAdvancedFilters}
              onSearchChange={setSearch}
              onStatusChange={setStatus}
              onPeriodChange={setPeriod}
              onSortChange={setSortBy}
              onToggleAdvancedFilters={() =>
                setShowAdvancedFilters((value) => !value)
              }
              onNewPackage={() => navigate("/admin/pricing/new")}
            />

            <AdminPricingTable
              items={pagination.paginatedItems}
              totalCount={visible.length}
              onEdit={(item) => navigate(`/admin/pricing/${item.id}/edit`)}
              onDelete={handleDelete}
            />

            <Pagination pagination={pagination} itemLabel="packages" />
          </div>

          <aside className="flex flex-col gap-5 xl:sticky xl:top-24 xl:self-start">
            <AdminPricingStatusOverview
              slices={statusSlices}
              total={packages.length}
              onSelect={(key) => {
                if (key === "published") setStatus("published");
                else if (key === "draft") setStatus("draft");
                else setStatus("popular");
              }}
            />
            <AdminPricingQuickActions onExport={handleExport} />
            <AdminPricingTipBanner draftCount={stats.draft} />
            {isFetching ? (
              <p className="text-center text-xs text-portal-muted">
                Refreshing packages…
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
