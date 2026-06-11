import { Check, Circle } from "lucide-react";
import {
  formatCurriculumPath,
  type CurriculumAssignment,
} from "@/lib/api/curriculumApi";

export function curriculumAssignmentKey(a: CurriculumAssignment) {
  return `${a.programId}|${a.unitId ?? ""}|${a.topicId ?? ""}`;
}

interface StudentCurriculumPlanProps {
  assignments: CurriculumAssignment[];
  allowToggle?: boolean;
  onToggle?: (assignment: CurriculumAssignment, completed: boolean) => void;
  togglingKey?: string | null;
  emptyMessage?: string;
}

export function StudentCurriculumPlan({
  assignments,
  allowToggle = false,
  onToggle,
  togglingKey = null,
  emptyMessage,
}: StudentCurriculumPlanProps) {
  if (!assignments.length) {
    return emptyMessage ? (
      <p className="text-sm text-zinc-400">{emptyMessage}</p>
    ) : null;
  }

  const completedCount = assignments.filter((a) => a.completed).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-zinc-500">
          {completedCount} of {assignments.length} completed
        </span>
        <div className="h-1.5 flex-1 max-w-32 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{
              width: `${assignments.length ? (completedCount / assignments.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {assignments.map((assignment, idx) => {
          const key = curriculumAssignmentKey(assignment);
          const label = formatCurriculumPath(assignment.curriculumLabels, assignment);
          const completed = Boolean(assignment.completed);
          const toggling = togglingKey === key;

          if (allowToggle && onToggle) {
            return (
              <button
                key={`${key}-${idx}`}
                type="button"
                disabled={toggling}
                onClick={() => onToggle(assignment, !completed)}
                className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                  completed
                    ? "border-emerald-200 bg-emerald-50/80"
                    : "border-zinc-200 bg-white hover:border-[#C4922B]/40"
                } ${toggling ? "opacity-60" : ""}`}
              >
                <span
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                    completed ? "bg-emerald-600 text-white" : "border-2 border-zinc-300 text-transparent"
                  }`}
                >
                  {completed ? <Check className="size-3" strokeWidth={3} /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-sm font-medium ${
                      completed ? "text-emerald-800 line-through decoration-emerald-400/60" : "text-[#03214F]"
                    }`}
                  >
                    {label}
                  </span>
                  {completed && assignment.completedAt ? (
                    <span className="mt-0.5 block text-[10px] text-emerald-600">
                      Completed {new Date(assignment.completedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="mt-0.5 block text-[10px] text-zinc-400">
                      Tap when finished
                    </span>
                  )}
                </span>
              </button>
            );
          }

          return (
            <div
              key={`${key}-${idx}`}
              className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 ${
                completed
                  ? "border-emerald-200 bg-emerald-50/80"
                  : "border-zinc-100 bg-zinc-50/50"
              }`}
            >
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                  completed ? "bg-emerald-600 text-white" : "bg-zinc-200 text-zinc-400"
                }`}
              >
                {completed ? (
                  <Check className="size-3" strokeWidth={3} />
                ) : (
                  <Circle className="size-3" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-sm font-medium ${
                    completed ? "text-emerald-800" : "text-[#03214F]"
                  }`}
                >
                  {label}
                </span>
                {completed && assignment.completedAt ? (
                  <span className="mt-0.5 block text-[10px] text-emerald-600">
                    Completed {new Date(assignment.completedAt).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="mt-0.5 block text-[10px] text-zinc-400">In progress</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
