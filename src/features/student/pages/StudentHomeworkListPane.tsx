import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useStudentHomework } from "@/features/student/hooks/useStudent";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookOpenCheck } from "lucide-react";
import type { StudentHomeworkItem } from "@/types/models";
import { formatHomeworkDueLabel, isHomeworkOverdue } from "@/lib/homeworkDue";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";

type Filter = "all" | "pending" | "review" | "submitted" | "overdue";

function hwClassTitle(hw: StudentHomeworkItem) {
  const cls = hw.class;
  if (cls && typeof cls === "object") return cls.title;
  return "Class";
}

export function StudentHomeworkListPane() {
  const navigate = useNavigate();
  const { id: activeId } = useParams();
  const [filter, setFilter] = useState<Filter>("all");
  const { data: homework = [], isLoading } = useStudentHomework();

  const filtered = homework.filter((hw) => {
    if (filter === "pending") return hw.canSubmit !== false && !hw.submitted && !hw.underReview;
    if (filter === "review") return hw.underReview;
    if (filter === "submitted") return hw.submitted;
    if (filter === "overdue")
      return hw.canSubmit !== false && !hw.submitted && isHomeworkOverdue(hw.dueDate);
    return true;
  });

  return (
    <div className="flex flex-col gap-4 p-4 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:p-5">
      <div>
        <h1 className="font-display text-xl font-bold text-[#03214F] lg:text-lg">Homework</h1>
        <p className="text-xs text-zinc-500">{homework.length} assignments</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(["all", "pending", "review", "overdue", "submitted"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
              filter === f
                ? "bg-[#03214F] text-white"
                : "border border-zinc-200 bg-white text-[#03214F]"
            }`}
          >
            {f === "review" ? "In review" : f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageLoading />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpenCheck}
          title="No homework"
          description={
            filter === "all"
              ? "You're all caught up — no assignments right now."
              : `Nothing in the "${filter}" filter.`
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((hw) => {
            const overdue =
              hw.canSubmit !== false && !hw.submitted && isHomeworkOverdue(hw.dueDate);
            const active = activeId === hw._id;
            return (
              <button
                key={hw._id}
                onClick={() => navigate(`/student/homework/${hw._id}`)}
                className={`flex items-center gap-3 rounded-xl border-l-4 p-3 text-left transition ${
                  active
                    ? "border-l-[#03214F] bg-[#EEF2F8] shadow-sm"
                    : hw.submitted
                      ? "border-l-emerald-500 bg-white"
                      : hw.underReview
                        ? "border-l-amber-500 bg-white"
                        : overdue
                          ? "border-l-red-500 bg-white"
                          : "border-l-zinc-200 bg-white"
                }`}
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-sm text-[#03214F]">{hw.title}</p>
                  <p className="truncate text-xs text-zinc-400">
                    {hwClassTitle(hw)}
                    {hw.curriculumLabels?.program
                      ? ` · ${formatCurriculumPath(hw.curriculumLabels)}`
                      : ""}
                  </p>
                  <p className="mt-0.5 text-[10px] text-zinc-400">
                    {formatHomeworkDueLabel(hw.dueDate, hw.submitted)}
                  </p>
                </div>
                {hw.underReview ? (
                  <Clock className="size-4 shrink-0 text-amber-600" />
                ) : hw.submitted ? (
                  <CheckCircle className="size-4 shrink-0 text-emerald-600" />
                ) : overdue ? (
                  <AlertCircle className="size-4 shrink-0 text-red-500" />
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
