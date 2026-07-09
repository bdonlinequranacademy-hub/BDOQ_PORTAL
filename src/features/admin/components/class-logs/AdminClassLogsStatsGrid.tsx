import {
  Banknote,
  CheckCircle2,
  ClipboardList,
  Clock,
  XCircle,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import type { IAdminClassLogsStats } from "@/features/admin/components/class-logs/adminClassLogsUtils";

interface IAdminClassLogsStatsGridProps {
  stats: IAdminClassLogsStats;
  isLoading?: boolean;
}

export function AdminClassLogsStatsGrid({
  stats,
  isLoading,
}: IAdminClassLogsStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
      <StatCard
        label="Total Logs"
        value={isLoading ? "—" : stats.total}
        icon={<ClipboardList className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint="All session logs"
      />
      <StatCard
        label="Pending Approval"
        value={isLoading ? "—" : stats.pending}
        icon={<Clock className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint="Awaiting review"
      />
      <StatCard
        label="Approved"
        value={isLoading ? "—" : stats.approved}
        icon={<CheckCircle2 className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint="Verified sessions"
      />
      <StatCard
        label="Rejected"
        value={isLoading ? "—" : stats.rejected}
        icon={<XCircle className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        hint="Needs correction"
      />
      <StatCard
        label="Avg. Session Rate"
        value={
          isLoading
            ? "—"
            : stats.avgSessionRate != null
              ? `৳${stats.avgSessionRate}`
              : "—"
        }
        icon={<Banknote className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        className="col-span-2 xl:col-span-1"
        hint="Approved logs average"
      />
    </div>
  );
}
