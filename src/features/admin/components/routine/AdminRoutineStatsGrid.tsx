import { CalendarDays, Clock, PlayCircle, Users } from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import type { IAdminRoutineStats } from "@/features/admin/components/routine/adminRoutineUtils";

interface IAdminRoutineStatsGridProps {
  stats: IAdminRoutineStats;
  isLoading?: boolean;
}

export function AdminRoutineStatsGrid({ stats, isLoading }: IAdminRoutineStatsGridProps) {
  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label="Total Sessions"
        value={isLoading ? "—" : stats.total}
        icon={<CalendarDays className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint="Weekly session slots"
      />
      <StatCard
        label="Active Days"
        value={isLoading ? "—" : stats.activeDays}
        icon={<Users className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint="Out of 7 days"
      />
      <StatCard
        label="Live Now"
        value={isLoading ? "—" : stats.liveNow}
        icon={<PlayCircle className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={stats.liveNow === 1 ? "Class running" : "Classes running"}
      />
      <StatCard
        label="Upcoming"
        value={isLoading ? "—" : stats.upcomingToday}
        icon={<Clock className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint="Today · starting soon"
      />
      <StatCard
        label="Total Students"
        value={isLoading ? "—" : stats.uniqueStudents}
        icon={<Users className="size-5 text-teal-600" />}
        iconBg="bg-teal/10"
        className="col-span-2 xl:col-span-1"
        hint="Enrolled in routine"
      />
    </div>
  );
}
