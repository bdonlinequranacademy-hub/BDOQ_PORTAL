import { CheckCircle2, ClipboardList, UserPlus, XCircle } from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { IAdminStudentRequestsStats } from "@/features/admin/components/student-requests/adminStudentRequestsUtils";
import { studentRequestsStatHint } from "@/features/admin/components/student-requests/adminStudentRequestsUtils";

interface IAdminStudentRequestsStatsGridProps {
  stats: IAdminStudentRequestsStats;
  isLoading?: boolean;
}

export function AdminStudentRequestsStatsGrid({
  stats,
  isLoading,
}: IAdminStudentRequestsStatsGridProps) {
  const { t, formatNumber } = usePortalTranslation();

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-4">
      <StatCard
        label={t("admin.studentRequests.statsTotal")}
        value={isLoading ? "—" : stats.total}
        icon={<UserPlus className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisWeek > 0
            ? t("stats.thisWeek", { count: formatNumber(stats.newThisWeek) })
            : t("admin.studentRequests.statsTotal")
        }
      />
      <StatCard
        label={t("admin.studentRequests.statsPending")}
        value={isLoading ? "—" : stats.pending}
        icon={<ClipboardList className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={studentRequestsStatHint("pending", stats, t, formatNumber)}
      />
      <StatCard
        label={t("admin.studentRequests.statsApproved")}
        value={isLoading ? "—" : stats.approved}
        icon={<CheckCircle2 className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint={studentRequestsStatHint("approved", stats, t, formatNumber)}
      />
      <StatCard
        label={t("admin.studentRequests.statsRejected")}
        value={isLoading ? "—" : stats.rejected}
        icon={<XCircle className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        className="col-span-2 xl:col-span-1"
        hint={studentRequestsStatHint("rejected", stats, t, formatNumber)}
      />
    </div>
  );
}
