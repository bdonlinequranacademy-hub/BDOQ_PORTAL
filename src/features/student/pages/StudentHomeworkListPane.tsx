import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, Clock, AlertCircle, BookOpenCheck } from "lucide-react";
import { useStudentHomework } from "@/features/student/hooks/useStudent";
import { PageLoading } from "@/components/ui/PageLoading";
import { EmptyState } from "@/components/ui/EmptyState";
import type { StudentHomeworkItem } from "@/types/models";
import { formatHomeworkDueLabel, isHomeworkOverdue } from "@/lib/homeworkDue";
import { formatCurriculumPath } from "@/lib/api/curriculumApi";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

type Filter = "all" | "pending" | "review" | "submitted" | "overdue";

const FILTER_KEYS: Record<Filter, string> = {
  all: "student.filterAll",
  pending: "student.filterPending",
  review: "student.filterInReview",
  submitted: "student.filterSubmitted",
  overdue: "student.filterOverdue",
};

function hwClassTitle(hw: StudentHomeworkItem, fallback: string) {
  const cls = hw.class;
  if (cls && typeof cls === "object") return cls.title;
  return fallback;
}

export function StudentHomeworkListPane() {
  const navigate = useNavigate();
  const { id: activeId } = useParams();
  const { t, formatDate } = usePortalTranslation();
  const [filter, setFilter] = useState<Filter>("all");
  const { data: homework = [], isLoading } = useStudentHomework();

  const dueOptions = { t, formatDate };

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
        <h1 className="text-xl font-bold text-primary-dark lg:text-lg">
          {t("student.homework")}
        </h1>
        <p className="text-xs text-zinc-500">
          {t("student.assignmentCount", { count: String(homework.length) })}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(["all", "pending", "review", "overdue", "submitted"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === f
                ? "bg-primary-dark text-white"
                : "border border-zinc-200 bg-white text-primary-dark"
            }`}
          >
            {t(FILTER_KEYS[f])}
          </button>
        ))}
      </div>

      {isLoading ? (
        <PageLoading />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpenCheck}
          title={t("student.noHomework")}
          description={
            filter === "all"
              ? t("student.allCaughtUpDesc")
              : t("student.noHomeworkFilter", { filter: t(FILTER_KEYS[filter]) })
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
                  <p className="truncate font-semibold text-sm text-primary-dark">{hw.title}</p>
                  <p className="truncate text-xs text-zinc-400">
                    {hwClassTitle(hw, t("student.classFallback"))}
                    {hw.curriculumLabels?.program
                      ? ` · ${formatCurriculumPath(hw.curriculumLabels)}`
                      : ""}
                  </p>
                  <p className="mt-0.5 text-[10px] text-zinc-400">
                    {formatHomeworkDueLabel(hw.dueDate, hw.submitted, dueOptions)}
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
