import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, ChevronRight, Trash2 } from "lucide-react";
import { useAdminClasses, useDeleteClass } from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { classTitle, teacherName, studentCount } from "@/lib/utils/class";
import { formControlClass } from "@/lib/formControl";

import { PageLoading } from "@/components/ui/PageLoading";
export function AdminClassesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: classes = [], isLoading } = useAdminClasses();
  const deleteClass = useDeleteClass();

  const filtered = classes.filter((c) =>
    classTitle(c).toLowerCase().includes(search.toLowerCase())
  );

  function handleDeactivate(classId: string, title: string) {
    if (
      !window.confirm(`Deactivate "${title}"? Students will no longer see this class.`)
    ) {
      return;
    }
    deleteClass.mutate(classId);
  }

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#03214F]">Class Management</h1>
          <p className="text-sm text-zinc-500">{classes.length} classes</p>
        </div>
        <Button
          onClick={() => navigate("/admin/classes/new")}
          className="gap-2 rounded-xl bg-[#03214F] text-white"
        >
          <Plus className="size-4" />
          New Class
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <input
          className={`${formControlClass} py-3 pl-10`}
          placeholder="Search classes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <PageLoading label="Loading classes…" />
      ) : filtered.length === 0 ? (
        <Card className="rounded-2xl border-0 p-8 text-center shadow-sm">
          <p className="text-zinc-400">No classes found.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((cls) => (
            <div
              key={cls._id}
              className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm"
            >
              <button
                onClick={() => navigate(`/admin/classes/${cls._id}`)}
                className="flex flex-1 flex-col gap-2 text-left"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-[#03214F]">{classTitle(cls)}</span>
                  <ChevronRight className="size-4 shrink-0 text-zinc-300" />
                </div>
                <p className="text-xs text-zinc-400">
                  {teacherName(typeof cls.teacher === "object" ? cls.teacher : undefined)}
                </p>
                <p className="text-xs text-zinc-500">{studentCount(cls)} students enrolled</p>
                {cls.schedule && (
                  <p className="text-xs text-[#C4922B]">
                    {cls.schedule.day} · {cls.schedule.time}
                  </p>
                )}
                {cls.isActive === false && (
                  <span className="w-fit rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-500">
                    Inactive
                  </span>
                )}
              </button>
              <button
                onClick={() => handleDeactivate(cls._id, classTitle(cls))}
                className="flex items-center gap-1 self-start text-xs font-medium text-red-500 hover:text-red-600"
              >
                <Trash2 className="size-3.5" />
                Deactivate
              </button>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
