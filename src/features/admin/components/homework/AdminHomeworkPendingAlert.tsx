import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminHomeworkPendingAlertProps {
  awaitingGradeCount: number;
  overdueCount: number;
  onReviewAwaitingGrade: () => void;
  onReviewOverdue: () => void;
}

export function AdminHomeworkPendingAlert({
  awaitingGradeCount,
  overdueCount,
  onReviewAwaitingGrade,
  onReviewOverdue,
}: IAdminHomeworkPendingAlertProps) {
  const { t, formatNumber } = usePortalTranslation();

  if (awaitingGradeCount <= 0 && overdueCount <= 0) return null;

  return (
    <Card className="flex flex-col gap-3 rounded-2xl border border-amber-500/30 bg-amber-50/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
          <AlertTriangle className="size-5 text-amber-700" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-900">
            {t("admin.homework.actionNeeded")}
          </p>
          <p className="mt-0.5 text-sm text-amber-800/90">
            {awaitingGradeCount > 0
              ? t("admin.homework.awaitingGradeSubmissions", {
                  count: formatNumber(awaitingGradeCount),
                })
              : null}
            {awaitingGradeCount > 0 && overdueCount > 0 ? " " : null}
            {overdueCount > 0
              ? t("admin.homework.overdueAssignments", {
                  count: formatNumber(overdueCount),
                })
              : null}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {awaitingGradeCount > 0 ? (
          <button
            type="button"
            onClick={onReviewAwaitingGrade}
            className="inline-flex h-9 items-center justify-center rounded-xl bg-amber-700 px-4 text-sm font-semibold text-white transition hover:bg-amber-800"
          >
            {t("admin.homework.reviewAwaitingGrade")}
          </button>
        ) : null}
        {overdueCount > 0 ? (
          <button
            type="button"
            onClick={onReviewOverdue}
            className="inline-flex h-9 items-center justify-center rounded-xl border border-amber-700/30 bg-white px-4 text-sm font-semibold text-amber-900 transition hover:border-amber-700/50"
          >
            {t("actions.viewOverdue")}
          </button>
        ) : null}
      </div>
    </Card>
  );
}
