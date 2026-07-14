import {
  BookOpen,
  Percent,
  UserCheck,
  UserMinus,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import {
  pctOfTotal,
  type IAdminAttendanceStats,
} from "@/features/admin/components/attendance/adminAttendanceUtils";

interface IAdminAttendanceStatsGridProps {
  stats: IAdminAttendanceStats;
  isLoading?: boolean;
}

export function AdminAttendanceStatsGrid({
  stats,
  isLoading,
}: IAdminAttendanceStatsGridProps) {
  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label="Classes Tracked"
        value={isLoading ? "—" : stats.classesTracked}
        icon={<BookOpen className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint="With attendance records"
      />
      <StatCard
        label="Average Attendance"
        value={isLoading ? "—" : `${stats.averageAttendance}%`}
        icon={<Percent className="size-5 text-blue-600" />}
        iconBg="bg-blue-100"
        hint="Across tracked classes"
      />
      <StatCard
        label="Enrolled Students"
        value={isLoading ? "—" : stats.totalStudents}
        icon={<Users className="size-5 text-emerald-600" />}
        iconBg="bg-emerald-100"
        hint="Academy-wide total"
      />
      <StatCard
        label="Present Marks"
        value={isLoading ? "—" : stats.presentMarks}
        icon={<UserCheck className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={pctOfTotal(stats.presentMarks, stats.totalMarks)}
      />
      <StatCard
        label="Absent Marks"
        value={isLoading ? "—" : stats.absentMarks}
        icon={<UserMinus className="size-5 text-red-600" />}
        iconBg="bg-red-100"
        className="col-span-2 xl:col-span-1"
        hint={pctOfTotal(stats.absentMarks, stats.totalMarks)}
      />
    </div>
  );
}
