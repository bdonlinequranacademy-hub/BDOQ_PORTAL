import { AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminEarningsPendingAlertProps {
  pendingCount: number;
  onReview: () => void;
}

export function AdminEarningsPendingAlert({
  pendingCount,
  onReview,
}: IAdminEarningsPendingAlertProps) {
  const { t, formatNumber } = usePortalTranslation();

  if (pendingCount <= 0) return null;

  return (
    <Card className="flex flex-col gap-3 rounded-2xl border border-amber-500/30 bg-amber-50/80 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
          <AlertTriangle className="size-5 text-amber-700" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-900">{t("admin.earnings.pendingAlertTitle")}</p>
          <p className="mt-0.5 text-sm text-amber-800/90">
            {t("admin.earnings.pendingAlertBody", { count: formatNumber(pendingCount) })}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onReview}
        className="inline-flex h-9 items-center justify-center rounded-xl bg-amber-700 px-4 text-sm font-semibold text-white transition hover:bg-amber-800"
      >
        {t("admin.earnings.pendingAlertCta")}
      </button>
    </Card>
  );
}
