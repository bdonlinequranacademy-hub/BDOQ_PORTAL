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
      <p className="text-sm text-portal-muted">{emptyMessage}</p>
    ) : null;
  }

  const completedCount = assignments.filter((a) => a.completed).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-portal-muted">
          {completedCount} of {assignments.length} completed
        </span>
        <div className="h-1.5 flex-1 max-w-32 overflow-hidden rounded-full bg-portal-muted">
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
                    ? "border-emerald-500/30 bg-emerald-500/10"
                    : "border-portal bg-portal-muted hover:border-gold/40"
                } ${toggling ? "opacity-60" : ""}`}
              >
                <span
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                    completed ? "bg-emerald-600 text-white" : "border-2 border-portal text-transparent"
                  }`}
                >
                  {completed ? <Check className="size-3" strokeWidth={3} /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-sm font-medium ${
                      completed ? "text-emerald-400 line-through decoration-emerald-500/40" : "text-portal-heading"
                    }`}
                  >
                    {label}
                  </span>
                  {completed && assignment.completedAt ? (
                    <span className="mt-0.5 block text-[10px] text-emerald-400">
                      Completed {new Date(assignment.completedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="mt-0.5 block text-[10px] text-portal-muted">
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
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-portal bg-portal-muted"
              }`}
            >
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ${
                  completed ? "bg-emerald-600 text-white" : "bg-portal-muted text-portal-muted"
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
                    completed ? "text-emerald-400" : "text-portal-heading"
                  }`}
                >
                  {label}
                </span>
                {completed && assignment.completedAt ? (
                  <span className="mt-0.5 block text-[10px] text-emerald-400">
                    Completed {new Date(assignment.completedAt).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="mt-0.5 block text-[10px] text-portal-muted">In progress</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
