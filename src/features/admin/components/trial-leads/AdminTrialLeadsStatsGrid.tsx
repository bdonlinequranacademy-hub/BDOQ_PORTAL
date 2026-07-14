import {
  CalendarCheck,
  CheckCircle2,
  PhoneCall,
  UserPlus,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import type { IAdminTrialLeadsStats } from "@/features/admin/components/trial-leads/adminTrialLeadsUtils";

interface IAdminTrialLeadsStatsGridProps {
  stats: IAdminTrialLeadsStats;
  isLoading?: boolean;
}

function pct(part: number, total: number): string {
  if (total <= 0) return "0% of total";
  return `${Math.round((part / total) * 100)}% of total`;
}

export function AdminTrialLeadsStatsGrid({
  stats,
  isLoading,
}: IAdminTrialLeadsStatsGridProps) {
  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label="Total Leads"
        value={isLoading ? "—" : stats.total}
        icon={<Users className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={stats.newThisWeek > 0 ? `+${stats.newThisWeek} this week` : "All trial requests"}
      />
      <StatCard
        label="New Leads"
        value={isLoading ? "—" : stats.new}
        icon={<UserPlus className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={stats.newToday > 0 ? `+${stats.newToday} today` : "Awaiting contact"}
      />
      <StatCard
        label="Contacted"
        value={isLoading ? "—" : stats.contacted}
        icon={<PhoneCall className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        hint={pct(stats.contacted, stats.total)}
      />
      <StatCard
        label="Scheduled"
        value={isLoading ? "—" : stats.scheduled}
        icon={<CalendarCheck className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={pct(stats.scheduled, stats.total)}
      />
      <StatCard
        label="Closed"
        value={isLoading ? "—" : stats.closed}
        icon={<CheckCircle2 className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        className="col-span-2 xl:col-span-1"
        hint={pct(stats.closed, stats.total)}
      />
    </div>
  );
}
