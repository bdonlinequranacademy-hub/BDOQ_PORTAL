import { Banknote, Clock, Hourglass, Wallet } from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import {
  pctOfTotal,
  type IAdminEarningsStats,
} from "@/features/admin/components/earnings/adminEarningsUtils";

interface IAdminEarningsStatsGridProps {
  stats: IAdminEarningsStats;
  isLoading?: boolean;
}

export function AdminEarningsStatsGrid({ stats, isLoading }: IAdminEarningsStatsGridProps) {
  const { t, formatBdt, formatNumber } = usePortalTranslation();

  const totalHint =
    stats.totalDeltaPct !== null
      ? t("admin.earnings.hintVsLastMonth", {
          pct: `${stats.totalDeltaPct >= 0 ? "+" : ""}${formatNumber(stats.totalDeltaPct)}`,
        })
      : t("admin.earnings.hintVerifiedPending");

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-4">
      <StatCard
        label={t("admin.earnings.statsTotal")}
        value={isLoading ? "—" : formatBdt(stats.totalCombinedBdt)}
        icon={<Wallet className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={totalHint}
      />
      <StatCard
        label={t("admin.earnings.statsVerified")}
        value={isLoading ? "—" : formatBdt(stats.verifiedBdt)}
        icon={<Banknote className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint={pctOfTotal(stats.verifiedBdt, stats.totalCombinedBdt, t)}
      />
      <StatCard
        label={t("admin.earnings.statsPending")}
        value={isLoading ? "—" : formatBdt(stats.pendingBdt)}
        icon={<Clock className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={pctOfTotal(stats.pendingBdt, stats.totalCombinedBdt, t)}
      />
      <StatCard
        label={t("admin.earnings.statsPendingSessions")}
        value={isLoading ? "—" : formatNumber(stats.pendingSessions)}
        icon={<Hourglass className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={t("admin.earnings.hintVerifiedSessions", {
          count: formatNumber(stats.verifiedSessions),
        })}
      />
    </div>
  );
}
