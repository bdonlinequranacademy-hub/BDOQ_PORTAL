import { Clock, Eye, MessageSquareQuote, Star, Trophy } from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import {
  pctOfTotal,
  type IAdminTestimonialsStats,
} from "@/features/admin/components/testimonials/adminTestimonialsUtils";

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
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
      <StatCard
        label="Total Reviews"
        value={isLoading ? "—" : stats.total}
        icon={<MessageSquareQuote className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisMonth > 0
            ? `+${stats.newThisMonth} this month`
            : "All student testimonials"
        }
      />
      <StatCard
        label="Published"
        value={isLoading ? "—" : stats.published}
        icon={<Eye className="size-5 text-orange-600" />}
        iconBg="bg-orange-100"
        hint={pctOfTotal(stats.published, stats.total)}
        onClick={onPublishedClick}
      />
      <StatCard
        label="Pending"
        value={isLoading ? "—" : stats.pending}
        icon={<Clock className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={pctOfTotal(stats.pending, stats.total)}
        onClick={onPendingClick}
      />
      <StatCard
        label="Featured"
        value={isLoading ? "—" : stats.featured}
        icon={<Trophy className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint="5★ & on website"
        onClick={onFeaturedClick}
      />
      <StatCard
        label="Avg. Rating"
        value={isLoading ? "—" : `${stats.avgRating}${stats.avgRating === "—" ? "" : " / 5"}`}
        icon={<Star className="size-5 text-gold-dark" />}
        iconBg="bg-gold/20"
        hint="Across all reviews"
        className="col-span-2 lg:col-span-1"
      />
    </div>
  );
}
