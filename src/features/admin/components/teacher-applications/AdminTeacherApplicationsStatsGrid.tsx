import {
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Lock,
  XCircle,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
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
  const { t, formatNumber } = usePortalTranslation();

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-4">
      <StatCard
        label={t("admin.teacherApplications.statsTotal")}
        value={isLoading ? "—" : stats.total}
        icon={<Briefcase className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisWeek > 0
            ? t("stats.thisWeek", { count: formatNumber(stats.newThisWeek) })
            : t("admin.teacherApplications.statsTotal")
        }
      />
      <StatCard
        label={t("admin.teacherApplications.statsReviewing")}
        value={isLoading ? "—" : stats.underReview}
        icon={<ClipboardList className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        hint={teacherApplicationsStatHint("underReview", stats, t, formatNumber)}
      />
      <StatCard
        label={t("admin.teacherApplications.statsApproved")}
        value={isLoading ? "—" : stats.approved}
        icon={<CheckCircle2 className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint={teacherApplicationsStatHint("approved", stats, t, formatNumber)}
      />
      <StatCard
        label={t("admin.studentRequests.statsRejected")}
        value={isLoading ? "-" : stats.rejected}
        icon={<XCircle className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        hint={teacherApplicationsStatHint("rejected", stats, t, formatNumber)}
      />
    </div>
  );
}
