import { ArrowRight, Check, Eye, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { UserInitialAvatar } from "@/components/ui/UserInitialAvatar";
import { ClassLogStatusBadge } from "@/components/schedule/ClassLogStatusBadge";
import type { ClassLogView } from "@/types/models";
import { getProgramLabel } from "@/features/admin/components/earnings/adminEarningsUtils";
import { formatLogDateLabel } from "@/features/admin/components/class-logs/adminClassLogsUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminEarningsPendingTableProps {
  logs: ClassLogView[];
  busy: boolean;
  onView: (log: ClassLogView) => void;
  onApprove: (log: ClassLogView) => void;
  onViewAll: () => void;
}

const actionClass =
  "inline-flex size-8 items-center justify-center rounded-lg border border-portal text-portal-muted transition hover:border-primary/30 hover:text-primary";

export function AdminEarningsPendingTable({
  logs,
  busy,
  onView,
  onApprove,
  onViewAll,
}: IAdminEarningsPendingTableProps) {
  const { t, formatBdt, formatNumber } = usePortalTranslation();
  const visible = logs.slice(0, 5);
  if (visible.length === 0) return null;

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-center justify-between border-b border-portal px-5 py-4">
        <div>
          <h2 className="text-sm font-bold text-portal-heading">
            {t("admin.earnings.pendingTableTitle")}
          </h2>
          <p className="mt-0.5 text-xs text-portal-muted">{t("admin.earnings.pendingAlertBody", { count: formatNumber(logs.length) })}</p>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
          {formatNumber(logs.length)}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-portal bg-portal-muted/30 text-xs font-semibold uppercase tracking-wide text-portal-muted">
              <th className="px-5 py-3">{t("shared.schedule.sessionDate")}</th>
              <th className="px-5 py-3">{t("admin.earnings.pendingTableTeacher")}</th>
              <th className="px-5 py-3">{t("admin.earnings.pendingTableSession")}</th>
              <th className="px-5 py-3">{t("labels.duration")}</th>
              <th className="px-5 py-3">{t("admin.earnings.pendingTableAmount")}</th>
              <th className="px-5 py-3">{t("admin.trialLeads.tableStatus")}</th>
              <th className="px-5 py-3 text-right">{t("admin.earnings.pendingTableActions")}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((log) => (
              <tr key={log._id} className="border-b border-portal/80 bg-amber-50/25 last:border-b-0">
                <td className="px-5 py-3.5">
                  <p className="text-xs font-bold tracking-wide text-portal-muted">
                    {formatLogDateLabel(log.sessionDate)}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <UserInitialAvatar name={log.teacher.name} size="sm" />
                    <span className="font-semibold text-portal-heading">{log.teacher.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-portal-heading">{log.classTitle}</p>
                  <p className="text-xs text-portal-muted">{getProgramLabel(log)}</p>
                </td>
                <td className="px-5 py-3.5 text-portal-heading">{log.durationLabel}</td>
                <td className="px-5 py-3.5 font-semibold text-portal-heading">
                  {log.earningsBdt != null ? formatBdt(log.earningsBdt) : "—"}
                </td>
                <td className="px-5 py-3.5">
                  <ClassLogStatusBadge status={log.status} />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onView(log)}
                      className={actionClass}
                      aria-label={t("admin.admissions.viewApplication")}
                    >
                      <Eye className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => onApprove(log)}
                      disabled={busy}
                      className={actionClass}
                      aria-label={t("admin.admissions.actionApprove")}
                    >
                      <Check className="size-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => onView(log)}
                      className={actionClass}
                      aria-label={t("admin.classDetail.moreActionsFor", { title: log.teacher.name })}
                    >
                      <MoreHorizontal className="size-4" aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {logs.length > 5 ? (
        <div className="border-t border-portal px-5 py-3">
          <button
            type="button"
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
          >
            {t("admin.earnings.pendingAlertCta")}
            <ArrowRight className="size-3.5" aria-hidden />
          </button>
        </div>
      ) : null}
    </Card>
  );
}
