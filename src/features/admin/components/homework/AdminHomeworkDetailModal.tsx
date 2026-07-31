import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminHomeworkDetailModalProps {
  item: AdminHomeworkItem | null;
  busy: boolean;
  onClose: () => void;
  onDelete: (item: AdminHomeworkItem) => void;
}

export function AdminHomeworkDetailModal({
  item,
  busy,
  onClose,
  onDelete,
}: IAdminHomeworkDetailModalProps) {
  const { t, formatDate, formatDateTime, formatNumber } = usePortalTranslation();

  if (!item) return null;

  const status = getHomeworkGradingStatus(item);
  const total = item.totalStudents ?? 0;
  const hasProgram = Boolean(item.curriculumLabels?.program);
  const submissionRate = getSubmissionRate(item);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#0A1628]/55 backdrop-blur-[2px]"
        aria-label={t("admin.homework.closeDetails")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="homework-detail-title"
        className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-portal bg-portal-surface shadow-2xl sm:rounded-3xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-portal px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-portal-muted">
              {t("admin.homework.detailAssignmentDetails")}
            </p>
            <h2 id="homework-detail-title" className="mt-1 text-xl font-bold text-portal-heading">
              {item.title}
            </h2>
            <div className="mt-2">
              <HomeworkGradingStatusBadge status={status} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-portal text-portal-muted transition hover:text-portal-heading"
            aria-label={t("common.cancel")}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          {item.description ? (
            <p className="mb-5 whitespace-pre-wrap text-sm leading-relaxed text-portal-muted">
              {item.description}
            </p>
          ) : null}

          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-portal-muted">{t("admin.homework.program")}</dt>
              <dd className="mt-0.5 text-sm font-medium text-portal-heading">
                {hasProgram ? (
                  <span className="text-gold">{getHomeworkProgramLabel(item)}</span>
                ) : (
                  <MissingCurriculumBadge />
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-portal-muted">{t("admin.homework.class")}</dt>
              <dd className="mt-0.5 text-sm font-medium text-portal-heading">
                {getHomeworkClassTitle(item)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-portal-muted">{t("admin.homework.teacher")}</dt>
              <dd className="mt-0.5 text-sm font-medium text-portal-heading">
                {getHomeworkTeacherName(item)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-portal-muted">{t("admin.homework.dueDate")}</dt>
              <dd className="mt-0.5 text-sm font-medium text-portal-heading">
                {formatDate(item.dueDate)}
              </dd>
              <dd className="text-xs text-portal-muted">
                {formatHomeworkDueLabel(item.dueDate, undefined, { t, formatDate })}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-portal-muted">{t("admin.homework.submissions")}</dt>
              <dd className="mt-0.5 text-sm font-medium text-portal-heading">
                {t("admin.homework.submittedCount", {
                  submitted: formatNumber(item.submissionCount),
                  total: total > 0 ? formatNumber(total) : "—",
                })}
              </dd>
              {total > 0 ? (
                <dd className="text-xs text-primary">
                  {t("admin.homework.submissionRate", {
                    rate: formatNumber(submissionRate),
                  })}
                </dd>
              ) : null}
            </div>
            <div>
              <dt className="text-xs text-portal-muted">{t("admin.homework.grading")}</dt>
              <dd className="mt-0.5 text-sm font-medium text-portal-heading">
                {t("admin.homework.gradedPending", {
                  graded: formatNumber(item.gradedCount ?? 0),
                  pending: formatNumber(item.pendingGradeCount ?? 0),
                })}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-portal-muted">{t("admin.homework.created")}</dt>
              <dd className="mt-0.5 text-sm font-medium text-portal-heading">
                {formatDateTime(item.createdAt)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-portal px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl">
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={busy}
            onClick={() => onDelete(item)}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="size-4" aria-hidden />
            {t("admin.homework.deleteAssignment")}
          </Button>
        </div>
      </div>
    </div>
  );
}
