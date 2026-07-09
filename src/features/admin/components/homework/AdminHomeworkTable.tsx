import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { MissingCurriculumBadge } from "@/components/curriculum/CurriculumProgramFilter";
import type { AdminHomeworkItem } from "@/types/models";
import { HomeworkGradingStatusBadge } from "@/features/admin/components/homework/HomeworkGradingStatusBadge";
import {
  formatDueDateDetailed,
  getHomeworkClassTitle,
  getHomeworkGradingStatus,
  getHomeworkProgramLabel,
  getHomeworkTeacherName,
  getSubmissionRate,
} from "@/features/admin/components/homework/adminHomeworkUtils";
import { cn } from "@/lib/utils/cn";

interface IAdminHomeworkTableProps {
  items: AdminHomeworkItem[];
  totalCount: number;
  busy: boolean;
  onView: (item: AdminHomeworkItem) => void;
  onDelete: (item: AdminHomeworkItem) => void;
}

const actionClass =
  "inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:border-primary/30 hover:text-primary";

export function AdminHomeworkTable({
  items,
  totalCount,
  busy,
  onView,
  onDelete,
}: IAdminHomeworkTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-center justify-between border-b border-portal px-5 py-4">
        <h2 className="text-sm font-bold text-portal-heading">
          Assignments ({totalCount})
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] border-collapse text-left">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">Assignment</th>
              <th className="px-5 py-3.5">Program</th>
              <th className="px-5 py-3.5">Class / Teacher</th>
              <th className="px-5 py-3.5">Due date</th>
              <th className="px-5 py-3.5">Submissions</th>
              <th className="px-5 py-3.5">Grading</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const due = formatDueDateDetailed(item.dueDate);
              const status = getHomeworkGradingStatus(item);
              const rate = getSubmissionRate(item);
              const total = item.totalStudents ?? 0;
              const graded = item.gradedCount ?? 0;
              const pending = item.pendingGradeCount ?? 0;
              const hasProgram = Boolean(item.curriculumLabels?.program);

              return (
                <tr
                  key={item._id}
                  className={cn(
                    "border-b border-portal/80 transition hover:bg-portal-muted/25",
                    status === "overdue" && "bg-red-50/40",
                    status === "awaiting_grade" && "bg-amber-50/35"
                  )}
                >
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-portal-heading">{item.title}</p>
                    {item.description ? (
                      <p className="line-clamp-1 text-xs text-portal-muted">{item.description}</p>
                    ) : null}
                  </td>
                  <td className="px-5 py-4">
                    {hasProgram ? (
                      <span className="text-sm font-medium text-gold">
                        {getHomeworkProgramLabel(item)}
                      </span>
                    ) : (
                      <MissingCurriculumBadge />
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-portal-heading">
                      {getHomeworkClassTitle(item)}
                    </p>
                    <p className="text-xs text-portal-muted">{getHomeworkTeacherName(item)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs font-bold tracking-wide text-portal-muted">{due.date}</p>
                    <p className="mt-1 text-sm font-semibold text-portal-heading">{due.day}</p>
                    <p
                      className={cn(
                        "mt-0.5 text-xs font-medium",
                        status === "overdue" ? "text-red-600" : "text-portal-muted"
                      )}
                    >
                      {due.relative}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold tabular-nums text-portal-heading">
                      {item.submissionCount}/{total > 0 ? total : "—"}
                    </p>
                    {total > 0 ? (
                      <div className="mt-2 h-2 w-24 overflow-hidden rounded-full bg-portal-muted/50">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    ) : null}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-portal-heading">
                      <span className="font-semibold text-emerald-700">{graded}</span> graded
                    </p>
                    {pending > 0 ? (
                      <p className="text-xs font-medium text-amber-700">{pending} pending</p>
                    ) : (
                      <p className="text-xs text-portal-muted">No pending</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <HomeworkGradingStatusBadge status={status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(item)}
                        className={actionClass}
                        aria-label={`View ${item.title}`}
                        title="View details"
                      >
                        <Eye className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        disabled={busy}
                        className={cn(
                          actionClass,
                          "hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        )}
                        aria-label={`Delete ${item.title}`}
                        title="Delete assignment"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => onView(item)}
                        className={actionClass}
                        aria-label={`More actions for ${item.title}`}
                        title="More"
                      >
                        <MoreHorizontal className="size-4" aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
