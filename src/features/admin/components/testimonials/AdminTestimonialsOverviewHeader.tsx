import { ChevronDown, Download, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminTestimonialsOverviewHeaderProps {
  onExport: () => void;
}

export function AdminTestimonialsOverviewHeader({
  onExport,
}: IAdminTestimonialsOverviewHeaderProps) {
  const { t, nav } = usePortalTranslation();
  const navigate = useNavigate();

  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-portal-heading sm:text-2xl">
          {nav("/admin/testimonials")}
        </h1>
        <p className="hidden mt-1 text-sm text-portal-muted sm:block">
          {t("admin.cms.testimonials.overviewSubtitle")}
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          type="button"
          onClick={() => navigate("/admin/testimonials/new")}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary-dark px-4 text-white hover:bg-primary-dark/90"
        >
          <Plus className="size-4" aria-hidden />
          <span className="hidden sm:inline">{t("admin.common.newReview")}</span>
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onExport}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl px-4"
        >
          <Download className="size-4" aria-hidden />
          <span className="hidden sm:inline">{t("admin.cms.shared.exportReport")}</span>
          <ChevronDown className="size-3.5 opacity-60 hidden sm:block" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
