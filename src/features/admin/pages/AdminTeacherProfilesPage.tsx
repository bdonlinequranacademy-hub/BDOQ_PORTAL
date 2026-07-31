import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import {
  useAdminTeacherProfiles,
  useDeleteTeacherProfile,
} from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoading } from "@/components/ui/PageLoading";
import { Pagination } from "@/components/ui/Pagination";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminCmsListToolbar } from "@/features/admin/components/shared/AdminCmsListToolbar";
import { AdminCmsStatusBadge } from "@/features/admin/components/shared/AdminCmsStatusBadge";
import {
  matchesCmsSearch,
  matchesCmsStatus,
  type CmsStatusFilter,
} from "@/features/admin/lib/adminCmsUtils";
import type { AdminTeacherProfile } from "@/types/models";
import { AdminSectionHeaderPanel } from "@/features/admin/components/sectionHeaders/AdminSectionHeaderPanel";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

function filterTeacherProfiles(
  items: AdminTeacherProfile[],
  search: string,
  status: CmsStatusFilter
): AdminTeacherProfile[] {
  return items
    .filter(
      (item) =>
        matchesCmsSearch(search, [
          item.name,
          item.slug,
          item.role,
          item.country,
          item.location,
        ]) && matchesCmsStatus(item.showOnWebsite, status)
    )
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
}

export function AdminTeacherProfilesPage() {
  const { t } = usePortalTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CmsStatusFilter>("all");

  const { data: profiles = [], isLoading, isFetching, refetch } =
    useAdminTeacherProfiles();
  const deleteProfile = useDeleteTeacherProfile();

  const stats = useMemo(
    () => ({
      total: profiles.length,
      published: profiles.filter((p) => p.showOnWebsite).length,
      featured: profiles.filter((p) => p.featured).length,
    }),
    [profiles]
  );

  const visible = useMemo(
    () => filterTeacherProfiles(profiles, search, status),
    [profiles, search, status]
  );

  const pagination = usePaginatedList(visible, {
    pageSize: 10,
    resetDeps: [search, status],
  });

  function handleDelete(item: AdminTeacherProfile) {
    if (!window.confirm(t("admin.common.confirmDeleteTeacher", { name: item.name }))) return;
    deleteProfile.mutate(item.id);
  }

  return (
    <PageContainer>
      <AdminSectionHeaderPanel sectionKey="home.teachers" defaultOpen />
      <AdminSectionHeaderPanel sectionKey="pages.teachers" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            {t("admin.cms.teachers.title")}
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-portal-muted">
            {t("admin.cms.teachers.subtitle")}
          </p>
        </div>
        <Button
          type="button"
          onClick={() => navigate("/admin/teacher-profiles/new")}
          className="hidden shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-white hover:bg-primary-dark sm:inline-flex"
        >
          <Plus className="size-4" aria-hidden />
          {t("admin.common.newTeacher")}
        </Button>
      </div>

      {!isLoading && profiles.length > 0 ? (
        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { label: t("admin.common.statTotal"), value: stats.total },
            { label: t("admin.common.statPublished"), value: stats.published },
            { label: t("admin.common.featured"), value: stats.featured },
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
        <PageLoading label={t("admin.common.loadingTeachers")} />
      ) : profiles.length === 0 ? (
        <EmptyState
          icon={Users}
          title={t("admin.common.noTeachers")}
          description={t("admin.common.noTeachersDesc")}
          actionLabel={t("admin.common.newTeacher")}
          onAction={() => navigate("/admin/teacher-profiles/new")}
        />
      ) : (
        <div className="mt-6 flex flex-col gap-5">
          <AdminCmsListToolbar
            title={t("admin.common.teacherProfiles")}
            subtitle={t("admin.common.teacherProfilesDesc")}
            search={search}
            status={status}
            newLabel={t("admin.common.newTeacher")}
            searchPlaceholder="Search by name, role, or location…"
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onNew={() => navigate("/admin/teacher-profiles/new")}
          />

          {visible.length === 0 ? (
            <Card className="rounded-2xl border border-portal p-8 text-center shadow-sm">
              <p className="font-semibold text-portal-heading">
                {t("admin.common.noMatchFilters")}
              </p>
              <p className="mt-1 text-sm text-portal-muted">
                {t("admin.common.clearFiltersHint")}
              </p>
            </Card>
          ) : (
            <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-sm">
              <div className="border-b border-portal px-5 py-3">
                <p className="text-xs font-medium text-portal-muted">
                  Showing {pagination.paginatedItems.length} of {visible.length}{" "}
                  profile{visible.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-portal bg-portal-muted/30 text-xs font-semibold uppercase tracking-wide text-portal-muted">
                      <th className="px-5 py-3.5">Teacher</th>
                      <th className="px-5 py-3.5">Role</th>
                      <th className="px-5 py-3.5">Gender</th>
                      <th className="px-5 py-3.5">Location</th>
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
                          <div className="flex items-center gap-3">
                            <UserAvatar
                              name={item.name}
                              avatarUrl={item.avatarUrl}
                              size="sm"
                            />
                            <div>
                              <p className="font-semibold text-portal-heading">
                                {item.name}
                                {item.featured ? (
                                  <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase text-gold">
                                    {t("admin.common.featured")}
                                  </span>
                                ) : null}
                              </p>
                              <p className="text-xs text-portal-muted">
                                /teachers/{item.slug}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-portal-muted">
                          {item.role}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
                              item.gender === "female"
                                ? "bg-pink-50 text-pink-700"
                                : "bg-blue-50 text-blue-700"
                            )}
                          >
                            {item.gender}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-portal-muted">
                          {[item.location, item.country].filter(Boolean).join(", ") ||
                            "—"}
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
                                navigate(
                                  `/admin/teacher-profiles/${item.id}/edit`
                                )
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg border border-portal px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/5"
                            >
                              <Pencil className="size-3.5" aria-hidden />
                              {t("admin.common.edit")}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 className="size-3.5" aria-hidden />
                              {t("admin.common.delete")}
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

          <Pagination pagination={pagination} itemLabel="profiles" />

          {isFetching ? (
            <p className="text-center text-xs text-portal-muted">
              Refreshing profiles…
            </p>
          ) : (
            <button
              type="button"
              onClick={() => void refetch()}
              className="text-center text-xs font-semibold text-primary hover:underline"
            >
              {t("admin.common.refreshData")}
            </button>
          )}
        </div>
      )}
    </PageContainer>
  );
}
