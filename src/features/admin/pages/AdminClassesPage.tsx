import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, LayoutGrid, List, Plus, Search } from "lucide-react";
import { useAdminClasses, useSetClassActive } from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Pagination } from "@/components/ui/Pagination";
import { PageLoading } from "@/components/ui/PageLoading";
import { formControlClass } from "@/lib/formControl";
import { classTitle } from "@/lib/utils/class";
import { usePaginatedList } from "@/lib/hooks/usePaginatedList";
import { AdminClassesStatsGrid } from "@/features/admin/components/classes/AdminClassesStatsGrid";
import { AdminClassesTable } from "@/features/admin/components/classes/AdminClassesTable";
import { AdminClassesGrid } from "@/features/admin/components/classes/AdminClassesGrid";
import { AdminClassesSidebar } from "@/features/admin/components/classes/AdminClassesSidebar";
import {
  computeAdminClassesStats,
  exportClassesFile,
  extractTeacherOptions,
  filterAdminClasses,
  type AdminClassesSort,
  type AdminClassesTab,
} from "@/features/admin/components/classes/adminClassesUtils";
import type { AdminClass } from "@/types/models";
import { cn } from "@/lib/utils/cn";

type ViewMode = "list" | "grid";

export function AdminClassesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<AdminClassesTab>("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [sortBy, setSortBy] = useState<AdminClassesSort>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const { data: classes = [], isLoading } = useAdminClasses();
  const setClassActive = useSetClassActive();

  const stats = useMemo(() => computeAdminClassesStats(classes), [classes]);
  const teacherOptions = useMemo(() => extractTeacherOptions(classes), [classes]);

  const filtered = useMemo(
    () =>
      filterAdminClasses(classes, {
        search,
        tab,
        teacherFilter,
        sortBy,
      }),
    [classes, search, tab, teacherFilter, sortBy]
  );

  const pagination = usePaginatedList(filtered, {
    resetDeps: [search, tab, teacherFilter, sortBy],
  });

  const tabs: { id: AdminClassesTab; label: string; count?: number }[] = [
    { id: "all", label: "All Classes", count: classes.length },
    { id: "active", label: "Active", count: stats.active },
    { id: "inactive", label: "Inactive", count: classes.length - stats.active },
    { id: "today", label: "Today", count: stats.today },
  ];

  function handleToggleActive(cls: AdminClass) {
    const title = classTitle(cls);
    const inactive = cls.isActive === false;

    if (inactive) {
      if (!window.confirm(`Reactivate "${title}"? Students will see this class again.`)) {
        return;
      }
      setClassActive.mutate({ id: cls._id, isActive: true });
      return;
    }

    if (!window.confirm(`Deactivate "${title}"? Students will no longer see this class.`)) {
      return;
    }
    setClassActive.mutate({ id: cls._id, isActive: false });
  }

  function clearFilters() {
    setSearch("");
    setTeacherFilter("all");
    setSortBy("newest");
  }

  const togglingId =
    setClassActive.isPending && setClassActive.variables?.id
      ? setClassActive.variables.id
      : undefined;

  return (
    <PageContainer className="gap-5 lg:gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="portal-page-title font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            Classes
          </h1>
          <p className="portal-page-subtitle mt-1 max-w-2xl text-portal-muted">
            Manage your academy classes, schedules and student enrollments.
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/classes/new")}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
        >
          <Plus className="size-4" aria-hidden />
          New Class
        </Button>
      </div>

      <AdminClassesStatsGrid stats={stats} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-6">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="rounded-2xl border border-portal bg-portal-surface p-4 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative min-w-0 flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-portal-muted"
                  aria-hidden
                />
                <input
                  className={`${formControlClass} py-2.5 pl-9 text-sm`}
                  placeholder="Search by class name, teacher…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:min-w-[320px] lg:grid-cols-2">
                <Select
                  value={teacherFilter}
                  onChange={(event) => setTeacherFilter(event.target.value)}
                  className="py-2.5 text-sm"
                  aria-label="Filter by teacher"
                >
                  <option value="all">All teachers</option>
                  {teacherOptions.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </Select>
                <Select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as AdminClassesSort)}
                  className="py-2.5 text-sm"
                  aria-label="Sort classes"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="name">Name A–Z</option>
                  <option value="students">Most students</option>
                </Select>
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-portal px-3 py-2.5 text-sm font-semibold text-portal-heading transition hover:border-primary/30 hover:bg-primary/5 lg:shrink-0"
              >
                <Filter className="size-4 text-primary" aria-hidden />
                Clear
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-semibold transition",
                    tab === item.id
                      ? "bg-primary text-white shadow-sm"
                      : "border border-portal bg-portal-surface text-portal-heading hover:border-primary/30"
                  )}
                >
                  {item.label}
                  {item.count != null ? ` (${item.count})` : ""}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-portal bg-portal-surface p-1">
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-lg transition",
                  viewMode === "list"
                    ? "bg-primary/10 text-primary"
                    : "text-portal-muted hover:bg-portal-muted/40"
                )}
              >
                <List className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-lg transition",
                  viewMode === "grid"
                    ? "bg-primary/10 text-primary"
                    : "text-portal-muted hover:bg-portal-muted/40"
                )}
              >
                <LayoutGrid className="size-4" aria-hidden />
              </button>
            </div>
          </div>

          {isLoading ? (
            <PageLoading label="Loading classes…" />
          ) : filtered.length === 0 ? (
            <EmptyState
              title={search || tab !== "all" || teacherFilter !== "all" ? "No classes match" : "No classes yet"}
              description={
                search || tab !== "all" || teacherFilter !== "all"
                  ? "Try a different search or filter."
                  : "Create your first class to assign teachers and enroll students."
              }
              actionLabel={
                search || tab !== "all" || teacherFilter !== "all" ? undefined : "Create class"
              }
              onAction={
                search || tab !== "all" || teacherFilter !== "all"
                  ? undefined
                  : () => navigate("/admin/classes/new")
              }
            />
          ) : (
            <>
              {viewMode === "list" ? (
                <AdminClassesTable
                  classes={pagination.paginatedItems}
                  togglingId={togglingId}
                  onToggleActive={handleToggleActive}
                />
              ) : (
                <AdminClassesGrid
                  classes={pagination.paginatedItems}
                  togglingId={togglingId}
                  onToggleActive={handleToggleActive}
                />
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => exportClassesFile(filtered, "csv")}
                  className="text-sm font-semibold text-primary hover:underline"
                >
                  Export filtered list
                </button>
                <Pagination pagination={pagination} itemLabel="classes" />
              </div>
            </>
          )}
        </div>

        <AdminClassesSidebar classes={classes} />
      </div>
    </PageContainer>
  );
}
