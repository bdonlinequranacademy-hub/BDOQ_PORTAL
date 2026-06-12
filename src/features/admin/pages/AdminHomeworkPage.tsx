import { useMemo, useState } from "react";
import { BookOpenCheck } from "lucide-react";
import { useAdminHomework } from "@/features/admin/hooks/useAdmin";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { CurriculumProgramFilter } from "@/components/curriculum/CurriculumProgramFilter";
import { useCurriculumTree } from "@/components/curriculum/NestedCurriculumSelect";
import { formatCurriculumPath, matchesProgramFilter } from "@/lib/api/curriculumApi";
import { MissingCurriculumBadge } from "@/components/curriculum/CurriculumProgramFilter";
import { formatHomeworkDueLabel, isHomeworkOverdue } from "@/lib/homeworkDue";
import type { AdminHomeworkItem } from "@/types/models";

import { PageLoading } from "@/components/ui/PageLoading";
function classTitle(item: AdminHomeworkItem) {
  return typeof item.class === "object" ? item.class.title : "Class";
}

function teacherName(item: AdminHomeworkItem) {
  return typeof item.teacher === "object" ? item.teacher.name : "Teacher";
}

export function AdminHomeworkPage() {
  const [programFilter, setProgramFilter] = useState("");
  const { data: homework = [], isLoading } = useAdminHomework();
  const { data: curriculumTree = [] } = useCurriculumTree();

  const visibleHomework = useMemo(
    () => homework.filter((hw) => matchesProgramFilter(hw.curriculumProgram, programFilter)),
    [homework, programFilter]
  );

  const pendingGradeTotal = visibleHomework.reduce(
    (sum, hw) => sum + (hw.pendingGradeCount ?? 0),
    0
  );

  return (
    <PageContainer className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#03214F]">Homework</h1>
          <p className="text-sm text-zinc-500">
            Academy-wide assignments · {visibleHomework.length} shown
            {pendingGradeTotal > 0 ? ` · ${pendingGradeTotal} awaiting grade` : ""}
          </p>
        </div>
        <CurriculumProgramFilter
          tree={curriculumTree}
          value={programFilter}
          onChange={setProgramFilter}
        />
      </div>

      {isLoading ? (
        <PageLoading label="Loading homework…" />
      ) : visibleHomework.length === 0 ? (
        <EmptyState
          icon={BookOpenCheck}
          title={homework.length === 0 ? "No homework yet" : "No homework for this program"}
          description={
            homework.length === 0
              ? "Assignments appear here when teachers create them for their classes."
              : "Try selecting a different program filter."
          }
        />
      ) : (
        <Card className="overflow-hidden rounded-2xl border-0 p-0 shadow-sm">
          <div className="hidden border-b border-zinc-100 bg-zinc-50 px-5 py-3 md:grid md:grid-cols-[2fr_1.5fr_1.2fr_1fr_1fr_1fr] md:text-xs md:font-semibold md:uppercase md:text-zinc-500">
            <span>Assignment</span>
            <span>Program</span>
            <span>Class / Teacher</span>
            <span>Due</span>
            <span>Submissions</span>
            <span>Grading</span>
          </div>
          <div className="divide-y divide-zinc-100">
            {visibleHomework.map((hw) => {
              const overdue = isHomeworkOverdue(hw.dueDate);
              return (
                <div
                  key={hw._id}
                  className="flex flex-col gap-2 p-4 md:grid md:grid-cols-[2fr_1.5fr_1.2fr_1fr_1fr_1fr] md:items-center md:gap-4"
                >
                  <div>
                    <p className="font-semibold text-[#03214F]">{hw.title}</p>
                    {hw.description ? (
                      <p className="line-clamp-1 text-xs text-zinc-500">{hw.description}</p>
                    ) : null}
                  </div>
                  <div className="text-sm">
                    {hw.curriculumLabels?.program ? (
                      <span className="text-[#C4922B]">
                        {formatCurriculumPath(hw.curriculumLabels)}
                      </span>
                    ) : (
                      <MissingCurriculumBadge />
                    )}
                  </div>
                  <div className="text-sm text-zinc-600">
                    <p>{classTitle(hw)}</p>
                    <p className="text-xs text-zinc-400">{teacherName(hw)}</p>
                  </div>
                  <p
                    className={`text-sm font-medium ${
                      overdue ? "text-red-600" : "text-zinc-600"
                    }`}
                  >
                    {formatHomeworkDueLabel(hw.dueDate)}
                  </p>
                  <p className="text-sm text-zinc-600">
                    {hw.submissionCount}/{hw.totalStudents ?? "—"} submitted
                  </p>
                  <p className="text-sm text-zinc-600">
                    {hw.gradedCount ?? 0} graded
                    {(hw.pendingGradeCount ?? 0) > 0 ? (
                      <span className="ml-1 text-amber-700">
                        · {hw.pendingGradeCount} pending
                      </span>
                    ) : null}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </PageContainer>
  );
}
