import { Clock, Eye, MessageSquareQuote, Star, Trophy } from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import {
  pctOfTotal,
  type IAdminTestimonialsStats,
} from "@/features/admin/components/testimonials/adminTestimonialsUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminTestimonialsStatsGridProps {
  stats: IAdminTestimonialsStats;
  isLoading?: boolean;
  onPublishedClick?: () => void;
  onPendingClick?: () => void;
  onFeaturedClick?: () => void;
}

export function AdminTestimonialsStatsGrid({
  stats,
  isLoading,
  onPublishedClick,
  onPendingClick,
  onFeaturedClick,
}: IAdminTestimonialsStatsGridProps) {
  const { t, formatNumber } = usePortalTranslation();

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 lg:grid-cols-5">
      <StatCard
        label={t("admin.cms.testimonials.statsTotalReviews")}
        value={isLoading ? "—" : stats.total}
        icon={<MessageSquareQuote className="size-4 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisMonth > 0
            ? t("stats.thisMonth", { count: formatNumber(stats.newThisMonth) })
            : t("admin.cms.testimonials.hintAllReviews")
        }
      />
      <StatCard
        label={t("admin.common.statPublished")}
        value={isLoading ? "—" : stats.published}
        icon={<Eye className="size-4 text-orange-600" />}
        iconBg="bg-orange-100"
        hint={pctOfTotal(stats.published, stats.total, t)}
        onClick={onPublishedClick}
      />
      <StatCard
        label={t("shared.status.pending")}
        value={isLoading ? "—" : stats.pending}
        icon={<Clock className="size-4 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={pctOfTotal(stats.pending, stats.total, t)}
        onClick={onPendingClick}
      />
      <StatCard
        label={t("admin.cms.shared.statFeatured")}
        value={isLoading ? "—" : stats.featured}
        icon={<Trophy className="size-4 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={t("admin.cms.testimonials.featuredHint")}
        onClick={onFeaturedClick}
      />
      <StatCard
        label={t("admin.cms.testimonials.avgRating")}
        value={
          isLoading
            ? "—"
            : `${stats.avgRating}${stats.avgRating === "—" ? "" : " / 5"}`
        }
        icon={<Star className="size-4 text-gold-dark" />}
        iconBg="bg-gold/20"
        hint={t("admin.cms.testimonials.avgRatingHint")}
        className="col-span-2 lg:col-span-1"
      />
    </div>
  );
}
