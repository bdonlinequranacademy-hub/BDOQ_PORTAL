import {
  BookOpen,
  CalendarDays,
  Clock,
  PlayCircle,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import type { IAdminClassesStats } from "@/features/admin/components/classes/adminClassesUtils";

interface IAdminClassesStatsGridProps {
  stats: IAdminClassesStats;
  isLoading?: boolean;
}

export function AdminClassesStatsGrid({ stats, isLoading }: IAdminClassesStatsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-5">
      <StatCard
        label="Total Classes"
        value={isLoading ? "—" : stats.total}
        icon={<BookOpen className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={`${stats.active} active`}
      />
      <StatCard
        label="Enrolled Students"
        value={isLoading ? "—" : stats.enrolled}
        icon={<Users className="size-5 text-amber-600" />}
        iconBg="bg-amber-100"
        hint="Across all classes"
      />
      <StatCard
        label="Weekly Schedule"
        value={isLoading ? "—" : stats.scheduled}
        icon={<CalendarDays className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        hint="Classes with schedule"
      />
      <StatCard
        label="Active Classes"
        value={isLoading ? "—" : stats.active}
        icon={<PlayCircle className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        hint={`${stats.total - stats.active} inactive`}
      />
      <StatCard
        label="Today's Classes"
        value={isLoading ? "—" : stats.today}
        icon={<Clock className="size-5 text-teal-600" />}
        iconBg="bg-teal/10"
        className="col-span-2 xl:col-span-1"
        hint="Scheduled for today"
      />
    </div>
  );
}
