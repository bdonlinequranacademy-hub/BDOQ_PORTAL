import { Award, BarChart3, BookOpen, Target, UserCheck } from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import {
  pctOfTotal,
  type IAdminProgressStats,
} from "@/features/admin/components/progress/adminProgressUtils";

interface IAdminProgressStatsGridProps {
  stats: IAdminProgressStats;
  isLoading?: boolean;
}

function formatDelta(delta: number | null, suffix: string): string | undefined {
  if (delta === null) return undefined;
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta}% ${suffix}`;
}

function previousMonthLabel(): string {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function AdminProgressStatsGrid({ stats, isLoading }: IAdminProgressStatsGridProps) {
  const prevMonth = previousMonthLabel();

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label="Total Students"
        value={isLoading ? "—" : stats.totalStudents}
        icon={<BarChart3 className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.newThisMonth > 0
            ? `+${stats.newThisMonth} updated this month`
            : `${stats.totalRecords} progress records`
        }
      />
      <StatCard
        label="Avg. Tajweed Progress"
        value={isLoading ? "—" : `${stats.avgTajweed}%`}
        icon={<Target className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint={formatDelta(stats.tajweedDelta, `vs ${prevMonth}`) ?? "Academy-wide average"}
      />
      <StatCard
        label="Avg. Memorization Progress"
        value={isLoading ? "—" : `${stats.avgMemorization}%`}
        icon={<BookOpen className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={
          formatDelta(stats.memorizationDelta, `vs ${prevMonth}`) ??
          "Based on surahs & ayahs memorized"
        }
      />
      <StatCard
        label="Completed Surahs"
        value={isLoading ? "—" : stats.completedSurahs}
        icon={<Award className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint={
          stats.totalRecords > 0
            ? `${Math.round(stats.completedSurahs / stats.totalRecords)} avg per record`
            : "Across all records"
        }
      />
      <StatCard
        label="Students On Track"
        value={isLoading ? "—" : stats.studentsOnTrack}
        icon={<UserCheck className="size-5 text-teal-600" />}
        iconBg="bg-teal-100"
        hint={pctOfTotal(stats.studentsOnTrack, stats.totalStudents)}
      />
    </div>
  );
}
