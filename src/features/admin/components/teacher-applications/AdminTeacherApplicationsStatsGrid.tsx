import {
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Lock,
  XCircle,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import type { IAdminTeacherApplicationsStats } from "@/features/admin/components/teacher-applications/adminTeacherApplicationsUtils";
import { teacherApplicationsStatHint } from "@/features/admin/components/teacher-applications/adminTeacherApplicationsUtils";

interface IAdminTeacherApplicationsStatsGridProps {
  stats: IAdminTeacherApplicationsStats;
  isLoading?: boolean;
}

export function AdminTeacherApplicationsStatsGrid({
  stats,
  isLoading,
}: IAdminTeacherApplicationsStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
      <StatCard
        label="Total applications"
        value={isLoading ? "—" : stats.total}
        icon={<Briefcase className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={stats.newThisWeek > 0 ? `+${stats.newThisWeek} this week` : "All submissions"}
      />
      <StatCard
        label="Under review"
        value={isLoading ? "—" : stats.underReview}
        icon={<ClipboardList className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        hint={teacherApplicationsStatHint("underReview", stats)}
      />
      <StatCard
        label="Approved"
        value={isLoading ? "—" : stats.approved}
        icon={<CheckCircle2 className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint={teacherApplicationsStatHint("approved", stats)}
      />
      <StatCard
        label="Rejected"
        value={isLoading ? "—" : stats.rejected}
        icon={<XCircle className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        hint={teacherApplicationsStatHint("rejected", stats)}
      />
      <StatCard
        label="Closed"
        value={isLoading ? "—" : stats.closed}
        icon={<Lock className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        className="col-span-2 xl:col-span-1"
        hint={teacherApplicationsStatHint("closed", stats)}
      />
    </div>
  );
}
