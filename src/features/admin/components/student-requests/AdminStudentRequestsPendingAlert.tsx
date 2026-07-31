import { ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminStudentRequestsPendingAlertProps {
  pendingCount: number;
  onReview: () => void;
}

export function AdminStudentRequestsPendingAlert({
  pendingCount,
  onReview,
}: IAdminStudentRequestsPendingAlertProps) {
  const { t, formatNumber } = usePortalTranslation();

  if (pendingCount <= 0) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-amber-500/25 bg-gradient-to-r",
        "from-amber-500/[0.08] via-amber-500/[0.04] to-portal-surface p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"
      )}
      role="status"
    >
      <div className="flex items-start gap-3 sm:items-center">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700">
          <Clock className="size-5" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-portal-heading">
            {t("admin.studentRequests.alertTitle")}
          </p>
          <p className="mt-0.5 text-sm text-portal-muted">
            {t("admin.studentRequests.alertBody", { count: formatNumber(pendingCount) })}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReview}
        className="inline-flex shrink-0 items-center justify-center gap-1 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700"
      >
        {t("admin.studentRequests.alertCta")}
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </div>
  );
}
