import { BookOpen, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminPricingLivePreviewProps {
  name: string;
  period: string;
  priceBdt: string;
  priceUsd: string;
  features: string[];
  popular: boolean;
  showOnWebsite: boolean;
}

export function AdminPricingLivePreview({
  name,
  period,
  priceBdt,
  priceUsd,
  features,
  popular,
  showOnWebsite,
}: IAdminPricingLivePreviewProps) {
  const { t, formatBdt, formatUsd, dynamicLabel } = usePortalTranslation();

  const bdt = Number(priceBdt);
  const usd = Number(priceUsd);
  const visibleFeatures = features.filter(Boolean).slice(0, 6);
  const periodLabel = period.trim() || dynamicLabel("monthly");

  return (
    <Card className="overflow-hidden rounded-2xl border border-portal bg-portal-surface p-0 shadow-[0_8px_24px_-16px_rgba(13,74,47,0.18)]">
      <div className="flex items-center justify-between border-b border-portal bg-amber-50/80 px-4 py-3">
        <h2 className="text-sm font-bold text-primary-dark">
          {t("admin.cms.shared.livePreview")}
        </h2>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
            showOnWebsite
              ? "bg-primary/15 text-primary-dark"
              : "bg-portal-muted/50 text-portal-muted"
          )}
        >
          {showOnWebsite
            ? t("admin.cms.shared.visibilityPublic")
            : t("admin.cms.shared.visibilityPrivate")}
        </span>
      </div>

      <div className="relative bg-gradient-to-b from-amber-50/90 to-white px-5 pb-5 pt-6 text-center">
        {popular ? (
          <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {t("admin.cms.shared.statPopular")}
          </span>
        ) : null}

        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold/25 shadow-sm">
          <BookOpen className="size-7 text-gold-dark" aria-hidden />
        </div>

        <h3 className="mt-4 font-display text-xl font-bold text-gold-dark">
          {name.trim() || t("admin.cms.pricing.packageName")}
        </h3>
        <p className="mt-1 text-xs text-portal-muted">
          {t("admin.cms.pricing.learningPackage", { period: periodLabel })}
        </p>

        <p className="mt-4 text-2xl font-bold text-primary">
          {Number.isFinite(bdt) && priceBdt !== "" ? formatBdt(bdt) : "—"}
          <span className="text-sm font-semibold text-portal-muted">
            {" "}
            {t("admin.cms.shared.perMonth")}
          </span>
        </p>
        {Number.isFinite(usd) && priceUsd !== "" ? (
          <p className="mt-0.5 text-xs text-portal-muted">{formatUsd(usd)}</p>
        ) : null}

        <ul className="mt-5 space-y-2 text-left">
          {visibleFeatures.length > 0 ? (
            visibleFeatures.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2 text-sm text-portal-heading"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-primary"
                  aria-hidden
                />
                <span className="line-clamp-2">{feature}</span>
              </li>
            ))
          ) : (
            <li className="text-center text-xs text-portal-muted">
              {t("admin.cms.pricing.featuresPlaceholder")}
            </li>
          )}
        </ul>

        <button
          type="button"
          tabIndex={-1}
          className="mt-5 w-full cursor-default rounded-full bg-primary py-2.5 text-sm font-semibold text-white"
        >
          {t("admin.cms.pricing.enrollNow")}
        </button>
      </div>
    </Card>
  );
}
