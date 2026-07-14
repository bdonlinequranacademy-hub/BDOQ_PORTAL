import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Library } from "lucide-react";
import {
  useAdminResources,
  useDeleteResource,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminResourcesOverviewHeader } from "@/features/admin/components/resources/AdminResourcesOverviewHeader";
import { AdminResourcesStatsGrid } from "@/features/admin/components/resources/AdminResourcesStatsGrid";
import { AdminResourcesToolbar } from "@/features/admin/components/resources/AdminResourcesToolbar";
import { AdminResourcesTable } from "@/features/admin/components/resources/AdminResourcesTable";
import { AdminResourcesCategoriesCard } from "@/features/admin/components/resources/AdminResourcesCategoriesCard";
import { AdminResourcesQuickActions } from "@/features/admin/components/resources/AdminResourcesQuickActions";
import {
  AdminResourcesAssetsCard,
  AdminResourcesTipBanner,
} from "@/features/admin/components/resources/AdminResourcesAssetsCard";
import {
  buildCategoryRows,
  computeResourcesStats,
  filterResources,
  getTabCounts,
  type ResourcesSort,
  type ResourcesTab,
} from "@/features/admin/components/resources/adminResourcesUtils";
import type {
  AdminResource,
  EbookCategory,
  ResourceStatus,
  ResourceType,
} from "@/types/models";

export function AdminResourcesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<ResourcesTab>("all");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<ResourceType | "">("");
  const [status, setStatus] = useState<ResourceStatus | "">("");
  const [category, setCategory] = useState<EbookCategory | "">("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<ResourcesSort>("newest");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | undefined>();

  const { data: items = [], isLoading, isFetching, refetch } = useAdminResources();
  const deleteResource = useDeleteResource();

  const stats = useMemo(() => computeResourcesStats(items), [items]);
  const tabCounts = useMemo(() => getTabCounts(items), [items]);
  const categoryRows = useMemo(() => buildCategoryRows(items), [items]);

  const visible = useMemo(
    () =>
      filterResources(items, {
        tab,
        search,
        type,
        status,
        category,
        featuredOnly,
        sortBy,
      }),
    [items, tab, search, type, status, category, featuredOnly, sortBy]
  );

  const pagination = usePaginatedList(visible, {
    pageSize: 10,
    resetDeps: [tab, search, type, status, category, featuredOnly, sortBy],
  });

  function handleAdd() {
    const preferred =
      tab === "ebook" || tab === "audio" || tab === "video" ? tab : type || "ebook";
    navigate(`/admin/resources/new?type=${preferred}`);
  }

  function handleDelete(item: AdminResource) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    deleteResource.mutate(item.id);
  }

  return (
    <PageContainer>
      <AdminResourcesOverviewHeader onAdd={handleAdd} />

      <AdminResourcesToolbar
        tab={tab}
        tabCounts={tabCounts}
        search={search}
        type={type}
        status={status}
        category={category}
        sortBy={sortBy}
        showAdvancedFilters={showAdvancedFilters}
        onTabChange={(next) => {
          setTab(next);
          setActiveCategoryKey(undefined);
          setFeaturedOnly(false);
          if (next === "ebook" || next === "audio" || next === "video") {
            setType("");
          }
        }}
        onSearchChange={setSearch}
        onTypeChange={setType}
        onStatusChange={setStatus}
        onCategoryChange={setCategory}
        onSortChange={setSortBy}
        onToggleAdvancedFilters={() =>
          setShowAdvancedFilters((value) => !value)
        }
      />

      <AdminResourcesStatsGrid
        stats={stats}
        isLoading={isLoading}
        onEbookClick={() => setTab("ebook")}
        onAudioClick={() => setTab("audio")}
        onVideoClick={() => setTab("video")}
        onPublishedClick={() => setTab("published")}
      />

      {isLoading ? (
        <PageLoading label="Loading resources…" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Library}
          title="No resources yet"
          description="Add e-books, audio, or videos for the public resources pages."
          actionLabel="Add Resource"
          onAction={handleAdd}
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-w-0 flex-col gap-5">
            <AdminResourcesTable
              items={pagination.paginatedItems}
              totalCount={visible.length}
              onEdit={(item) => navigate(`/admin/resources/${item.id}/edit`)}
              onDelete={handleDelete}
            />
            <Pagination pagination={pagination} itemLabel="resources" />
          </div>

          <aside className="flex flex-col gap-5 xl:sticky xl:top-24 xl:self-start">
            <AdminResourcesCategoriesCard
              rows={categoryRows}
              activeKey={activeCategoryKey}
              onSelect={(row) => {
                setActiveCategoryKey(row.key);
                if (row.filter.kind === "type") {
                  setTab(row.filter.value);
                  setType("");
                  setCategory("");
                  setFeaturedOnly(false);
                } else if (row.filter.kind === "category") {
                  setTab("ebook");
                  setCategory(row.filter.value);
                  setType("");
                  setFeaturedOnly(false);
                } else {
                  setTab("featured");
                  setFeaturedOnly(true);
                  setCategory("");
                  setType("");
                }
              }}
            />
            <AdminResourcesQuickActions onAdd={handleAdd} />
            <AdminResourcesAssetsCard stats={stats} />
            <AdminResourcesTipBanner draftCount={stats.draft} />
            {isFetching ? (
              <p className="text-center text-xs text-portal-muted">
                Refreshing resources…
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
