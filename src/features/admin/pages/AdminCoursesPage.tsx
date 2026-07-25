import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import {
  useAdminCourses,
  useDeleteCourse,
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
import type { AdminCourse, AdminCourseCategory } from "@/types/models";
import { cn } from "@/lib/utils/cn";

const CATEGORY_LABELS: Record<AdminCourseCategory, string> = {
  private: "Private (1-to-1)",
  record: "Record Course",
  live: "Live Course",
  free: "Free Course",
};

function categoryBadgeClass(category: AdminCourseCategory): string {
  switch (category) {
    case "private":
      return "bg-primary/10 text-primary-dark";
    case "record":
      return "bg-blue-50 text-blue-700";
    case "live":
      return "bg-amber-50 text-amber-800";
    case "free":
      return "bg-emerald-50 text-emerald-800";
    default:
      return "bg-portal-muted/40 text-portal-muted";
  }
}

function filterCourses(
  items: AdminCourse[],
  search: string,
  status: CmsStatusFilter
): AdminCourse[] {
  return items
    .filter(
      (item) =>
        matchesCmsSearch(search, [item.title, item.slug, item.description]) &&
        matchesCmsStatus(item.showOnWebsite, status)
    )
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export function AdminCoursesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CmsStatusFilter>("all");

  const { data: courses = [], isLoading, isFetching, refetch } =
    useAdminCourses();
  const deleteCourse = useDeleteCourse();

  const stats = useMemo(
    () => ({
      total: courses.length,
      published: courses.filter((c) => c.showOnWebsite).length,
      draft: courses.filter((c) => !c.showOnWebsite).length,
    }),
    [courses]
  );

  const visible = useMemo(
    () => filterCourses(courses, search, status),
    [courses, search, status]
  );

  const pagination = usePaginatedList(visible, {
    pageSize: 10,
    resetDeps: [search, status],
  });

  function handleDelete(item: AdminCourse) {
    if (!window.confirm(`Delete course "${item.title}"?`)) return;
    deleteCourse.mutate(item.id);
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            Courses CMS
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-portal-muted">
            Manage public website courses — listings, detail pages, and pricing
            hints shown on bdonlinequranacademy.com/courses.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => navigate("/admin/courses/new")}
          className="hidden shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-white hover:bg-primary-dark sm:inline-flex"
        >
          <Plus className="size-4" aria-hidden />
          New Course
        </Button>
      </div>

      {!isLoading && courses.length > 0 ? (
        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: "Total courses", value: stats.total },
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
        <PageLoading label="Loading courses…" />
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Add courses to populate the public /courses page and individual course detail pages."
          actionLabel="New Course"
          onAction={() => navigate("/admin/courses/new")}
        />
      ) : (
        <div className="mt-6 flex flex-col gap-5">
          <AdminCmsListToolbar
            title="Website Courses"
            subtitle="Courses shown on the public website"
            search={search}
            status={status}
            newLabel="New Course"
            searchPlaceholder="Search by title or slug…"
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onNew={() => navigate("/admin/courses/new")}
          />

          {visible.length === 0 ? (
            <Card className="rounded-2xl border border-portal p-8 text-center shadow-sm">
              <p className="font-semibold text-portal-heading">
                No courses match filters
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
                  course{visible.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[880px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-portal bg-portal-muted/30 text-xs font-semibold uppercase tracking-wide text-portal-muted">
                      <th className="px-5 py-3.5">Course</th>
                      <th className="px-5 py-3.5">Category</th>
                      <th className="px-5 py-3.5">Audience</th>
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
                          <div className="flex items-start gap-3">
                            <span className="text-2xl" aria-hidden>
                              {item.icon || "📖"}
                            </span>
                            <div>
                              <p className="font-semibold text-portal-heading">
                                {item.title}
                              </p>
                              <p className="text-xs text-portal-muted">
                                /courses/{item.slug}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                              categoryBadgeClass(item.category)
                            )}
                          >
                            {CATEGORY_LABELS[item.category]}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-portal-muted">
                          {item.gender
                            ? item.gender.charAt(0).toUpperCase() +
                              item.gender.slice(1)
                            : item.target || "—"}
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
                                navigate(`/admin/courses/${item.id}/edit`)
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

          <Pagination pagination={pagination} itemLabel="courses" />

          {isFetching ? (
            <p className="text-center text-xs text-portal-muted">
              Refreshing courses…
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
