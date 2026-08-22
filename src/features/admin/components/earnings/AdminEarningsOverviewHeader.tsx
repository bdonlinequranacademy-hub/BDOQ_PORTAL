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
    <div className="mb-4 flex items-center justify-between gap-2">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-portal-heading sm:text-2xl">
          {t("admin.earnings.title")}
        </h1>
        <p className="hidden mt-1 text-sm text-portal-muted sm:block">
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
          variant="secondary"
          onClick={onExport}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl"
        >
          <Download className="size-4" aria-hidden />
          <span className="hidden sm:inline">{t("admin.common.export")}</span>
        </Button>
      </div>
    </div>
  );
}
