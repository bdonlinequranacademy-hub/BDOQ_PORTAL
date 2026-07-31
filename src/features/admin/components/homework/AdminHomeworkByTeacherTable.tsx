import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import type { IHomeworkTeacherRow } from "@/features/admin/components/homework/adminHomeworkUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminHomeworkByTeacherTableProps {
  rows: IHomeworkTeacherRow[];
  onViewAll?: () => void;
}

export function AdminHomeworkByTeacherTable({
  rows,
  onViewAll,
}: IAdminHomeworkByTeacherTableProps) {
  const { t, formatNumber } = usePortalTranslation();
  const visible = rows.slice(0, 5);

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-center justify-between border-b border-portal px-5 py-4">
        <h2 className="text-sm font-bold text-portal-heading">
          {t("admin.homework.byTeacher")}
        </h2>
        {onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {t("actions.viewAll")}
          </button>
        ) : null}
      </div>
      <div className="min-h-0 flex-1 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/30 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3">{t("tables.teacher")}</th>
              <th className="px-3 py-3">{t("tables.assignments")}</th>
              <th className="px-3 py-3">{t("tables.submitted")}</th>
              <th className="px-3 py-3">{t("tables.pending")}</th>
              <th className="px-5 py-3 text-right">{t("tables.graded")}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-sm text-portal-muted">
                  {t("admin.homework.noTeacherData")}
                </td>
              </tr>
            ) : (
              visible.map((row) => (
                <tr key={row.teacherId} className="border-b border-portal/80 last:border-b-0">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <UserInitialAvatar name={row.teacherName} size="sm" />
                      <span className="font-semibold text-portal-heading">{row.teacherName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 tabular-nums text-portal-heading">
                    {formatNumber(row.assignmentCount)}
                  </td>
                  <td className="px-3 py-3.5 tabular-nums text-portal-heading">
                    {formatNumber(row.submissions)}
                  </td>
                  <td className="px-3 py-3.5 tabular-nums font-medium text-amber-700">
                    {formatNumber(row.pendingGrade)}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums font-semibold text-emerald-700">
                    {formatNumber(row.graded)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {rows.length > 5 && onViewAll ? (
        <div className="border-t border-portal px-5 py-3">
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
          >
            {t("admin.homework.viewAllTeachers")}
            <ArrowRight className="size-3.5" aria-hidden />
          </button>
        </div>
      ) : null}
    </Card>
  );
}
