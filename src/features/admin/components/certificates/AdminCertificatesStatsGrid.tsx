import {
  Award,
  BadgeCheck,
  CalendarPlus,
  FileCheck2,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import {
  pctOfTotal,
  type ICertificateStats,
} from "@/features/admin/components/certificates/adminCertificatesUtils";

interface IAdminCertificatesStatsGridProps {
  stats: ICertificateStats;
}

export function AdminCertificatesStatsGrid({
  stats,
}: IAdminCertificatesStatsGridProps) {
  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 lg:grid-cols-4">
      <StatCard
        label="Total Certificates"
        value={stats.total}
        icon={<Award className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.thisMonth > 0
            ? `+${stats.thisMonth} this month`
            : "All generated certificates"
        }
      />
      <StatCard
        label="Issued"
        value={stats.issued}
        icon={<FileCheck2 className="size-5 text-sky-600" />}
        iconBg="bg-sky-100"
        hint={
          stats.thisMonth > 0
            ? `+${stats.thisMonth} this month`
            : "Saved to history"
        }
      />
      <StatCard
        label="With Badge"
        value={stats.withBadge}
        icon={<BadgeCheck className="size-5 text-gold-dark" />}
        iconBg="bg-gold/20"
        hint={pctOfTotal(stats.withBadge, stats.total)}
      />
      <StatCard
        label="This Month"
        value={stats.thisMonth}
        icon={<CalendarPlus className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint="Newly generated"
      />
    </div>
  );
}
