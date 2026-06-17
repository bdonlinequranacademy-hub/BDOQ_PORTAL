import { useMemo, useState } from "react";
import type { ClassLogStatus } from "@/types/models";
import {
  useTeacherClassLogs,
  useTeacherClassLogStats,
} from "@/features/teacher/hooks/useTeacher";
import { PageContainer } from "@/components/layout/PageContainer";
import { ClassLogCard } from "@/components/schedule/ClassLogCard";
import {
  CurriculumProgramFilter,
} from "@/components/curriculum/CurriculumProgramFilter";
import { useCurriculumTree } from "@/components/curriculum/NestedCurriculumSelect";
import { matchesProgramFilter } from "@/lib/api/curriculumApi";
import { Card } from "@/components/ui/Card";
import { formControlClass } from "@/lib/formControl";
import { ClipboardList, Search } from "lucide-react";

import { PageLoading } from "@/components/ui/PageLoading";
type Filter = "all" | ClassLogStatus;

export function TeacherClassLogsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [programFilter, setProgramFilter] = useState("");
  const [search, setSearch] = useState("");
  const status = filter === "all" ? undefined : filter;
  const { data: logs = [], isLoading } = useTeacherClassLogs(status);
  const { data: stats } = useTeacherClassLogStats();
  const { data: curriculumTree = [] } = useCurriculumTree();

  const filters: { id: Filter; label: string; count?: number }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending", count: stats?.pending },
    { id: "approved", label: "Approved", count: stats?.approved },
    { id: "rejected", label: "Rejected", count: stats?.rejected },
  ];

  const missingProgramCount = useMemo(
    () => logs.filter((l) => !l.curriculumProgram).length,
    [logs]
  );

  const visibleLogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs.filter((log) => {
      if (!matchesProgramFilter(log.curriculumProgram, programFilter)) return false;
      if (!q) return true;
      return (
        log.student.name.toLowerCase().includes(q) ||
        log.classTitle.toLowerCase().includes(q) ||
        log.lessonReport.toLowerCase().includes(q)
      );
    });
  }, [logs, programFilter, search]);

  return (
    <PageContainer className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#03214F]">My Class Logs</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Session logs with lesson reports — pending admin approval
        </p>
      </div>

      {missingProgramCount > 0 ? (
        <Card className="rounded-2xl border-0 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm text-amber-800">
            {missingProgramCount} older log{missingProgramCount === 1 ? "" : "s"} without a study
            program — new logs require a program when submitting.
          </p>
        </Card>
      ) : null}

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending", value: stats?.pending ?? 0, color: "text-amber-600" },
          { label: "Approved", value: stats?.approved ?? 0, color: "text-emerald-600" },
          { label: "Rejected", value: stats?.rejected ?? 0, color: "text-red-500" },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl border-0 p-4 shadow-sm">
            <span className="text-xs text-zinc-400">{s.label}</span>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
          <input
            className={`${formControlClass} pl-10`}
            placeholder="Search student, class, report…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CurriculumProgramFilter
          tree={curriculumTree}
          value={programFilter}
          onChange={setProgramFilter}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${
              filter === f.id
                ? "bg-[#03214F] text-white"
                : "border border-zinc-200 bg-white text-[#03214F]"
            }`}
          >
            {f.label}
            {f.count !== undefined ? ` (${f.count})` : ""}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageLoading label="Loading class logs…" />
      ) : visibleLogs.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-200 p-10 text-center">
          <ClipboardList className="size-10 text-zinc-300" />
          <p className="font-semibold text-[#03214F]">
            {logs.length === 0 ? "No class logs yet" : "No logs match your filters"}
          </p>
          <p className="text-sm text-zinc-400">
            {logs.length === 0
              ? 'Use "Log Session" from Today\'s Schedule after each class.'
              : "Try clearing search or program filter."}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleLogs.map((log) => (
            <ClassLogCard key={log._id} log={log} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
