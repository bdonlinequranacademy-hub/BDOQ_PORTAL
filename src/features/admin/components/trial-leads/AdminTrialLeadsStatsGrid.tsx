import {
  CalendarCheck,
  CheckCircle2,
  PhoneCall,
  UserPlus,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { IAdminTrialLeadsStats } from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";

interface IAdminTrialLeadsStatsGridProps {
  stats: IAdminTrialLeadsStats;
  isLoading?: boolean;
}

export function AdminTrialLeadsStatsGrid({
  stats,
  isLoading,
}: IAdminTrialLeadsStatsGridProps) {
  const { t, formatNumber } = usePortalTranslation();

  function pct(part: number, total: number): string {
    if (total <= 0) return t("stats.zeroOfTotal");
    const pctValue = Math.round((part / total) * 100);
    return t("stats.ofTotal", { pct: formatNumber(pctValue) });
  }

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label={t("admin.trialLeads.statsTotalLeads")}
        value={isLoading ? "—" : stats.total}
        icon={<Users className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisWeek > 0
            ? t("admin.trialLeads.hintNewThisWeek", {
                count: formatNumber(stats.newThisWeek),
              })
            : t("admin.trialLeads.hintAllTrialRequests")
        }
      />
      <StatCard
        label={t("admin.trialLeads.statsNewLeads")}
        value={isLoading ? "—" : stats.pending}
        icon={<UserPlus className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={
          stats.newToday > 0
            ? t("admin.trialLeads.hintNewToday", {
                count: formatNumber(stats.newToday),
              })
            : t("admin.trialLeads.hintAwaitingContact")
        }
      />
      <StatCard
        label={t("admin.trialLeads.statsContacted")}
        value={isLoading ? "—" : stats.contacted}
        icon={<PhoneCall className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        hint={pct(stats.contacted, stats.total)}
      />
      <StatCard
        label={t("admin.trialLeads.statsScheduled")}
        value={isLoading ? "—" : stats.scheduled}
        icon={<CalendarCheck className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={pct(stats.scheduled, stats.total)}
      />
      <StatCard
        label={t("admin.studentRequests.statsRejected")}
        value={isLoading ? "—" : stats.rejected}
        icon={<CheckCircle2 className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        className="col-span-2 xl:col-span-1"
        hint={pct(stats.rejected, stats.total)}
      />
    </div>
  );
}
