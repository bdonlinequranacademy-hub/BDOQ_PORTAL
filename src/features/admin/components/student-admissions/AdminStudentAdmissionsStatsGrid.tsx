import {
  CheckCircle2,
  ClipboardList,
  GraduationCap,
  PieChart,
  XCircle,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { IAdminStudentAdmissionsStats } from "@/features/admin/components/student-admissions/adminStudentAdmissionsUtils";

interface IAdminStudentAdmissionsStatsGridProps {
  stats: IAdminStudentAdmissionsStats;
  isLoading?: boolean;
}

export function AdminStudentAdmissionsStatsGrid({
  stats,
  isLoading,
}: IAdminStudentAdmissionsStatsGridProps) {
  const { t, statusLabel, formatNumber } = usePortalTranslation();

  function pct(part: number, total: number): string {
    if (total <= 0) return t("stats.zeroOfTotal");
    return t("stats.ofTotal", {
      pct: formatNumber(Math.round((part / total) * 100)),
    });
  }

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label={t("admin.admissions.statsTotal")}
        value={isLoading ? "—" : stats.total}
        icon={<GraduationCap className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisWeek > 0
            ? t("stats.thisWeek", { count: formatNumber(stats.newThisWeek) })
            : t("admin.admissions.statsTotal")
        }
      />
      <StatCard
        label={t("admin.admissions.statsReviewing")}
        value={isLoading ? "—" : stats.underReview}
        icon={<ClipboardList className="size-5 text-orange-600" />}
        iconBg="bg-orange-100"
        hint={
          stats.pending > 0
            ? `${formatNumber(stats.pending)} ${statusLabel("pending").toLowerCase()}`
            : pct(stats.underReview, stats.total)
        }
      />
      <StatCard
        label={t("admin.admissions.statsApproved")}
        value={isLoading ? "—" : stats.approved}
        icon={<CheckCircle2 className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint={pct(stats.approved, stats.total)}
      />
      <StatCard
        label={t("admin.admissions.statsClosed")}
        value={isLoading ? "—" : stats.rejected}
        icon={<XCircle className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        hint={pct(stats.rejected, stats.total)}
      />
      <StatCard
        label={t("admin.admissions.statsConversion")}
        value={isLoading ? "—" : `${formatNumber(stats.conversionRate)}%`}
        icon={<PieChart className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        className="col-span-2 xl:col-span-1"
        hint={t("admin.admissions.sidebarApprovedCount", {
          count: formatNumber(stats.approved),
        })}
      />
    </div>
  );
}
