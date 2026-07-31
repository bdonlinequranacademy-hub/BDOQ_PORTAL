import {
  BookOpen,
  CalendarDays,
  Clock,
  PlayCircle,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { IAdminClassesStats } from "@/features/admin/components/classes/adminClassesUtils";

interface IAdminClassesStatsGridProps {
  stats: IAdminClassesStats;
  isLoading?: boolean;
}

export function AdminClassesStatsGrid({ stats, isLoading }: IAdminClassesStatsGridProps) {
  const { t, formatNumber } = usePortalTranslation();

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label={t("admin.classes.totalClasses")}
        value={isLoading ? "—" : stats.total}
        icon={<BookOpen className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={t("admin.classes.activeHint", { count: formatNumber(stats.active) })}
      />
      <StatCard
        label={t("admin.classes.enrolledStudents")}
        value={isLoading ? "—" : stats.enrolled}
        icon={<Users className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={t("admin.classes.acrossAllClasses")}
      />
      <StatCard
        label={t("admin.classes.weeklySchedule")}
        value={isLoading ? "—" : stats.scheduled}
        icon={<CalendarDays className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        hint={t("admin.classes.classesWithSchedule")}
      />
      <StatCard
        label={t("admin.classes.activeClasses")}
        value={isLoading ? "—" : stats.active}
        icon={<PlayCircle className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        hint={t("admin.classes.inactiveCount", {
          count: formatNumber(stats.total - stats.active),
        })}
      />
      <StatCard
        label={t("admin.classes.todaysClasses")}
        value={isLoading ? "—" : stats.today}
        icon={<Clock className="size-5 text-teal-600" />}
        iconBg="bg-teal/10"
        className="col-span-2 xl:col-span-1"
        hint={t("admin.classes.scheduledForToday")}
      />
    </div>
  );
}
