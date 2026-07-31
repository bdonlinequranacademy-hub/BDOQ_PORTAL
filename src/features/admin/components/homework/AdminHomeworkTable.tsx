import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { MissingCurriculumBadge } from "@/components/curriculum/CurriculumProgramFilter";
import type { AdminHomeworkItem } from "@/types/models";
import { HomeworkGradingStatusBadge } from "@/features/admin/components/homework/HomeworkGradingStatusBadge";
import {
  getHomeworkClassTitle,
  getHomeworkGradingStatus,
  getHomeworkProgramLabel,
  getHomeworkTeacherName,
  getSubmissionRate,
} from "@/features/admin/components/homework/adminHomeworkUtils";
import { formatHomeworkDueLabel } from "@/lib/homeworkDue";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

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
  const { t, formatDate, formatNumber } = usePortalTranslation();

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-center justify-between border-b border-portal px-5 py-4">
        <h2 className="text-sm font-bold text-portal-heading">
          {t("admin.homework.assignmentsCount", { count: formatNumber(totalCount) })}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1120px] border-collapse text-left">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">{t("tables.assignment")}</th>
              <th className="px-5 py-3.5">{t("tables.program")}</th>
              <th className="px-5 py-3.5">{t("tables.classTeacher")}</th>
              <th className="px-5 py-3.5">{t("tables.dueDate")}</th>
              <th className="px-5 py-3.5">{t("tables.submissions")}</th>
              <th className="px-5 py-3.5">{t("tables.grading")}</th>
              <th className="px-5 py-3.5">{t("tables.status")}</th>
              <th className="px-5 py-3.5 text-right">{t("tables.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
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
                    <p className="text-xs font-bold tracking-wide text-portal-muted">
                      {formatDate(item.dueDate)}
                    </p>
                    <p
                      className={cn(
                        "mt-0.5 text-xs font-medium",
                        status === "overdue" ? "text-red-600" : "text-portal-muted"
                      )}
                    >
                      {formatHomeworkDueLabel(item.dueDate, undefined, { t, formatDate })}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold tabular-nums text-portal-heading">
                      {formatNumber(item.submissionCount)}/{total > 0 ? formatNumber(total) : "—"}
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
                      <span className="font-semibold text-emerald-700">
                        {formatNumber(graded)}
                      </span>{" "}
                      {t("admin.homework.gradedLabel")}
                    </p>
                    {pending > 0 ? (
                      <p className="text-xs font-medium text-amber-700">
                        {formatNumber(pending)} {t("admin.homework.pendingLabel")}
                      </p>
                    ) : (
                      <p className="text-xs text-portal-muted">{t("admin.homework.noPending")}</p>
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
                        aria-label={t("admin.homework.viewAssignment", { title: item.title })}
                        title={t("admin.homework.viewDetails")}
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
                        aria-label={t("admin.homework.deleteAssignmentAria", { title: item.title })}
                        title={t("admin.homework.deleteAssignmentTitle")}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => onView(item)}
                        className={actionClass}
                        aria-label={t("admin.homework.moreActionsFor", { title: item.title })}
                        title={t("admin.homework.moreActions")}
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
