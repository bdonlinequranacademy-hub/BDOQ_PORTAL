import { BarChart3, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/Card";
import type { AdminClass, AttendanceOverview } from "@/types/models";
import {
  findClassForRow,
  getTeacherName,
} from "@/features/admin/components/attendance/adminAttendanceUtils";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminAttendanceTableProps {
  rows: AttendanceOverview[];
  classes: AdminClass[];
  totalCount: number;
}

const actionClass =
  "inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:border-primary/30 hover:text-primary";

export function AdminAttendanceTable({
  rows,
  classes,
  totalCount,
}: IAdminAttendanceTableProps) {
  const { t, formatNumber } = usePortalTranslation();

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-center justify-between border-b border-portal px-5 py-4">
        <h2 className="text-sm font-bold text-portal-heading">
          {t("admin.attendance.classAttendanceCount", {
            count: formatNumber(totalCount),
          })}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/40 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3.5">{t("tables.class")}</th>
              <th className="px-5 py-3.5">{t("tables.teacher")}</th>
              <th className="px-5 py-3.5">{t("tables.records")}</th>
              <th className="px-5 py-3.5">{t("tables.present")}</th>
              <th className="px-5 py-3.5">{t("tables.absent")}</th>
              <th className="px-5 py-3.5">{t("tables.attendancePct")}</th>
              <th className="px-5 py-3.5 text-right">{t("tables.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-portal-muted">
                  {t("admin.attendance.noRowsMatch")}
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const cls = findClassForRow(classes, row);
                const classId = cls?._id;
                const pctClass =
                  row.percentage >= 80
                    ? "text-emerald-700"
                    : row.percentage >= 60
                      ? "text-amber-700"
                      : "text-red-600";

                return (
                  <tr
                    key={`${row.class.title}-${row.total}`}
                    className="border-b border-portal/80 transition hover:bg-portal-muted/25"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-portal-heading">{row.class.title}</p>
                    </td>
                    <td className="px-5 py-4 text-portal-heading">{getTeacherName(cls)}</td>
                    <td className="px-5 py-4 tabular-nums text-portal-heading">
                      {formatNumber(row.total)}
                    </td>
                    <td className="px-5 py-4 tabular-nums font-medium text-emerald-700">
                      {formatNumber(row.present)}
                    </td>
                    <td className="px-5 py-4 tabular-nums font-medium text-red-600">
                      {formatNumber(row.absent)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex min-w-[120px] items-center gap-2">
                        <span className={cn("font-semibold tabular-nums", pctClass)}>
                          {formatNumber(row.percentage)}%
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-portal-muted/50">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${row.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {classId ? (
                          <Link
                            to={`/admin/classes/${classId}`}
                            className={actionClass}
                            aria-label={t("admin.homework.viewAssignment", {
                              title: row.class.title,
                            })}
                            title={t("actions.viewClass")}
                          >
                            <Eye className="size-4" aria-hidden />
                          </Link>
                        ) : null}
                        {classId ? (
                          <Link
                            to={`/admin/classes/${classId}?tab=attendance`}
                            className={actionClass}
                            aria-label={t("actions.classAttendance")}
                            title={t("actions.classAttendance")}
                          >
                            <BarChart3 className="size-4" aria-hidden />
                          </Link>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
