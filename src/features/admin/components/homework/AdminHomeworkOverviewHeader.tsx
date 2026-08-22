import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminHomeworkOverviewHeaderProps {
  onExport: () => void;
}

export function AdminHomeworkOverviewHeader({ onExport }: IAdminHomeworkOverviewHeaderProps) {
  const { t } = usePortalTranslation();

  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-portal-heading sm:text-2xl">
          {t("admin.homework.overviewTitle")}
        </h1>
        <p className="hidden mt-1 text-sm text-portal-muted sm:block">
          {t("admin.homework.overviewSubtitle")}
        </p>
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={onExport}
        className="inline-flex shrink-0 items-center gap-2 rounded-xl"
      >
        <Download className="size-4" aria-hidden />
        <span className="hidden sm:inline">{t("filters.export")}</span>
      </Button>
    </div>
  );
}
