import { Banknote, Clock, Hourglass, Wallet } from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import {
  formatEarningsAmount,
  pctOfTotal,
  type IAdminEarningsStats,
} from "@/features/admin/components/earnings/adminEarningsUtils";

interface IAdminEarningsStatsGridProps {
  stats: IAdminEarningsStats;
  isLoading?: boolean;
}

export function AdminEarningsStatsGrid({ stats, isLoading }: IAdminEarningsStatsGridProps) {
  const totalHint =
    stats.totalDeltaPct !== null
      ? `${stats.totalDeltaPct >= 0 ? "+" : ""}${stats.totalDeltaPct}% vs last month`
      : "Verified + pending estimate";

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <StatCard
        label="Total Earnings"
        value={isLoading ? "—" : formatEarningsAmount(stats.totalCombinedBdt)}
        icon={<Wallet className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={totalHint}
      />
      <StatCard
        label="Verified Pay"
        value={isLoading ? "—" : formatEarningsAmount(stats.verifiedBdt)}
        icon={<Banknote className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint={pctOfTotal(stats.verifiedBdt, stats.totalCombinedBdt)}
      />
      <StatCard
        label="Pending Approval"
        value={isLoading ? "—" : formatEarningsAmount(stats.pendingBdt)}
        icon={<Clock className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={pctOfTotal(stats.pendingBdt, stats.totalCombinedBdt)}
      />
      <StatCard
        label="Pending Sessions"
        value={isLoading ? "—" : stats.pendingSessions}
        icon={<Hourglass className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={`${stats.verifiedSessions} verified this month`}
      />
    </div>
  );
}
