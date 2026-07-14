import {
  Banknote,
  CalendarClock,
  Clock,
  ClipboardList,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/ui/shared/StatCard";
import type { AdminClass } from "@/types/models";
import { formatDuration, studentCount } from "@/lib/utils/class";
import { getNextScheduleInfo } from "@/features/admin/components/class-detail/adminClassDetailUtils";

interface IAdminClassDetailStatsProps {
  cls: AdminClass;
  sessionLogCount: number;
}

export function AdminClassDetailStats({ cls, sessionLogCount }: IAdminClassDetailStatsProps) {
  const enrolled = studentCount(cls);
  const nextSession = getNextScheduleInfo(cls.schedule);

  return (
    <div className="grid grid-cols-2 items-start gap-2.5 sm:gap-3 xl:grid-cols-5">
      <StatCard
        label="Enrolled Students"
        value={enrolled}
        icon={<Users className="size-5 text-primary" />}
        iconBg="bg-primary/10"
        hint={`${enrolled} student${enrolled === 1 ? "" : "s"} in class`}
      />
      {cls.sessionRateBdt != null ? (
        <StatCard
          label="Session Rate"
          value={`BDT ${cls.sessionRateBdt}`}
          icon={<Banknote className="size-5 text-amber-600" />}
          iconBg="bg-amber-100"
          hint="Per session"
        />
      ) : null}
      {cls.schedule?.duration ? (
        <StatCard
          label="Duration"
          value={formatDuration(cls.schedule.duration)}
          icon={<Clock className="size-5 text-blue-600" />}
          iconBg="bg-blue-100"
          hint="Per session"
        />
      ) : null}
      <StatCard
        label="Session Logs"
        value={sessionLogCount}
        icon={<ClipboardList className="size-5 text-violet-600" />}
        iconBg="bg-violet-100"
        hint="Recorded class sessions"
      />
      {nextSession ? (
        <StatCard
          label="Next Session"
          value={nextSession.label}
          icon={<CalendarClock className="size-5 text-teal-600" />}
          iconBg="bg-teal/10"
          className="col-span-2 xl:col-span-1"
          hint={nextSession.hint}
        />
      ) : (
        <StatCard
          label="Schedule"
          value="—"
          icon={<CalendarClock className="size-5 text-teal-600" />}
          iconBg="bg-teal/10"
          className="col-span-2 xl:col-span-1"
          hint="No weekly schedule set"
        />
      )}
    </div>
  );
}
