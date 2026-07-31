import { Award, BarChart3, BookOpen, Target, UserCheck } from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { IAdminProgressStats } from "@/features/admin/components/progress/adminProgressUtils";

interface IAdminProgressStatsGridProps {
  stats: IAdminProgressStats;
  isLoading?: boolean;
}

function formatPctOfTotal(
  part: number,
  total: number,
  formatNumber: (value: number) => string,
  t: (key: string, params?: Record<string, string>) => string
): string {
  if (total <= 0) {
    return t("labels.of_total", { pct: `${formatNumber(0)}%` });
  }
  const pct = Math.round((part / total) * 1000) / 10;
  return t("labels.of_total", { pct: `${formatNumber(pct)}%` });
}

export function AdminProgressStatsGrid({ stats, isLoading }: IAdminProgressStatsGridProps) {
  const { t, formatDate, formatNumber } = usePortalTranslation();

  const prevMonthDate = new Date();
  prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
  prevMonthDate.setDate(1);
  const prevMonth = formatDate(prevMonthDate.toISOString());

  const formatDelta = (delta: number | null): string | undefined => {
    if (delta === null) return undefined;
    const sign = delta >= 0 ? "+" : "";
    return t("admin.progress.vsPreviousMonth", {
      delta: `${sign}${formatNumber(delta)}%`,
      month: prevMonth,
    });
  };

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label={t("admin.progress.totalStudents")}
        value={isLoading ? "—" : stats.totalStudents}
        icon={<BarChart3 className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisMonth > 0
            ? t("admin.progress.updatedThisMonth", { count: String(stats.newThisMonth) })
            : t("admin.progress.progressRecords", { count: String(stats.totalRecords) })
        }
      />
      <StatCard
        label={t("admin.progress.avgTajweed")}
        value={isLoading ? "—" : `${formatNumber(stats.avgTajweed)}%`}
        icon={<Target className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint={formatDelta(stats.tajweedDelta) ?? t("admin.progress.academyWideAverage")}
      />
      <StatCard
        label={t("admin.progress.avgMemorization")}
        value={isLoading ? "—" : `${formatNumber(stats.avgMemorization)}%`}
        icon={<BookOpen className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={
          formatDelta(stats.memorizationDelta) ?? t("admin.progress.basedOnSurahs")
        }
      />
      <StatCard
        label={t("admin.progress.completedSurahs")}
        value={isLoading ? "—" : stats.completedSurahs}
        icon={<Award className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={
          stats.totalRecords > 0
            ? t("admin.progress.avgPerRecord", {
                count: String(Math.round(stats.completedSurahs / stats.totalRecords)),
              })
            : t("admin.progress.acrossAllRecords")
        }
      />
      <StatCard
        label={t("admin.progress.studentsOnTrack")}
        value={isLoading ? "—" : stats.studentsOnTrack}
        icon={<UserCheck className="size-5 text-teal-600" />}
        iconBg="bg-teal-100"
        hint={formatPctOfTotal(stats.studentsOnTrack, stats.totalStudents, formatNumber, t)}
      />
    </div>
  );
}
