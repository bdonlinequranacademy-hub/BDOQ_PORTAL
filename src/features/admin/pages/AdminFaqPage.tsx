import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleHelp, Pencil, Plus, Trash2 } from "lucide-react";
import {
  useAdminFaqItems,
  useDeleteFaqItem,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminCmsListToolbar } from "@/features/admin/components/shared/AdminCmsListToolbar";
import { AdminCmsStatusBadge } from "@/features/admin/components/shared/AdminCmsStatusBadge";
import {
  matchesCmsSearch,
  matchesCmsStatus,
  type CmsStatusFilter,
} from "@/features/admin/lib/adminCmsUtils";
import type { AdminFaqItem } from "@/types/models";

function filterFaqItems(
  items: AdminFaqItem[],
  search: string,
  status: CmsStatusFilter
): AdminFaqItem[] {
  return items
    .filter(
      (item) =>
        matchesCmsSearch(search, [
          item.question,
          item.answer,
          item.externalId,
        ]) && matchesCmsStatus(item.showOnWebsite, status)
    )
    .sort((a, b) => a.sortOrder - b.sortOrder || a.question.localeCompare(b.question));
}

export function AdminFaqPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CmsStatusFilter>("all");

  const { data: items = [], isLoading, isFetching, refetch } =
    useAdminFaqItems();
  const deleteItem = useDeleteFaqItem();

  const stats = useMemo(
    () => ({
      total: items.length,
      published: items.filter((i) => i.showOnWebsite).length,
      draft: items.filter((i) => !i.showOnWebsite).length,
    }),
    [items]
  );

  const visible = useMemo(
    () => filterFaqItems(items, search, status),
    [items, search, status]
  );

  const pagination = usePaginatedList(visible, {
    pageSize: 10,
    resetDeps: [search, status],
  });

  function handleDelete(item: AdminFaqItem) {
    if (!window.confirm(`Delete FAQ "${item.question.slice(0, 60)}…"?`)) return;
    deleteItem.mutate(item.id);
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            FAQ CMS
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-portal-muted">
            Manage homepage and sitewide FAQ accordion items on the public website.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => navigate("/admin/faq/new")}
          className="hidden shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-white hover:bg-primary-dark sm:inline-flex"
        >
          <Plus className="size-4" aria-hidden />
          New FAQ
        </Button>
      </div>

      {!isLoading && items.length > 0 ? (
        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: "Total items", value: stats.total },
            { label: "Published", value: stats.published },
            { label: "Draft", value: stats.draft },
          ].map((stat) => (
            <Card
              key={stat.label}
              className="rounded-2xl border border-portal bg-portal-surface p-4 text-center shadow-sm"
            >
              <p className="text-2xl font-bold text-primary-dark">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-portal-muted">
                {stat.label}
              </p>
            </Card>
          ))}
        </div>
      ) : null}

      {isLoading ? (
        <PageLoading label="Loading FAQ items…" />
      ) : items.length === 0 ? (
        <EmptyState
          icon={CircleHelp}
          title="No FAQ items yet"
          description="Add questions and answers for the public website FAQ section."
          actionLabel="New FAQ"
          onAction={() => navigate("/admin/faq/new")}
        />
      ) : (
        <div className="mt-6 flex flex-col gap-5">
          <AdminCmsListToolbar
            title="FAQ Items"
            subtitle="Questions shown in the public FAQ accordion"
            search={search}
            status={status}
            newLabel="New FAQ"
            searchPlaceholder="Search question or answer…"
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onNew={() => navigate("/admin/faq/new")}
          />

          {visible.length === 0 ? (
            <Card className="rounded-2xl border border-portal p-8 text-center shadow-sm">
              <p className="font-semibold text-portal-heading">
                No FAQ items match filters
              </p>
              <p className="mt-1 text-sm text-portal-muted">
                Try clearing search or status filters.
              </p>
            </Card>
          ) : (
            <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-sm">
              <div className="border-b border-portal px-5 py-3">
                <p className="text-xs font-medium text-portal-muted">
                  Showing {pagination.paginatedItems.length} of {visible.length}{" "}
                  item{visible.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-portal bg-portal-muted/30 text-xs font-semibold uppercase tracking-wide text-portal-muted">
                      <th className="px-5 py-3.5">Question</th>
                      <th className="px-5 py-3.5">External ID</th>
                      <th className="px-5 py-3.5">Order</th>
                      <th className="px-5 py-3.5">Status</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-portal/80">
                    {pagination.paginatedItems.map((item) => (
                      <tr
                        key={item.id}
                        className="align-top transition hover:bg-portal-muted/20"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-portal-heading">
                            {item.question}
                          </p>
                          <p className="mt-1 line-clamp-2 text-xs text-portal-muted">
                            {item.answer}
                          </p>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-portal-muted">
                          {item.externalId}
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-portal-heading">
                          {item.sortOrder}
                        </td>
                        <td className="px-5 py-4">
                          <AdminCmsStatusBadge showOnWebsite={item.showOnWebsite} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/admin/faq/${item.id}/edit`)
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-portal px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/5"
                            >
                              <Pencil className="size-3.5" aria-hidden />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 className="size-3.5" aria-hidden />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <Pagination pagination={pagination} itemLabel="items" />

          {isFetching ? (
            <p className="text-center text-xs text-portal-muted">
              Refreshing FAQ…
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
        </div>
      )}
    </PageContainer>
  );
}
