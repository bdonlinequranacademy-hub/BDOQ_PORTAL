
import { usePortalTranslation } from "@/i18n/LocaleProvider";

export function AdminPricingOverviewHeader() {
  const { t } = usePortalTranslation();

  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-portal-heading sm:text-2xl">
          {t("admin.cms.pricing.title")}
        </h1>
        <p className="hidden mt-1 text-sm text-portal-muted sm:block">
          {t("admin.cms.pricing.overviewSubtitle")}
        </p>
      </div>
    </div>
  );
}
