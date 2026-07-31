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
    <div className="portal-card-islamic portal-card--lg relative overflow-hidden rounded-2xl border border-portal bg-portal-surface px-5 py-6 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)] sm:px-8 sm:py-8">
      <div
        className="pointer-events-none absolute -right-8 -top-10 size-56 rounded-full bg-primary/8 blur-2xl sm:size-72"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-32 w-[min(100%,42rem)] -translate-x-1/2 opacity-[0.14] sm:h-40"
        style={{
          backgroundImage: "url('/brand/islamic-shape-bg.png')",
          backgroundSize: "contain",
          backgroundPosition: "center bottom",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {t("admin.cms.shared.publicWebsite")}
          </p>
          <h1 className="portal-page-title mt-1 font-display text-2xl font-bold text-primary-dark sm:text-3xl">
            {nav("/admin/testimonials")}
          </h1>
          <p className="portal-page-subtitle mt-2 max-w-2xl text-sm text-portal-muted sm:text-base">
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
            {t("admin.common.newReview")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onExport}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-portal bg-portal-surface/80 px-4 backdrop-blur-sm"
          >
            <Download className="size-4" aria-hidden />
            {t("admin.cms.shared.exportReport")}
            <ChevronDown className="size-3.5 opacity-60" aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
