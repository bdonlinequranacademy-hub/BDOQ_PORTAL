import {
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  PieChart,
  XCircle,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import type { IAdminStudentAdmissionsStats } from "@/features/admin/components/student-admissions/adminStudentAdmissionsUtils";

interface IAdminStudentAdmissionsStatsGridProps {
  stats: IAdminStudentAdmissionsStats;
  isLoading?: boolean;
}

function pct(part: number, total: number): string {
  if (total <= 0) return "0% of total";
  return `${Math.round((part / total) * 100)}% of total`;
}

export function AdminStudentAdmissionsStatsGrid({
  stats,
  isLoading,
}: IAdminStudentAdmissionsStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
      <StatCard
        label="Total applications"
        value={isLoading ? "—" : stats.total}
        icon={<GraduationCap className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={stats.newThisWeek > 0 ? `+${stats.newThisWeek} this week` : "All submissions"}
      />
      <StatCard
        label="Under review"
        value={isLoading ? "—" : stats.underReview}
        icon={<ClipboardList className="size-5 text-orange-600" />}
        iconBg="bg-orange-100"
        hint={stats.new > 0 ? `${stats.new} new` : pct(stats.underReview, stats.total)}
      />
      <StatCard
        label="Approved"
        value={isLoading ? "—" : stats.approved}
        icon={<CheckCircle2 className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint={pct(stats.approved, stats.total)}
      />
      <StatCard
        label="Closed"
        value={isLoading ? "—" : stats.closed}
        icon={<XCircle className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        hint={pct(stats.closed, stats.total)}
      />
      <StatCard
        label="Conversion rate"
        value={isLoading ? "—" : `${stats.conversionRate}%`}
        icon={<PieChart className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        className="col-span-2 xl:col-span-1"
        hint={`${stats.approved} approved / ${stats.total} total`}
      />
    </div>
  );
}
