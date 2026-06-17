import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Trash2, BookOpen, Users, CalendarDays } from "lucide-react";
import { useAdminClasses, useDeleteClass } from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { ClassCard } from "@/components/classes/ClassCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { classTitle, studentCount, teacherName } from "@/lib/utils/class";
import { formControlClass } from "@/lib/formControl";
import { PageLoading } from "@/components/ui/PageLoading";

type StatusFilter = "all" | "active" | "inactive";

export function AdminClassesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { data: classes = [], isLoading } = useAdminClasses();
  const deleteClass = useDeleteClass();

  const stats = useMemo(() => {
    const active = classes.filter((c) => c.isActive !== false).length;
    const enrolled = classes.reduce((sum, c) => sum + studentCount(c), 0);
    const scheduled = classes.filter((c) => c.schedule?.day).length;
    return { active, enrolled, scheduled };
  }, [classes]);

  const filtered = classes.filter((c) => {
    const matchesSearch = classTitle(c).toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? c.isActive !== false : c.isActive === false);
    return matchesSearch && matchesStatus;
  });

  function handleDeactivate(classId: string, title: string) {
    if (
      !window.confirm(`Deactivate "${title}"? Students will no longer see this class.`)
    ) {
      return;
    }
    deleteClass.mutate(classId);
  }

  const filterTabs: { id: StatusFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "inactive", label: "Inactive" },
  ];

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy">Classes</h1>
          <p className="text-sm text-zinc-500">
            Manage schedules, teachers, and student enrollment
          </p>
        </div>
        <Button
          onClick={() => navigate("/admin/classes/new")}
          className="gap-2 rounded-xl bg-navy text-white"
        >
          <Plus className="size-4" />
          New class
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-navy/10">
            <BookOpen className="size-5 text-navy" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy">{classes.length}</p>
            <p className="text-xs text-zinc-500">Total classes</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50">
            <Users className="size-5 text-emerald-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy">{stats.enrolled}</p>
            <p className="text-xs text-zinc-500">Enrolled students</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gold/15">
            <CalendarDays className="size-5 text-gold-dark" />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy">{stats.scheduled}</p>
            <p className="text-xs text-zinc-500">With weekly schedule</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            className={`${formControlClass} py-3 pl-10`}
            placeholder="Search by class name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex rounded-xl border border-zinc-200 bg-white p-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === tab.id
                  ? "bg-navy text-white"
                  : "text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <PageLoading label="Loading classes…" />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={search || statusFilter !== "all" ? "No classes match" : "No classes yet"}
          description={
            search || statusFilter !== "all"
              ? "Try a different search or filter."
              : "Create your first class to assign teachers and enroll students."
          }
          actionLabel={search || statusFilter !== "all" ? undefined : "Create class"}
          onAction={
            search || statusFilter !== "all" ? undefined : () => navigate("/admin/classes/new")
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((cls) => (
            <ClassCard
              key={cls._id}
              title={classTitle(cls)}
              subtitle={cls.description}
              teacherName={teacherName(typeof cls.teacher === "object" ? cls.teacher : undefined)}
              studentCount={studentCount(cls)}
              schedule={cls.schedule}
              inactive={cls.isActive === false}
              onClick={() => navigate(`/admin/classes/${cls._id}`)}
              actions={
                <button
                  type="button"
                  onClick={() => handleDeactivate(cls._id, classTitle(cls))}
                  className="inline-flex items-center gap-1 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 className="size-3.5" />
                  Deactivate
                </button>
              }
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
