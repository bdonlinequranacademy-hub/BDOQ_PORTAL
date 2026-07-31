import { CalendarDays, Clock, PlayCircle, Users } from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import { usePortalTranslation } from "@/i18n/LocaleProvider";
import type { IAdminRoutineStats } from "@/features/admin/components/routine/adminRoutineUtils";

interface IAdminRoutineStatsGridProps {
  stats: IAdminRoutineStats;
  isLoading?: boolean;
}

export function AdminRoutineStatsGrid({ stats, isLoading }: IAdminRoutineStatsGridProps) {
  const { t } = usePortalTranslation();

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label={t("admin.routine.stats.totalSessions")}
        value={isLoading ? "—" : stats.total}
        icon={<CalendarDays className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={t("admin.routine.stats.totalSessionsHint")}
      />
      <StatCard
        label={t("admin.routine.stats.activeDays")}
        value={isLoading ? "—" : stats.activeDays}
        icon={<Users className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={t("admin.routine.stats.activeDaysHint")}
      />
      <StatCard
        label={t("admin.routine.stats.liveNow")}
        value={isLoading ? "—" : stats.liveNow}
        icon={<PlayCircle className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={
          stats.liveNow === 1
            ? t("admin.routine.stats.classRunning")
            : t("admin.routine.stats.classesRunning")
        }
      />
      <StatCard
        label={t("admin.routine.stats.upcoming")}
        value={isLoading ? "—" : stats.upcomingToday}
        icon={<Clock className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint={t("admin.routine.stats.upcomingHint")}
      />
      <StatCard
        label={t("admin.routine.stats.totalStudents")}
        value={isLoading ? "—" : stats.uniqueStudents}
        icon={<Users className="size-5 text-teal-600" />}
        iconBg="bg-teal/10"
        className="col-span-2 xl:col-span-1"
        hint={t("admin.routine.stats.totalStudentsHint")}
      />
    </div>
  );
}
