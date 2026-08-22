import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import { formControlClass } from "@/lib/formControl";
import { cn } from "@/lib/utils/cn";

interface IAdminEarningsOverviewHeaderProps {
  month: string;
  onMonthChange: (month: string) => void;
  onExport: () => void;
}

export function AdminEarningsOverviewHeader({
  month,
  onMonthChange,
  onExport,
}: IAdminEarningsOverviewHeaderProps) {
  const { t } = usePortalTranslation();

  return (
    <div className="portal-card-islamic portal-card--lg relative overflow-hidden rounded-2xl border border-portal bg-portal-surface px-5 py-6 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:px-8 sm:py-8">
      <div
        className="pointer-events-none absolute -right-8 -top-10 size-56 rounded-full bg-primary/8 blur-2xl sm:size-72"
        aria-hidden
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {t("admin.earnings.title")}
          </p>
          <h1 className="portal-page-title mt-1 font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            {t("admin.earnings.title")}
          </h1>
          <p className="portal-page-subtitle mt-2 max-w-2xl text-sm text-portal-muted sm:text-base">
            {t("admin.earnings.subtitle")}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="month"
            value={month}
            onChange={(event) => onMonthChange(event.target.value)}
            className={cn(formControlClass, "h-10 min-h-10 w-full py-2 text-sm shadow-none sm:w-auto")}
            aria-label={t("admin.earnings.headerSelectMonth")}
          />
          <Button
            type="button"
            variant="ghost"
            onClick={onExport}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-portal bg-portal-surface/80 px-4 backdrop-blur-sm"
          >
            <Download className="size-4" aria-hidden />
            {t("admin.common.export")}
          </Button>
        </div>
      </div>
    </div>
  );
}
