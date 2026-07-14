import {
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  FileText,
  Star,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import {
  formatBdt,
  pctOfTotal,
  type IAdminPricingStats,
} from "@/features/admin/components/pricing/adminPricingUtils";

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
  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 lg:grid-cols-5">
      <StatCard
        label="Total Packages"
        value={isLoading ? "—" : stats.total}
        icon={<CreditCard className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisMonth > 0
            ? `+${stats.newThisMonth} this month`
            : "All CMS packages"
        }
      />
      <StatCard
        label="Published"
        value={isLoading ? "—" : stats.published}
        icon={<CheckCircle2 className="size-5 text-orange-600" />}
        iconBg="bg-orange-100"
        hint={pctOfTotal(stats.published, stats.total)}
        onClick={onPublishedClick}
      />
      <StatCard
        label="Draft"
        value={isLoading ? "—" : stats.draft}
        icon={<FileText className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={pctOfTotal(stats.draft, stats.total)}
        onClick={onDraftClick}
      />
      <StatCard
        label="Popular"
        value={isLoading ? "—" : stats.popular}
        icon={<BadgeCheck className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint="Marked most popular"
        onClick={onPopularClick}
      />
      <StatCard
        label="Avg. Price"
        value={isLoading ? "—" : formatBdt(stats.avgPriceBdt)}
        icon={<Star className="size-5 text-gold-dark" />}
        iconBg="bg-gold/20"
        hint="Average package BDT"
        className="col-span-2 lg:col-span-1"
      />
    </div>
  );
}
