import {
  BookOpen,
  Percent,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import type { IAdminAttendanceStats } from "@/features/admin/components/attendance/adminAttendanceUtils";
import { usePortalTranslation } from "@/i18n/LocaleProvider";

interface IAdminAttendanceStatsGridProps {
  stats: IAdminAttendanceStats;
  isLoading?: boolean;
}

export function AdminAttendanceStatsGrid({
  stats,
  isLoading,
}: IAdminAttendanceStatsGridProps) {
  const { t, formatNumber } = usePortalTranslation();

  const pctOfTotalLabel = (part: number, total: number): string => {
    const pctValue =
      total <= 0 ? 0 : Math.round((part / total) * 1000) / 10;
    return t("labels.of_total", { pct: `${formatNumber(pctValue)}%` });
  };

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label={t("admin.attendance.statsClassesTracked")}
        value={isLoading ? "—" : formatNumber(stats.classesTracked)}
        icon={<BookOpen className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={t("admin.attendance.statsWithRecords")}
      />
      <StatCard
        label={t("admin.attendance.statsAverageAttendance")}
        value={isLoading ? "—" : `${formatNumber(stats.averageAttendance)}%`}
        icon={<Percent className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        hint={t("admin.attendance.statsAcrossClasses")}
      />
      <StatCard
        label={t("admin.attendance.statsEnrolledStudents")}
        value={isLoading ? "—" : formatNumber(stats.totalStudents)}
        icon={<Users className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint={t("admin.attendance.statsAcademyWideTotal")}
      />
      <StatCard
        label={t("admin.attendance.statsPresentMarks")}
        value={isLoading ? "—" : formatNumber(stats.presentMarks)}
        icon={<UserCheck className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={pctOfTotalLabel(stats.presentMarks, stats.totalMarks)}
      />
      <StatCard
        label={t("admin.attendance.statsAbsentMarks")}
        value={isLoading ? "—" : formatNumber(stats.absentMarks)}
        icon={<UserMinus className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        className="col-span-2 xl:col-span-1"
        hint={pctOfTotalLabel(stats.absentMarks, stats.totalMarks)}
      />
    </div>
  );
}
