import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Newspaper } from "lucide-react";
import type { BlogCategory, BlogPostStatus } from "@/types/models";
import {
  useAdminBlogPosts,
  useDeleteBlogPost,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminBlogOverviewHeader } from "@/features/admin/components/blog/AdminBlogOverviewHeader";
import { AdminBlogStatsGrid } from "@/features/admin/components/blog/AdminBlogStatsGrid";
import { AdminBlogToolbar } from "@/features/admin/components/blog/AdminBlogToolbar";
import { AdminBlogTable } from "@/features/admin/components/blog/AdminBlogTable";
import { AdminBlogCategoriesCard } from "@/features/admin/components/blog/AdminBlogCategoriesCard";
import { AdminBlogRecentPosts } from "@/features/admin/components/blog/AdminBlogRecentPosts";
import { AdminBlogQuickActions } from "@/features/admin/components/blog/AdminBlogQuickActions";
import {
  computeBlogStats,
  exportBlogFile,
  extractAuthorOptions,
  filterBlogPosts,
  getRecentPosts,
  getTabCounts,
  groupBlogByCategory,
  type AdminBlogTab,
  type BlogSort,
} from "@/features/admin/components/blog/adminBlogUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function AdminBlogPage() {
  const { t } = usePortalTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AdminBlogTab>("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<BlogCategory | "">("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<BlogPostStatus | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState<BlogSort>("newest");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const { data: posts = [], isLoading, isFetching, refetch } = useAdminBlogPosts();
  const deletePost = useDeleteBlogPost();

  const stats = useMemo(() => computeBlogStats(posts), [posts]);
  const tabCounts = useMemo(() => getTabCounts(posts), [posts]);
  const categoryRows = useMemo(() => groupBlogByCategory(posts), [posts]);
  const authors = useMemo(() => extractAuthorOptions(posts), [posts]);
  const recentPosts = useMemo(() => getRecentPosts(posts), [posts]);

  const visiblePosts = useMemo(
    () =>
      filterBlogPosts(posts, {
        tab,
        search,
        categoryFilter,
        authorFilter,
        statusFilter,
        dateFrom,
        dateTo,
        sortBy,
      }),
    [
      posts,
      tab,
      search,
      categoryFilter,
      authorFilter,
      statusFilter,
      dateFrom,
      dateTo,
      sortBy,
    ]
  );

  const pagination = usePaginatedList(visiblePosts, {
    pageSize: 10,
    resetDeps: [
      tab,
      search,
      categoryFilter,
      authorFilter,
      statusFilter,
      dateFrom,
      dateTo,
      sortBy,
    ],
  });

  function handleExport() {
    exportBlogFile(visiblePosts);
  }

  function handleDelete(post: { id: string; title: string }) {
    if (!window.confirm(t("admin.common.confirmDeletePost", { name: post.title }))) return;
    deletePost.mutate(post.id);
  }

  return (
    <PageContainer>
      <AdminBlogOverviewHeader onExport={handleExport} />

      <AdminBlogStatsGrid
        stats={stats}
        isLoading={isLoading}
        onPublishedClick={() => setTab("published")}
        onDraftClick={() => setTab("draft")}
      />

      {isLoading ? (
        <PageLoading label={t("admin.common.loadingPosts")} />
      ) : posts.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title={t("admin.common.noBlogPosts")}
          description={t("admin.common.noBlogPostsDesc")}
          actionLabel={t("admin.common.newPost")}
          onAction={() => navigate("/admin/blog/new")}
        />
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 xl:gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="flex min-w-0 flex-col gap-5">
            <AdminBlogToolbar
              tab={tab}
              tabCounts={tabCounts}
              search={search}
              categoryFilter={categoryFilter}
              authorFilter={authorFilter}
              statusFilter={statusFilter}
              dateFrom={dateFrom}
              dateTo={dateTo}
              sortBy={sortBy}
              authors={authors}
              showAdvancedFilters={showAdvancedFilters}
              onTabChange={setTab}
              onSearchChange={setSearch}
              onCategoryChange={setCategoryFilter}
              onAuthorChange={setAuthorFilter}
              onStatusChange={setStatusFilter}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
              onSortChange={setSortBy}
              onToggleAdvancedFilters={() => setShowAdvancedFilters((value) => !value)}
            />

            <AdminBlogTable
              posts={pagination.paginatedItems}
              totalCount={visiblePosts.length}
              onEdit={(post) => navigate(`/admin/blog/${post.id}/edit`)}
              onDelete={handleDelete}
            />

            <Pagination pagination={pagination} itemLabel="posts" />
          </div>

          <aside className="flex flex-col gap-5">
            <AdminBlogCategoriesCard
              categories={categoryRows}
              activeCategory={categoryFilter}
              onCategorySelect={setCategoryFilter}
            />
            <AdminBlogRecentPosts
              posts={recentPosts}
              onViewAll={() => setTab("all")}
              onSelect={(post) => navigate(`/admin/blog/${post.id}/edit`)}
            />
            <AdminBlogQuickActions />
            {isFetching ? (
              <p className="text-center text-xs text-portal-muted">{t("admin.common.refreshingPosts")}</p>
            ) : (
              <button
                type="button"
                onClick={() => void refetch()}
                className="text-center text-xs font-semibold text-primary hover:underline"
              >
                {t("admin.common.refreshData")}
              </button>
            )}
          </aside>
        </div>
      )}
    </PageContainer>
  );
}
