import { ArrowRight, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { AdminHomeworkItem } from "@/types/models";
import { HomeworkGradingStatusBadge } from "@/features/admin/components/homework/HomeworkGradingStatusBadge";
import {
  getHomeworkClassTitle,
  getHomeworkGradingStatus,
  getHomeworkTeacherName,
} from "@/features/admin/components/homework/adminHomeworkUtils";
import { formatHomeworkDueLabel } from "@/lib/homeworkDue";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminHomeworkPendingTableProps {
  items: AdminHomeworkItem[];
  busy: boolean;
  onView: (item: AdminHomeworkItem) => void;
  onDelete: (item: AdminHomeworkItem) => void;
  onViewAll: () => void;
}

const actionClass =
  "inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:border-primary/30 hover:text-primary";

export function AdminHomeworkPendingTable({
  items,
  busy,
  onView,
  onDelete,
  onViewAll,
}: IAdminHomeworkPendingTableProps) {
  const { t, formatDate, formatNumber } = usePortalTranslation();
  const visible = items.slice(0, 5);

  if (visible.length === 0) return null;

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-center justify-between border-b border-portal px-5 py-4">
        <div>
          <h2 className="text-sm font-bold text-portal-heading">
            {t("admin.homework.pendingTableTitle")}
          </h2>
          <p className="mt-0.5 text-xs text-portal-muted">
            {t("admin.homework.pendingTableSubtitle")}
          </p>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
          {formatNumber(items.length)}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/30 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3">{t("tables.dueDate")}</th>
              <th className="px-5 py-3">{t("tables.assignment")}</th>
              <th className="px-5 py-3">{t("tables.teacher")}</th>
              <th className="px-5 py-3">{t("tables.class")}</th>
              <th className="px-5 py-3">{t("tables.pending")}</th>
              <th className="px-5 py-3">{t("tables.status")}</th>
              <th className="px-5 py-3 text-right">{t("tables.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => {
              const status = getHomeworkGradingStatus(item);

              return (
                <tr key={item._id} className="border-b border-portal/80 bg-amber-50/25 last:border-b-0">
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-bold tracking-wide text-portal-muted">
                      {formatDate(item.dueDate)}
                    </p>
                    <p className="text-sm font-semibold text-portal-heading">
                      {formatHomeworkDueLabel(item.dueDate, undefined, { t, formatDate })}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-portal-heading">{item.title}</p>
                  </td>
                  <td className="px-5 py-3.5 text-portal-heading">{getHomeworkTeacherName(item)}</td>
                  <td className="px-5 py-3.5 text-portal-muted">{getHomeworkClassTitle(item)}</td>
                  <td className="px-5 py-3.5 font-semibold tabular-nums text-amber-700">
                    {formatNumber(item.pendingGradeCount ?? 0)}
                  </td>
                  <td className="px-5 py-3.5">
                    <HomeworkGradingStatusBadge status={status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView(item)}
                        className={actionClass}
                        aria-label={t("admin.homework.viewAssignment", { title: item.title })}
                      >
                        <Eye className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        disabled={busy}
                        className={actionClass}
                        aria-label={t("admin.homework.deleteAssignmentAria", { title: item.title })}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        onClick={() => onView(item)}
                        className={actionClass}
                        aria-label={t("admin.homework.moreActionsFor", { title: item.title })}
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
      {items.length > 5 ? (
        <div className="border-t border-portal px-5 py-3">
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
          >
            {t("admin.homework.viewAllAwaitingGrade")}
            <ArrowRight className="size-3.5" aria-hidden />
          </button>
        </div>
      ) : null}
    </Card>
  );
}
