import {
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  FileText,
  Star,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import {
  pctOfTotal,
  type IAdminPricingStats,
} from "@/features/admin/components/pricing/adminPricingUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminPricingStatsGridProps {
  stats: IAdminPricingStats;
  isLoading?: boolean;
  onPublishedClick?: () => void;
  onDraftClick?: () => void;
  onPopularClick?: () => void;
}

export function AdminPricingStatsGrid({
  stats,
  isLoading,
  onPublishedClick,
  onDraftClick,
  onPopularClick,
}: IAdminPricingStatsGridProps) {
  const { t, formatBdt, formatNumber } = usePortalTranslation();

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 lg:grid-cols-5">
      <StatCard
        label={t("admin.cms.pricing.statsTotalPackages")}
        value={isLoading ? "—" : stats.total}
        icon={<CreditCard className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisMonth > 0
            ? t("stats.thisMonth", { count: formatNumber(stats.newThisMonth) })
            : t("admin.cms.pricing.hintAllPackages")
        }
      />
      <StatCard
        label={t("admin.common.statPublished")}
        value={isLoading ? "—" : stats.published}
        icon={<CheckCircle2 className="size-5 text-orange-600" />}
        iconBg="bg-orange-100"
        hint={pctOfTotal(stats.published, stats.total, t)}
        onClick={onPublishedClick}
      />
      <StatCard
        label={t("admin.common.statDraft")}
        value={isLoading ? "—" : stats.draft}
        icon={<FileText className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={pctOfTotal(stats.draft, stats.total, t)}
        onClick={onDraftClick}
      />
      <StatCard
        label={t("admin.cms.shared.statPopular")}
        value={isLoading ? "—" : stats.popular}
        icon={<BadgeCheck className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={t("admin.cms.pricing.markedPopular")}
        onClick={onPopularClick}
      />
      <StatCard
        label={t("admin.cms.pricing.avgPrice")}
        value={isLoading ? "—" : formatBdt(stats.avgPriceBdt)}
        icon={<Star className="size-5 text-gold-dark" />}
        iconBg="bg-gold/20"
        hint={t("admin.cms.pricing.avgPriceHint")}
        className="col-span-2 lg:col-span-1"
      />
    </div>
  );
}
